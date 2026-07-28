import { useState } from "react";
import { Link } from "react-router";
import { useMandates } from "../api/mandates";
import { isApiError } from "../api/client";
import { MandateCard } from "../components/exchange/mandate-card";
import { ExchangeFilters, type ExchangeFilterValues } from "../components/exchange/filters";
import { SkeletonCard } from "../components/ui/skeleton";
import { EmptyState } from "../components/ui/empty-state";
import { Button } from "../components/ui/button";

const PAGE_SIZE = 12;

export function ExchangePage() {
  const [filters, setFilters] = useState<ExchangeFilterValues>({
    domain: "",
    state: "",
    mine: false,
  });
  const [page, setPage] = useState(1);

  const query = useMandates({
    domain: filters.domain || undefined,
    state: filters.state || undefined,
    mine: filters.mine,
    page,
    pageSize: PAGE_SIZE,
  });

  const totalPages = query.data ? Math.max(1, Math.ceil(query.data.total / PAGE_SIZE)) : 1;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Discovery</p>
          <h1 className="mt-1.5 font-display text-3xl font-bold tracking-tight text-bone">
            Exchange
          </h1>
          <p className="mt-1.5 max-w-lg text-sm text-fog">
            Public mandate summaries only — domain, bands, deadlines, state. Everything else
            stays sealed until you are entitled to it.
          </p>
        </div>
        <Link
          to="/mandates/new"
          className="inline-flex h-10 items-center rounded-[2px] border border-bone bg-bone px-5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink transition-colors hover:bg-white"
        >
          Compose mandate
        </Link>
      </div>

      <div className="mt-8">
        <ExchangeFilters
          values={filters}
          onChange={(next) => {
            setFilters(next);
            setPage(1);
          }}
        />
      </div>

      <div className="mt-6">
        {query.isPending && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Loading mandates">
            <span className="sr-only">Loading mandates</span>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {query.isError && (
          <EmptyState
            title="The Exchange is unreachable"
            description={
              isApiError(query.error)
                ? query.error.message
                : "The mandate feed did not respond."
            }
            action={
              <Button variant="secondary" onClick={() => void query.refetch()}>
                Retry
              </Button>
            }
          />
        )}

        {query.isSuccess && query.data.items.length === 0 && (
          <EmptyState
            title="No mandates match"
            description={
              filters.mine
                ? "You have not composed or bid on any mandates under these filters."
                : "Nothing in the Exchange matches these filters yet. Compose the first mandate."
            }
            action={
              <Link
                to="/mandates/new"
                className="inline-flex h-10 items-center rounded-[2px] border border-line-strong px-5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-bone transition-colors hover:border-fog"
              >
                Compose mandate
              </Link>
            }
          />
        )}

        {query.isSuccess && query.data.items.length > 0 && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {query.data.items.map((mandate) => (
                <MandateCard key={mandate.id} mandate={mandate} />
              ))}
            </div>
            <nav
              aria-label="Pagination"
              className="mt-8 flex items-center justify-between border-t border-line pt-4"
            >
              <Button
                variant="ghost"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                ← Previous
              </Button>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-dim">
                Page {query.data.page} of {totalPages} · {query.data.total} mandates
              </span>
              <Button
                variant="ghost"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next →
              </Button>
            </nav>
          </>
        )}
      </div>
    </div>
  );
}
