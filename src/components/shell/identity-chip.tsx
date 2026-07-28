import { Link } from "react-router";
import { useSessionStore } from "../../store/session";
import { truncateMiddle } from "../../lib/format";
import { cx } from "../../lib/format";

const statusMeta = {
  anonymous: { label: "Not signed in", dot: "bg-dim" },
  authenticating: { label: "Signing in", dot: "bg-amber" },
  authenticated: { label: "Signed in", dot: "bg-phosphor" },
  offline: { label: "API offline", dot: "bg-danger" },
} as const;

/** Zyndicate identity (app keypair — not the wallet). Links to the passport. */
export function IdentityChip() {
  const publicKey = useSessionStore((s) => s.publicKey);
  const displayName = useSessionStore((s) => s.displayName);
  const status = useSessionStore((s) => s.status);
  const meta = statusMeta[status];

  return (
    <Link
      to="/passport"
      aria-label={`Zyndicate identity ${displayName ?? (publicKey ? truncateMiddle(publicKey, 8, 4) : "initializing")} — ${meta.label}. Open passport.`}
      className="inline-flex items-center gap-2 rounded-[2px] border border-line-strong px-2.5 py-1.5 transition-colors hover:border-fog"
    >
      <span aria-hidden="true" className={cx("size-1.5 rounded-full", meta.dot)} />
      <span className="max-w-28 truncate font-mono text-[10px] font-medium tracking-[0.08em] text-bone">
        {displayName ?? (publicKey ? truncateMiddle(publicKey, 8, 4) : "…")}
      </span>
    </Link>
  );
}
