import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppNetworkId } from "../midnight/config";

interface NetworkState {
  networkId: AppNetworkId;
  setNetwork: (id: AppNetworkId) => void;
}

export const useNetworkStore = create<NetworkState>()(
  persist(
    (set) => ({
      networkId: "undeployed",
      setNetwork: (networkId) => set({ networkId }),
    }),
    { name: "zyn.network" },
  ),
);
