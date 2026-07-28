import { Link } from "react-router";

/** A sealed mandate file, as a public observer would see it. */
function SealedMandateCard() {
  const rows: Array<{ label: string; sealed?: string; value?: string; delay: number }> = [
    { label: "Title", sealed: "w-40 sm:w-48", delay: 0.35 },
    { label: "Context", sealed: "w-52 sm:w-64", delay: 0.45 },
    { label: "Max budget", sealed: "w-24", delay: 0.55 },
    { label: "Domain", value: "SECURITY", delay: 0.65 },
    { label: "Bid window", value: "CLOSES IN 72H", delay: 0.75 },
  ];

  return (
    <div
      className="animate-rise hairline w-full max-w-md rounded-[4px] bg-panel"
      style={{ animationDelay: "0.25s" }}
      aria-label="Example of a sealed mandate as the public sees it: title, context and budget are redacted; domain, deadlines and a commitment are visible."
      role="img"
    >
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-bone">
          Mandate · SEC-0042
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-[2px] border border-vio/40 px-2 py-0.5 font-mono text-[9px] font-medium uppercase tracking-[0.12em] text-vio">
          Open for bids
        </span>
      </div>
      <div aria-hidden="true" className="space-y-3.5 px-5 py-5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
              {row.label}
            </span>
            {row.sealed ? (
              <span
                className={`redact animate-seal ${row.sealed}`}
                style={{ animationDelay: `${row.delay}s` }}
              />
            ) : (
              <span
                className="animate-rise font-mono text-[11px] tracking-[0.08em] text-fog"
                style={{ animationDelay: `${row.delay}s` }}
              >
                {row.value}
              </span>
            )}
          </div>
        ))}
      </div>
      <div
        aria-hidden="true"
        className="animate-rise flex items-center justify-between gap-4 border-t border-line px-5 py-3"
        style={{ animationDelay: "0.9s" }}
      >
        <span className="truncate font-mono text-[10px] text-dim">
          commit 9f3c02ab41…77d1
        </span>
        <span className="shrink-0 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-phosphor">
          ✓ Verifiable
        </span>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      {/* faint vertical rules — drafting-table texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0, transparent 119px, var(--color-line) 119px, var(--color-line) 120px)",
        }}
      />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-28">
        <div>
          <p className="animate-rise eyebrow">Confidential work coordination · Midnight Network</p>
          <h1
            className="animate-rise mt-5 font-display text-4xl leading-[1.05] font-bold tracking-tight text-bone sm:text-6xl"
            style={{ animationDelay: "0.08s" }}
          >
            Private by default.
            <br />
            <span className="text-phosphor">Verifiable</span> by design.
          </h1>
          <p
            className="animate-rise mt-6 max-w-xl text-base leading-relaxed text-fog sm:text-lg"
            style={{ animationDelay: "0.16s" }}
          >
            Zyndicate is the sealed market for trusted digital work. Principals commission
            sensitive outcomes. Qualified operators compete through sealed bids. Covenants govern
            execution — and the ledger proves the agreement was followed without ever seeing it.
          </p>
          <div
            className="animate-rise mt-8 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "0.24s" }}
          >
            <Link
              to="/exchange"
              className="inline-flex h-11 items-center rounded-[2px] border border-bone bg-bone px-6 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink transition-colors hover:bg-white"
            >
              Enter the Exchange
            </Link>
            <Link
              to="/mandates/new"
              className="inline-flex h-11 items-center rounded-[2px] border border-line-strong px-6 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-bone transition-colors hover:border-fog"
            >
              Compose a mandate
            </Link>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <SealedMandateCard />
        </div>
      </div>
    </section>
  );
}
