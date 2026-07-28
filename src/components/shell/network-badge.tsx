import { Link } from "react-router";
import { NETWORKS } from "../../midnight/config";
import { useNetworkStore } from "../../store/network";

/** Current Midnight network — always visible, links to Settings. */
export function NetworkBadge() {
  const networkId = useNetworkStore((s) => s.networkId);
  const network = NETWORKS[networkId];

  return (
    <Link
      to="/settings"
      aria-label={`Network: ${network.label}. Change in settings.`}
      className="inline-flex items-center gap-1.5 rounded-[2px] border border-line-strong px-2 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-fog transition-colors hover:border-fog hover:text-bone"
    >
      <span
        aria-hidden="true"
        className="size-1.5 rounded-full bg-vio"
      />
      {network.label}
    </Link>
  );
}
