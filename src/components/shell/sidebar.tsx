import { Link, NavLink } from "react-router";
import { cx } from "../../lib/format";

const NAV = [
  { to: "/exchange", label: "Exchange", glyph: "▤" },
  { to: "/mandates/new", label: "Compose", glyph: "✎" },
  { to: "/workrooms", label: "Workrooms", glyph: "▣" },
  { to: "/vault", label: "Vault", glyph: "◫" },
  { to: "/passport", label: "Passport", glyph: "◈" },
  { to: "/tribunal", label: "Tribunal", glyph: "⚖" },
  { to: "/settings", label: "Settings", glyph: "⚙" },
] as const;

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Primary" className="flex flex-1 flex-col gap-0.5 px-3">
      {NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className={({ isActive }) =>
            cx(
              "flex items-center gap-3 rounded-[2px] border-l-2 px-3 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] transition-colors",
              isActive
                ? "border-vio bg-raise text-bone"
                : "border-transparent text-fog hover:bg-raise/60 hover:text-bone",
            )
          }
        >
          <span aria-hidden="true" className="w-4 text-center text-xs">
            {item.glyph}
          </span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

/** Desktop sidebar. On mobile the same nav renders inside a drawer. */
export function Sidebar() {
  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-line bg-panel lg:flex">
      <div className="px-6 py-5">
        <Link to="/" className="block" aria-label="Zyndicate home">
          <span className="font-display text-lg font-bold tracking-tight text-bone">
            ZYNDICATE
          </span>
          <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.22em] text-dim">
            Sealed market
          </span>
        </Link>
      </div>
      <SidebarNav />
      <div className="border-t border-line px-6 py-4">
        <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-dim">
          Private by default.
          <br />
          Verifiable by design.
        </p>
      </div>
    </aside>
  );
}
