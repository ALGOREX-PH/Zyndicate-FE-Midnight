/**
 * Zyndicate identity — an app-level ed25519 keypair, deliberately DISTINCT
 * from the Midnight wallet identity (PRD 11.1: wallet identity, Zyndicate
 * identity, and mandate-specific identity may differ).
 *
 * The secret key never leaves this device unless the user explicitly exports
 * it (Settings → Identity). It signs backend auth challenges of the form
 * `zyndicate:auth:<nonce>`.
 */
import * as ed from "@noble/ed25519";
import { sha512 } from "@noble/hashes/sha512";

// noble-ed25519 v2 requires a sha512 implementation for its sync API.
ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));

const STORAGE_KEY = "zyn.identity.secret";

export interface ZyndicateIdentity {
  secretHex: string;
  publicHex: string;
}

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function hexToBytes(hex: string): Uint8Array {
  const clean = hex.trim().toLowerCase().replace(/^0x/, "");
  if (clean.length % 2 !== 0 || /[^0-9a-f]/.test(clean)) {
    throw new Error("Invalid hex string");
  }
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

/** Load the identity from localStorage, creating one on first use. */
export function getOrCreateIdentity(): ZyndicateIdentity {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing) {
    try {
      const secret = hexToBytes(existing);
      if (secret.length === 32) {
        return { secretHex: existing, publicHex: bytesToHex(ed.getPublicKey(secret)) };
      }
    } catch {
      // fall through and regenerate
    }
  }
  const secret = ed.utils.randomPrivateKey();
  const secretHex = bytesToHex(secret);
  localStorage.setItem(STORAGE_KEY, secretHex);
  return { secretHex, publicHex: bytesToHex(ed.getPublicKey(secret)) };
}

export function getPublicKeyHex(): string {
  return getOrCreateIdentity().publicHex;
}

/** Secret material used only for local derivations (nullifiers) — never sent. */
export function getSecretHex(): string {
  return getOrCreateIdentity().secretHex;
}

/** Sign the backend auth challenge: ed25519 over utf8 `zyndicate:auth:<nonce>`. */
export function signAuthChallenge(nonce: string): string {
  const { secretHex } = getOrCreateIdentity();
  const message = new TextEncoder().encode(`zyndicate:auth:${nonce}`);
  const signature = ed.sign(message, hexToBytes(secretHex));
  return bytesToHex(signature);
}

/** Export the raw secret key (hex) for backup. Treat as a credential. */
export function exportIdentity(): string {
  return getOrCreateIdentity().secretHex;
}

/** Replace the current identity with an imported 32-byte hex secret. */
export function importIdentity(secretHexInput: string): ZyndicateIdentity {
  const secret = hexToBytes(secretHexInput);
  if (secret.length !== 32) {
    throw new Error("Identity secret must be exactly 32 bytes of hex");
  }
  const secretHex = bytesToHex(secret);
  localStorage.setItem(STORAGE_KEY, secretHex);
  return { secretHex, publicHex: bytesToHex(ed.getPublicKey(secret)) };
}

/** Destroy the stored identity. A new one is generated on next access. */
export function resetIdentity(): void {
  localStorage.removeItem(STORAGE_KEY);
}
