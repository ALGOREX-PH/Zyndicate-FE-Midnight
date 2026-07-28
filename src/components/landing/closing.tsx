import { Link } from "react-router";

const VOCABULARY = [
  ["Mandate", "a sealed commission, not a job listing"],
  ["Sealed bid", "a committed price nobody else reads"],
  ["Covenant", "the machine-readable rules of engagement"],
  ["Workroom", "an encrypted room only participants can open"],
  ["Vault", "escrow that releases exactly once"],
  ["Passport", "reputation you prove, not publish"],
] as const;

/** Vocabulary strip + final call to action. */
export function Closing() {
  return (
    <>
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <p className="eyebrow">The working vocabulary</p>
          <h2 className="mt-3 max-w-xl font-display text-3xl font-bold tracking-tight text-bone">
            A market speaks the way it treats its participants
          </h2>
          <dl className="mt-10 grid gap-px overflow-hidden rounded-[4px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {VOCABULARY.map(([term, definition]) => (
              <div key={term} className="bg-panel p-5">
                <dt className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-bone">
                  {term}
                </dt>
                <dd className="mt-1.5 text-sm text-fog">{definition}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-bone sm:text-4xl">
            The work stays confidential.
            <br />
            The transaction remains verifiable.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-fog">
            Connect a wallet, forge a Zyndicate identity, and commission your first sealed
            mandate in minutes.
          </p>
          <Link
            to="/exchange"
            className="mt-8 inline-flex h-12 items-center rounded-[2px] border border-bone bg-bone px-8 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink transition-colors hover:bg-white"
          >
            Enter the Exchange
          </Link>
        </div>
      </section>
    </>
  );
}
