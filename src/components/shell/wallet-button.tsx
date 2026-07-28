import { useEffect } from "react";
import { Button } from "../ui/button";
import { useWalletStore } from "../../store/wallet";
import { useNetworkStore } from "../../store/network";
import { toast } from "../../store/toast";
import { truncateMiddle } from "../../lib/format";

/**
 * Real Lace integration: v4 connector discovery → connect(networkId).
 * Graceful "Install Lace" state when no 4.x connector is injected.
 */
export function WalletButton() {
  const { status, unshieldedAddress, dustBalance, connect, disconnect, checkAvailability } =
    useWalletStore();
  const networkId = useNetworkStore((s) => s.networkId);

  useEffect(() => {
    // extensions inject asynchronously — check after a beat
    const t = window.setTimeout(checkAvailability, 1200);
    return () => window.clearTimeout(t);
  }, [checkAvailability]);

  if (status === "connected") {
    return (
      <button
        type="button"
        onClick={disconnect}
        title="Disconnect wallet"
        aria-label={`Wallet connected${unshieldedAddress ? `: ${unshieldedAddress}` : ""}. Disconnect.`}
        className="group inline-flex items-center gap-2 rounded-[2px] border border-phosphor/40 px-2.5 py-1.5 font-mono text-[10px] font-medium tracking-[0.08em] text-phosphor transition-colors hover:border-danger/50 hover:text-danger"
      >
        <span aria-hidden="true" className="size-1.5 rounded-full bg-phosphor group-hover:bg-danger" />
        <span className="uppercase">
          {unshieldedAddress ? truncateMiddle(unshieldedAddress, 8, 4) : "Connected"}
        </span>
        {dustBalance && <span className="hidden text-fog sm:inline">{dustBalance} DUST</span>}
      </button>
    );
  }

  if (status === "unavailable") {
    return (
      <a
        href="https://www.lace.io"
        target="_blank"
        rel="noreferrer"
        className="inline-flex h-8 items-center rounded-[2px] border border-line-strong px-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-fog transition-colors hover:border-fog hover:text-bone"
      >
        Install Lace ↗
      </a>
    );
  }

  return (
    <Button
      size="sm"
      variant="secondary"
      loading={status === "connecting"}
      onClick={() => {
        void connect(networkId).then(() => {
          const s = useWalletStore.getState();
          if (s.status === "connected") toast.success("Wallet connected");
          else if (s.error) toast.error("Wallet connection failed", s.error);
        });
      }}
    >
      {status === "connecting" ? "Awaiting approval" : "Connect wallet"}
    </Button>
  );
}
