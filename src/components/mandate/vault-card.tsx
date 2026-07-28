import { Card, CardHeader } from "../ui/card";
import { Badge } from "../ui/state-pill";
import { DefinitionList } from "../ui/definition-list";
import { Skeleton } from "../ui/skeleton";
import { useVault } from "../../api/flow";
import { humanize } from "../../lib/format";

/** Vault status for a mandate: reserve, asset, release state, nullifier. */
export function VaultCard({ mandateId }: { mandateId: string }) {
  const vault = useVault(mandateId);

  return (
    <Card>
      <CardHeader
        eyebrow="Vault"
        title="Escrow"
        aside={
          vault.data?.state ? (
            <Badge tone={vault.data.state === "released" ? "phosphor" : "neutral"}>
              {humanize(vault.data.state)}
            </Badge>
          ) : undefined
        }
      />

      {vault.isPending && (
        <div className="space-y-2" aria-label="Loading vault">
          <span className="sr-only">Loading vault</span>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      )}

      {vault.isError && (
        <p className="text-sm text-dim">
          No vault yet. It activates when the mandate is awarded and accepted.
        </p>
      )}

      {vault.isSuccess && (
        <DefinitionList
          items={[
            { label: "Reserve", value: vault.data.amountBand ?? "Sealed", mono: true },
            { label: "Asset", value: vault.data.asset ?? "Development asset" },
            ...(vault.data.settlementNullifier
              ? [{ label: "Settlement nullifier", copy: vault.data.settlementNullifier }]
              : []),
            ...(vault.data.settledAt
              ? [{ label: "Settled", value: new Date(vault.data.settledAt).toLocaleString() }]
              : []),
          ]}
        />
      )}
    </Card>
  );
}
