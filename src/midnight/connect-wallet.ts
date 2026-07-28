/**
 * Lace wallet discovery + connection via the Midnight DApp connector v4.
 * Wallets inject under `window.midnight.{uuid}` (freshly generated UUID —
 * never hardcode `window.midnight.mnLace`, that is the legacy API). Discover
 * by `apiVersion` semver, then `connect(networkId)` returns the ConnectedAPI.
 */
import type { ConnectedAPI, InitialAPI } from "@midnight-ntwrk/dapp-connector-api";
import semver from "semver";

export type MidnightNetworkId = "undeployed" | "preview" | "preprod" | "mainnet";

declare global {
  interface Window {
    midnight?: Record<string, InitialAPI>;
  }
}

const findWallet = (): InitialAPI | undefined =>
  Object.values(window.midnight ?? {}).find(
    (w): w is InitialAPI =>
      !!w && typeof w === "object" && "apiVersion" in w && semver.satisfies(w.apiVersion, "4.x"),
  );

/** True if a 4.x connector is currently injected (no connection attempt). */
export const isWalletAvailable = (): boolean => findWallet() !== undefined;

export const connectToWallet = async (
  networkId: MidnightNetworkId,
  timeoutMs = 1_000, // extensions inject asynchronously — poll every 100ms for 1s
): Promise<ConnectedAPI> => {
  const deadline = Date.now() + timeoutMs;
  let wallet = findWallet();
  while (!wallet && Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 100));
    wallet = findWallet();
  }
  if (!wallet) throw new Error("No Midnight wallet with a 4.x DApp connector found — install Lace.");
  const api = await wallet.connect(networkId); // opens approval UI; rejects if declined/wrong net
  await api.getConnectionStatus(); // throws early if the session is unusable
  return api;
};
