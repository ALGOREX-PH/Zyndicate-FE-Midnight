import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SessionStatus =
  | "anonymous" // identity exists, not yet authenticated with the API
  | "authenticating"
  | "authenticated"
  | "offline"; // API unreachable — app remains browsable

interface SessionState {
  /** Zyndicate identity public key (hex) — distinct from the wallet. */
  publicKey: string | null;
  token: string | null;
  displayName: string | null;
  status: SessionStatus;
  setPublicKey: (publicKey: string) => void;
  setSession: (token: string, displayName?: string | null) => void;
  setStatus: (status: SessionStatus) => void;
  setDisplayName: (displayName: string | null) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      publicKey: null,
      token: null,
      displayName: null,
      status: "anonymous",
      setPublicKey: (publicKey) => set({ publicKey }),
      setSession: (token, displayName = null) =>
        set({ token, displayName, status: "authenticated" }),
      setStatus: (status) => set({ status }),
      setDisplayName: (displayName) => set({ displayName }),
      clearSession: () => set({ token: null, displayName: null, status: "anonymous" }),
    }),
    {
      name: "zyn.session",
      partialize: (s) => ({ token: s.token, displayName: s.displayName }),
    },
  ),
);
