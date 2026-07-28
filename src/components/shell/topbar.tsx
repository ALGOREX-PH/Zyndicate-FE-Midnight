import { NetworkBadge } from "./network-badge";
import { WalletButton } from "./wallet-button";
import { IdentityChip } from "./identity-chip";

export function Topbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-3 border-b border-line bg-ink/90 px-4 backdrop-blur-sm sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Open navigation menu"
          className="grid size-9 place-items-center rounded-[2px] border border-line-strong text-fog transition-colors hover:text-bone lg:hidden"
        >
          <span aria-hidden="true" className="font-mono text-sm">
            ≡
          </span>
        </button>
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-dim sm:block lg:hidden">
          Zyndicate
        </span>
      </div>
      <div className="flex items-center gap-2">
        <NetworkBadge />
        <IdentityChip />
        <WalletButton />
      </div>
    </header>
  );
}
