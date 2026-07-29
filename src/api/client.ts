/**
 * Typed fetch client for the Zyndicate backend (base /api/v1, proxied to
 * http://localhost:4000 in dev — see vite.config.ts).
 *
 * - injects the Bearer token from the session store
 * - normalizes errors: backend shape { error: { code, message } } → ApiError
 * - validates every response against a zod schema
 */
import type { z } from "zod";
import { useSessionStore } from "../store/session";

/**
 * Where the coordination service lives.
 *
 * In development this stays relative and Vite proxies `/api` to localhost:4000.
 * In a deployed build set `VITE_API_BASE_URL` to the API origin (e.g. the
 * Render service URL) — that origin must also list this site in CORS_ORIGINS.
 * Leaving it unset keeps the relative path, which is what you want if the host
 * rewrites `/api` to the backend itself.
 */
const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/+$/, "");
const BASE = `${API_ORIGIN}/api/v1`;

export class ApiError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

export function isApiError(e: unknown): e is ApiError {
  return e instanceof ApiError;
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  /** default true — set false for pre-auth endpoints */
  auth?: boolean;
}

export async function api<Schema extends z.ZodTypeAny>(
  schema: Schema,
  path: string,
  options: RequestOptions = {},
): Promise<z.infer<Schema>> {
  const { method = "GET", body, auth = true } = options;
  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = useSessionStore.getState().token;
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${BASE}${path}`, {
      method,
      headers,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  } catch {
    useSessionStore.getState().setStatus("offline");
    throw new ApiError("network_unreachable", "The Zyndicate API is unreachable.", 0);
  }

  if (!response.ok) {
    let code = "unknown_error";
    let message = `Request failed (${response.status})`;
    try {
      const payload = (await response.json()) as {
        error?: { code?: string; message?: string };
      };
      if (payload?.error?.code) code = payload.error.code;
      if (payload?.error?.message) message = payload.error.message;
    } catch {
      /* non-JSON error body — keep defaults */
    }
    if (response.status === 401) {
      useSessionStore.getState().clearSession();
    }
    throw new ApiError(code, message, response.status);
  }

  if (response.status === 204) {
    return schema.parse({});
  }

  let json: unknown;
  try {
    json = await response.json();
  } catch {
    json = {};
  }
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    throw new ApiError(
      "malformed_response",
      "The API returned a response the client does not understand.",
      response.status,
    );
  }
  return parsed.data;
}

/** Build a query string from defined, non-empty params. */
export function qs(params: Record<string, string | number | boolean | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") continue;
    search.set(key, String(value));
  }
  const s = search.toString();
  return s ? `?${s}` : "";
}
