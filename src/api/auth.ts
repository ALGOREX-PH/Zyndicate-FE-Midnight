/**
 * Auth: challenge → ed25519 signature → Bearer JWT.
 * The Zyndicate identity keypair (src/lib/identity.ts) signs
 * `zyndicate:auth:<nonce>`; the wallet is never involved in API auth.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";
import { ChallengeSchema, IdentitySchema, VerifySchema } from "./schemas";
import { getPublicKeyHex, signAuthChallenge } from "../lib/identity";
import { useSessionStore } from "../store/session";

export async function login(): Promise<void> {
  const store = useSessionStore.getState();
  const publicKey = getPublicKeyHex();
  store.setPublicKey(publicKey);
  store.setStatus("authenticating");
  try {
    const { nonce } = await api(ChallengeSchema, "/auth/challenge", {
      method: "POST",
      body: { publicKey },
      auth: false,
    });
    const signature = signAuthChallenge(nonce);
    const result = await api(VerifySchema, "/auth/verify", {
      method: "POST",
      body: { publicKey, nonce, signature },
      auth: false,
    });
    store.setSession(result.token, result.identity?.displayName ?? null);
  } catch (e) {
    store.setStatus("offline");
    throw e;
  }
}

/** Authenticate once at app boot; quiet failure keeps the app browsable. */
export function useEnsureSession(): void {
  const status = useSessionStore((s) => s.status);
  const token = useSessionStore((s) => s.token);
  useQuery({
    queryKey: ["session", "boot"],
    queryFn: async () => {
      await login();
      return true;
    },
    enabled: !token && status === "anonymous",
    retry: false,
    staleTime: Infinity,
  });
  // restore identity chip for persisted sessions
  const publicKey = useSessionStore((s) => s.publicKey);
  if (!publicKey) {
    useSessionStore.getState().setPublicKey(getPublicKeyHex());
    if (token) useSessionStore.getState().setStatus("authenticated");
  }
}

export function useMe() {
  const token = useSessionStore((s) => s.token);
  return useQuery({
    queryKey: ["me"],
    queryFn: () => api(IdentitySchema, "/me"),
    enabled: !!token,
  });
}

export function useUpdateDisplayName() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (displayName: string) =>
      api(IdentitySchema, "/me", { method: "PUT", body: { displayName } }),
    onSuccess: (identity) => {
      useSessionStore.getState().setDisplayName(identity.displayName ?? null);
      void queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

/** Re-authenticate manually (Settings / identity chip). */
export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      void queryClient.invalidateQueries();
    },
  });
}
