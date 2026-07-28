import { Link } from "react-router";
import { useMandates } from "../api/mandates";
import { StatePill } from "../components/ui/state-pill";
import { SkeletonCard } from "../components/ui/skeleton";
import { EmptyState } from "../components/ui/empty-state";
import { Button } from "../components/ui/button";
import { getMandateMeta } from "../lib/mandate-meta";
import { getMandateKey } from "../lib/crypto";
import { domainLabel } from "../lib/protocol";
import { formatDeadline } from "../lib/format";

const ACTIVE_STATES = new Set([
  "awarded",
  "in_execution",
  "submitted",
  "accepted",
  "settled",
  "disputed",
  "resolved",
]);

/** Workrooms exist for awarded mandates you participate in. */
export function WorkroomsIndexPage() {
  const query = useMandates({ mine: true, page: 1, pageSize: 50 });
  const rooms = (query.data?.items ?? []).filter((m) => ACTIVE_STATES.has(m.state));

  return (
    <div>
      <p className="eyebrow">Collaboration</p>
      <h1 className="mt-1.5 font-display text-3xl font-bold tracking-tight text-bone">
        Workrooms
      </h1>
      <p className="mt-1.5 max-w-lg text-sm text-fog">
        One encrypted room per awarded mandate. Everything inside is sealed with a key the host
        never sees.
      </p>

      <div className="mt-8">
        {query.isPending && (
          <div className="grid gap-4 sm:grid-cols-2" aria-label="Loading workrooms">
            <span className="sr-only">Loading workrooms</span>
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {query.isError && (
          <EmptyState
            title="Workrooms unavailable"
            description="Your mandate list did not respond."
            action={
              <Button variant="secondary" onClick={() => void query.refetch()}>
                Retry
              </Button>
            }
          />
        )}

        {query.isSuccess && rooms.length === 0 && (
          <EmptyState
            title="No active workrooms"
            description="A workroom opens when a mandate you are part of reaches award."
            action={
              <Link
                to="/exchange"
                className="inline-flex h-10 items-center rounded-[2px] border border-line-strong px-5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-bone transition-colors hover:border-fog"
              >
                Browse the Exchange
              </Link>
            }
          />
        )}

        {query.isSuccess && rooms.length > 0 && (
          <ul className="grid gap-4 sm:grid-cols-2">
            {rooms.map((m) => {
              const title = getMandateMeta(m.id)?.title;
              const hasKey = !!getMandateKey(m.id);
              return (
                <li key={m.id}>
                  <Link
                    to={`/workrooms/${m.id}`}
                    className="flex h-full flex-col rounded-[4px] border border-line bg-panel p-5 transition-colors hover:border-line-strong"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-fog">
                        {domainLabel(m.publicDomain)}
                      </span>
                      <StatePill state={m.state} />
                    </div>
                    <div className="mt-3 min-h-6">
                      {title ? (
                        <p className="line-clamp-1 font-display text-base font-semibold text-bone">
                          {title}
                        </p>
                      ) : (
                        <span className="redact w-3/5" aria-label="Title sealed" />
                      )}
                    </div>
                    <p className="mt-3 border-t border-line pt-3 font-mono text-[10px] tracking-[0.06em] text-dim">
                      {hasKey ? "✓ key held" : "⚿ key not on this device"} · execution{" "}
                      {formatDeadline(m.executionDeadline)}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
