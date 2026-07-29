import { Link } from "react-router";
import { useMandates } from "../api/mandates";
import { useVault } from "../api/flow";
import { StatePill } from "../components/ui/state-pill";
import { Skeleton } from "../components/ui/skeleton";
import { EmptyState } from "../components/ui/empty-state";
import { Button } from "../components/ui/button";
import { CopyButton } from "../components/ui/copy-button";
import { getMandateMeta } from "../lib/mandate-meta";
import { domainLabel } from "../lib/protocol";
import { humanize } from "../lib/format";
import type { MandateDto } from "../api/schemas";

const VAULT_STATES = new Set([
  "awarded",
  "in_execution",
  "submitted",
  "accepted",
  "settled",
  "disputed",
  "resolved",
]);

function VaultRow({ mandate }: { mandate: MandateDto }) {
  const vault = useVault(mandate.id);
  const title = getMandateMeta(mandate.id)?.title;

  return (
    <tr className="border-t border-line">
      <td className="max-w-52 px-4 py-3">
        <Link to={`/mandates/${mandate.id}`} className="group block min-w-0">
          <span className="block truncate text-sm font-medium text-bone group-hover:text-vio">
            {title ?? "Sealed mandate"}
          </span>
          <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.14em] text-dim">
            {domainLabel(mandate.publicDomain)}
          </span>
        </Link>
      </td>
      <td className="px-4 py-3">
        <StatePill state={mandate.state} />
      </td>
      <td className="px-4 py-3 font-mono text-xs text-fog">
        {vault.isPending && <Skeleton className="h-4 w-16" />}
        {vault.isError && <span className="text-dim">—</span>}
        {vault.isSuccess && "Sealed"}
      </td>
      <td className="px-4 py-3 font-mono text-xs text-fog">
        {vault.isSuccess ? humanize(vault.data.state) : "—"}
      </td>
      <td className="px-4 py-3">
        {vault.isSuccess && vault.data.settlement ? (
          <CopyButton
            value={vault.data.settlement.settlementNullifier}
            label="settlement nullifier"
          />
        ) : (
          <span className="font-mono text-xs text-dim">—</span>
        )}
      </td>
    </tr>
  );
}

export function VaultPage() {
  const query = useMandates({ mine: true, page: 1, pageSize: 50 });
  const rows = (query.data?.items ?? []).filter((m) => VAULT_STATES.has(m.state));

  return (
    <div>
      <p className="eyebrow">Settlement</p>
      <h1 className="mt-1.5 font-display text-3xl font-bold tracking-tight text-bone">Vault</h1>
      <p className="mt-1.5 max-w-lg text-sm text-fog">
        Escrow across your mandates. Each vault releases exactly once — the settlement nullifier
        is the public proof of that.
      </p>

      <div className="mt-8">
        {query.isPending && (
          <div className="space-y-3" aria-label="Loading vaults">
            <span className="sr-only">Loading vaults</span>
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        )}

        {query.isError && (
          <EmptyState
            title="Vault overview unavailable"
            description="Your mandate list did not respond."
            action={
              <Button variant="secondary" onClick={() => void query.refetch()}>
                Retry
              </Button>
            }
          />
        )}

        {query.isSuccess && rows.length === 0 && (
          <EmptyState
            title="No active vaults"
            description="Vaults activate when a mandate you participate in is awarded."
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

        {query.isSuccess && rows.length > 0 && (
          <div className="overflow-x-auto rounded-[4px] border border-line">
            <table className="w-full min-w-[44rem] border-collapse bg-panel text-left">
              <caption className="sr-only">Vault status per mandate</caption>
              <thead>
                <tr>
                  {["Mandate", "Mandate state", "Reserve", "Vault state", "Nullifier"].map(
                    (h) => (
                      <th key={h} scope="col" className="px-4 py-3 text-left">
                        <span className="eyebrow">{h}</span>
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {rows.map((m) => (
                  <VaultRow key={m.id} mandate={m} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
