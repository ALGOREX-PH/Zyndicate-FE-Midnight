import { useParams } from "react-router";
import { useMandate } from "../api/mandates";
import { isApiError } from "../api/client";
import { StatePill, Badge } from "../components/ui/state-pill";
import { Skeleton } from "../components/ui/skeleton";
import { EmptyState } from "../components/ui/empty-state";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { DefinitionList } from "../components/ui/definition-list";
import { StateTimeline } from "../components/mandate/state-timeline";
import { PrincipalPanel } from "../components/mandate/principal-panel";
import { OperatorPanel } from "../components/mandate/operator-panel";
import { FlowPanel } from "../components/mandate/flow-panel";
import { VaultCard } from "../components/mandate/vault-card";
import { useUnsealedTitle } from "../components/exchange/mandate-card";
import { getMandateKey } from "../lib/crypto";
import { complexityLabel, domainLabel, rewardBandLabel } from "../lib/protocol";
import { formatDateTime } from "../lib/format";
import type { MandateDto } from "../api/schemas";

function DetailBody({ mandate }: { mandate: MandateDto }) {
  const title = useUnsealedTitle(mandate);
  const holdsKey = !!getMandateKey(mandate.id);

  // The backend decides the caller's role from principalKey, the awarded bid's
  // operatorKey and evaluatorKey. `null`/absent means outsider.
  const viewerRole = mandate.viewerRole ?? null;
  const isPrincipal = viewerRole === "principal";

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-fog">
          {domainLabel(mandate.publicDomain)}
        </span>
        <StatePill state={mandate.state} />
        {viewerRole === "principal" && <Badge tone="vio">You are the Principal</Badge>}
        {viewerRole === "operator" && <Badge tone="vio">You are the Operator</Badge>}
        {viewerRole === "evaluator" && <Badge tone="vio">You are the Evaluator</Badge>}
        {holdsKey && !isPrincipal && <Badge tone="phosphor">Key held</Badge>}
      </div>

      <div className="mt-4">
        {title ? (
          <h1 className="font-display text-3xl font-bold tracking-tight text-bone">{title}</h1>
        ) : (
          <div>
            <span className="redact h-8 w-72 max-w-full" aria-label="Title sealed" />
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-dim">
              Sealed — this device does not hold the mandate key
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-[4px] border border-line bg-panel p-4">
        <StateTimeline state={mandate.state} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="min-w-0 space-y-6">
          {isPrincipal ? (
            <PrincipalPanel mandate={mandate} />
          ) : (
            <OperatorPanel mandate={mandate} />
          )}
          <FlowPanel mandate={mandate} viewerRole={viewerRole} />
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="eyebrow mb-3">Public record</h2>
            <DefinitionList
              items={[
                { label: "Complexity", value: complexityLabel(mandate.complexityBand) },
                { label: "Reward band", value: rewardBandLabel(mandate.rewardBand) },
                { label: "Bid deadline", value: formatDateTime(mandate.bidDeadline) },
                { label: "Execution deadline", value: formatDateTime(mandate.executionDeadline) },
                ...(mandate.mandateCommitment
                  ? [{ label: "Mandate commitment", copy: mandate.mandateCommitment }]
                  : []),
                ...(mandate.covenantCommitment
                  ? [{ label: "Covenant commitment", copy: mandate.covenantCommitment }]
                  : []),
              ]}
            />
            <p className="mt-4 border-t border-line pt-3 text-[11px] text-dim">
              This is everything a public observer can see about this mandate.
            </p>
          </Card>
          <VaultCard mandateId={mandate.id} />
        </div>
      </div>
    </div>
  );
}

export function MandateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const query = useMandate(id);

  if (query.isPending) {
    return (
      <div aria-label="Loading mandate">
        <span className="sr-only">Loading mandate</span>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="mt-4 h-9 w-2/3" />
        <Skeleton className="mt-6 h-14 w-full" />
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_20rem]">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (query.isError) {
    return (
      <EmptyState
        title={
          isApiError(query.error) && query.error.status === 404
            ? "Mandate not found"
            : "Mandate unavailable"
        }
        description={
          isApiError(query.error) && query.error.status === 404
            ? "No mandate exists at this address, or you are not entitled to see it."
            : "The mandate record did not respond."
        }
        action={
          <Button variant="secondary" onClick={() => void query.refetch()}>
            Retry
          </Button>
        }
      />
    );
  }

  return <DetailBody mandate={query.data} />;
}
