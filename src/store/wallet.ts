import { create } from "zustand";
import type { ConnectedAPI } from "@midnight-ntwrk/dapp-connector-api";
import { connectToWallet, isWalletAvailable } from "../midnight/connect-wallet";
import type { AppNetworkId } from "../midnight/config";

export type WalletStatus =
  | "idle"
  | "unavailable" // no 4.x connector injected — show "Install Lace"
  | "connecting"
  | "connected"
  | "error";

interface WalletState {
  status: WalletStatus;
  api: ConnectedAPI | null;
  unshieldedAddress: string | null;
  dustBalance: string | null;
  nightBalance: string | null;
  error: string | null;
  connect: (networkId: AppNetworkId) => Promise<void>;
  disconnect: () => void;
  checkAvailability: () => void;
}

function formatUnits(value: bigint, decimals = 6): string {
  const base = 10n ** BigInt(decimals);
  const whole = value / base;
  const frac = ((value % base) * 100n) / base; // 2 decimal places
  return `${whole}.${frac.toString().padStart(2, "0")}`;
}

export const useWalletStore = create<WalletState>()((set) => ({
  status: "idle",
  api: null,
  unshieldedAddress: null,
  dustBalance: null,
  nightBalance: null,
  error: null,

  checkAvailability: () => {
    if (!isWalletAvailable()) set({ status: "unavailable" });
  },

  connect: async (networkId) => {
    set({ status: "connecting", error: null });
    try {
      const api = await connectToWallet(networkId);
      let unshieldedAddress: string | null = null;
      let dustBalance: string | null = null;
      let nightBalance: string | null = null;
      // Balance surfaces vary by wallet build — read defensively.
      try {
        unshieldedAddress = (await api.getUnshieldedAddress()).unshieldedAddress;
      } catch {
        /* address unavailable — keep null */
      }
      try {
        dustBalance = formatUnits((await api.getDustBalance()).balance);
      } catch {
        /* dust unavailable */
      }
      try {
        const balances = await api.getUnshieldedBalances();
        const total = Object.values(balances).reduce((n, v) => n + v, 0n);
        nightBalance = formatUnits(total);
      } catch {
        /* balances unavailable */
      }
      set({ status: "connected", api, unshieldedAddress, dustBalance, nightBalance });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      set({
        status: isWalletAvailable() ? "error" : "unavailable",
        api: null,
        error: message,
      });
    }
  },

  disconnect: () =>
    set({
      status: "idle",
      api: null,
      unshieldedAddress: null,
      dustBalance: null,
      nightBalance: null,
      error: null,
    }),
}));
