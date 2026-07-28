/**
 * Client-side privacy primitives. This is the real architecture, not
 * decoration: every mandate / bid / workroom payload is encrypted in the
 * browser BEFORE it reaches the API, and the server only ever stores
 * ciphertext, commitments, and nullifiers.
 *
 * - AES-256-GCM (WebCrypto) with a per-mandate symmetric key
 * - SHA-256 digests for artifacts
 * - commitment = SHA-256(domainSeparator || payload || salt) with a fresh
 *   random 32-byte salt per commitment (PRD 13.4: randomness must never be
 *   reused), salt retained locally so the opening can be proven later.
 */
import { bytesToHex, hexToBytes } from "./identity";

const KEYRING_KEY = "zyn.keys.mandate";
const BIDKEY_KEY = "zyn.keys.bid";
const SALT_KEY = "zyn.salts";

export interface EncryptedPayload {
  ciphertext: string; // hex
  nonce: string; // hex, 12-byte AES-GCM IV
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function randomHex(bytes = 32): string {
  const buf = crypto.getRandomValues(new Uint8Array(bytes));
  return bytesToHex(buf);
}

export async function sha256Hex(data: Uint8Array | string): Promise<string> {
  const bytes = typeof data === "string" ? encoder.encode(data) : data;
  const copy = new Uint8Array(bytes); // ensure a plain ArrayBuffer backing
  const digest = await crypto.subtle.digest("SHA-256", copy);
  return bytesToHex(new Uint8Array(digest));
}

/* ---------------------------------- keys ---------------------------------- */

export async function generateSymmetricKeyHex(): Promise<string> {
  const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, [
    "encrypt",
    "decrypt",
  ]);
  const raw = await crypto.subtle.exportKey("raw", key);
  return bytesToHex(new Uint8Array(raw));
}

async function importKey(keyHex: string): Promise<CryptoKey> {
  const raw = new Uint8Array(hexToBytes(keyHex));
  if (raw.length !== 32) throw new Error("Symmetric key must be 32 bytes of hex");
  return crypto.subtle.importKey("raw", raw, { name: "AES-GCM" }, false, [
    "encrypt",
    "decrypt",
  ]);
}

/* ------------------------------- encryption ------------------------------- */

export async function encryptBytes(
  keyHex: string,
  plaintext: Uint8Array,
): Promise<EncryptedPayload> {
  const key = await importKey(keyHex);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = new Uint8Array(plaintext);
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, data);
  return { ciphertext: bytesToHex(new Uint8Array(ciphertext)), nonce: bytesToHex(iv) };
}

export async function decryptBytes(
  keyHex: string,
  payload: EncryptedPayload,
): Promise<Uint8Array> {
  const key = await importKey(keyHex);
  const iv = new Uint8Array(hexToBytes(payload.nonce));
  const data = new Uint8Array(hexToBytes(payload.ciphertext));
  const plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
  return new Uint8Array(plaintext);
}

export async function encryptJson(keyHex: string, value: unknown): Promise<EncryptedPayload> {
  return encryptBytes(keyHex, encoder.encode(JSON.stringify(value)));
}

export async function decryptJson<T>(keyHex: string, payload: EncryptedPayload): Promise<T> {
  const bytes = await decryptBytes(keyHex, payload);
  return JSON.parse(decoder.decode(bytes)) as T;
}

/* ------------------------------- commitments ------------------------------ */

export interface Commitment {
  commitment: string; // hex sha-256
  salt: string; // hex 32 bytes, kept locally
}

/**
 * commitment = SHA-256(domainSeparator || payload || salt).
 * The salt is returned AND stored locally keyed by the commitment so the
 * opening can be produced later (e.g. during an authorized dispute).
 */
export async function makeCommitment(
  domainSeparator: string,
  payload: string,
): Promise<Commitment> {
  const salt = randomHex(32);
  const commitment = await sha256Hex(
    ed25519Concat(encoder.encode(domainSeparator), encoder.encode(payload), hexToBytes(salt)),
  );
  storeSalt(commitment, salt);
  return { commitment, salt };
}

function ed25519Concat(...arrays: Uint8Array[]): Uint8Array {
  const total = arrays.reduce((n, a) => n + a.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const a of arrays) {
    out.set(a, offset);
    offset += a.length;
  }
  return out;
}

/* ----------------------------- local key store ---------------------------- */

function readMap(storageKey: string): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(storageKey) ?? "{}") as Record<string, string>;
  } catch {
    return {};
  }
}

function writeMap(storageKey: string, map: Record<string, string>): void {
  localStorage.setItem(storageKey, JSON.stringify(map));
}

/** Per-mandate workroom key (AES-256), stored locally keyed by mandate id. */
export function storeMandateKey(mandateId: string, keyHex: string): void {
  const map = readMap(KEYRING_KEY);
  map[mandateId] = keyHex;
  writeMap(KEYRING_KEY, map);
}

export function getMandateKey(mandateId: string): string | null {
  return readMap(KEYRING_KEY)[mandateId] ?? null;
}

/** Per-mandate sealed-bid key (one bid per operator per mandate). */
export function storeBidKey(mandateId: string, keyHex: string): void {
  const map = readMap(BIDKEY_KEY);
  map[mandateId] = keyHex;
  writeMap(BIDKEY_KEY, map);
}

export function getBidKey(mandateId: string): string | null {
  return readMap(BIDKEY_KEY)[mandateId] ?? null;
}

export function storeSalt(commitment: string, salt: string): void {
  const map = readMap(SALT_KEY);
  map[commitment] = salt;
  writeMap(SALT_KEY, map);
}

export function getSalt(commitment: string): string | null {
  return readMap(SALT_KEY)[commitment] ?? null;
}

/** Export the full local keyring (mandate keys + bid keys + salts) as JSON. */
export function exportKeyring(): string {
  return JSON.stringify(
    {
      mandateKeys: readMap(KEYRING_KEY),
      bidKeys: readMap(BIDKEY_KEY),
      salts: readMap(SALT_KEY),
    },
    null,
    2,
  );
}

/** Merge an exported keyring back in. Throws on malformed input. */
export function importKeyring(json: string): void {
  const parsed = JSON.parse(json) as {
    mandateKeys?: Record<string, string>;
    bidKeys?: Record<string, string>;
    salts?: Record<string, string>;
  };
  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("Keyring must be a JSON object");
  }
  writeMap(KEYRING_KEY, { ...readMap(KEYRING_KEY), ...(parsed.mandateKeys ?? {}) });
  writeMap(BIDKEY_KEY, { ...readMap(BIDKEY_KEY), ...(parsed.bidKeys ?? {}) });
  writeMap(SALT_KEY, { ...readMap(SALT_KEY), ...(parsed.salts ?? {}) });
}
