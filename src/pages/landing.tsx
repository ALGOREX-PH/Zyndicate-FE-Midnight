import { Link } from "react-router";
import { Hero } from "../components/landing/hero";
import { Lifecycle } from "../components/landing/lifecycle";
import { Closing } from "../components/landing/closing";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-ink">
      <header className="border-b border-line">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" aria-label="Zyndicate home" className="flex items-baseline gap-2">
            <span className="font-display text-lg font-bold tracking-tight text-bone">
              ZYNDICATE
            </span>
            <span className="hidden font-mono text-[9px] uppercase tracking-[0.22em] text-dim sm:inline">
              Sealed market
            </span>
          </Link>
          <nav aria-label="Landing" className="flex items-center gap-5">
            <Link
              to="/exchange"
              className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-fog transition-colors hover:text-bone"
            >
              Exchange
            </Link>
            <Link
              to="/passport"
              className="hidden font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-fog transition-colors hover:text-bone sm:inline"
            >
              Passport
            </Link>
            <Link
              to="/exchange"
              className="inline-flex h-9 items-center rounded-[2px] border border-line-strong px-4 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-bone transition-colors hover:border-fog"
            >
              Enter
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <Hero />
        <Lifecycle />
        <Closing />
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-dim">
            Zyndicate — the sealed market for trusted digital work
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-dim">
            Built on Midnight
          </p>
        </div>
      </footer>
    </div>
  );
}
