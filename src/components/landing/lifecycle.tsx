/**
 * The sealed mandate lifecycle. Numbered because it truly is a sequence —
 * each stage annotates what the ledger records vs what stays sealed,
 * encoding the product thesis in the structure itself.
 */

interface Stage {
  n: string;
  title: string;
  body: string;
  ledger: string;
  sealed: string;
}

const STAGES: Stage[] = [
  {
    n: "01",
    title: "Compose & seal",
    body: "A principal drafts the mandate — outcome, covenant, budget. It is encrypted on their device before anything leaves it.",
    ledger: "a mandate exists · domain · deadlines · commitment",
    sealed: "the task, the context, the budget",
  },
  {
    n: "02",
    title: "Sealed bidding",
    body: "Eligible operators submit encrypted bids with a one-time nullifier. Duplicate bids collide and fail.",
    ledger: "bid commitments · nullifiers",
    sealed: "prices, methods, operator identities",
  },
  {
    n: "03",
    title: "Award",
    body: "The principal selects a winner under the declared rule. Losing bidders can verify the process was followed.",
    ledger: "award commitment · acceptance",
    sealed: "who won, on what terms",
  },
  {
    n: "04",
    title: "Encrypted workroom",
    body: "Principal and operator exchange messages and artifacts sealed with a key only they hold.",
    ledger: "nothing",
    sealed: "every message, every file",
  },
  {
    n: "05",
    title: "Proof & evaluation",
    body: "The operator commits the submission digest before the deadline. An authorized evaluator records a verdict.",
    ledger: "submission commitment · evaluation attestation",
    sealed: "the deliverable, the notes",
  },
  {
    n: "06",
    title: "Settlement",
    body: "The vault releases exactly once — a settlement nullifier makes double payment impossible. A proof receipt lands in each passport.",
    ledger: "settlement occurred, once",
    sealed: "the amount, the parties",
  },
];

export function Lifecycle() {
  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <p className="eyebrow">How a mandate moves</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight text-bone sm:text-4xl">
          Six stages. The ledger learns almost nothing.
        </h2>

        <ol className="mt-12 space-y-0">
          {STAGES.map((stage) => (
            <li
              key={stage.n}
              className="grid grid-cols-[3rem_1fr] gap-x-5 border-t border-line py-7 last:border-b sm:grid-cols-[4rem_1.2fr_1fr] sm:gap-x-8"
            >
              <span
                aria-hidden="true"
                className="font-mono text-sm font-bold tracking-[0.1em] text-dim"
              >
                {stage.n}
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold text-bone">{stage.title}</h3>
                <p className="mt-1.5 max-w-md text-sm leading-relaxed text-fog">{stage.body}</p>
              </div>
              <div className="col-start-2 mt-4 space-y-2 sm:col-start-3 sm:mt-0">
                <p className="font-mono text-[10px] leading-relaxed tracking-[0.06em]">
                  <span className="mr-2 inline-block rounded-[2px] border border-amber/50 px-1 py-px text-[9px] font-bold uppercase tracking-[0.12em] text-amber">
                    Ledger
                  </span>
                  <span className="text-fog">{stage.ledger}</span>
                </p>
                <p className="font-mono text-[10px] leading-relaxed tracking-[0.06em]">
                  <span className="mr-2 inline-block rounded-[2px] border border-vio/50 px-1 py-px text-[9px] font-bold uppercase tracking-[0.12em] text-vio">
                    Sealed
                  </span>
                  <span className="text-fog">{stage.sealed}</span>
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
