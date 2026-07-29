import { useState } from "react";
import { Link } from "react-router";
import { useDisputes, useRecordRuling } from "../api/flow";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/state-pill";
import { Button } from "../components/ui/button";
import { Dialog } from "../components/ui/dialog";
import { Field, Select, Textarea } from "../components/ui/field";
import { Skeleton } from "../components/ui/skeleton";
import { EmptyState } from "../components/ui/empty-state";
import { CopyButton } from "../components/ui/copy-button";
import { makeCommitment } from "../lib/crypto";
import { COMMIT_DOMAINS } from "../lib/protocol";
import { getChain } from "../midnight/chain";
import { useNetworkStore } from "../store/network";
import { toast } from "../store/toast";
import { formatDateTime, humanize } from "../lib/format";
import type { DisputeDto } from "../api/schemas";

function RulingDialog({
  dispute,
  open,
  onClose,
}: {
  dispute: DisputeDto;
  open: boolean;
  onClose: () => void;
}) {
  const ruling = useRecordRuling();
  const networkId = useNetworkStore((s) => s.networkId);
  const [outcome, setOutcome] = useState<"release" | "refund">("release");
  const [reasoning, setReasoning] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);

  const handleRule = async () => {
    if (reasoning.trim().length < 20) {
      setError("Record the reasoning in at least 20 characters — it seals into the capsule.");
      return;
    }
    setBusy(true);
    try {
      const { commitment } = await makeCommitment(
        COMMIT_DOMAINS.ruling,
        JSON.stringify({ outcome, reasoning: reasoning.trim() }),
      );
      await ruling.mutateAsync({ disputeId: dispute.id, rulingCommitment: commitment, outcome });
      await getChain(networkId).resolveDispute({
        disputeId: dispute.id,
        rulingCommitment: commitment,
        outcome,
      });
      toast.success(
        `Ruling recorded: ${outcome}`,
        outcome === "release" ? "The vault releases to the operator." : "The vault refunds the principal.",
      );
      onClose();
      setReasoning("");
    } catch (e) {
      toast.error("Ruling failed", e instanceof Error ? e.message : undefined);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} title={`Ruling — dispute ${dispute.id}`}>
      <div className="space-y-4">
        <p className="text-sm text-fog">
          The outcome executes the frozen settlement. Your reasoning is committed, not
          published — the capsule opens only per the disclosure covenant.
        </p>
        <Field label="Outcome" htmlFor="ruling-outcome">
          <Select
            id="ruling-outcome"
            value={outcome}
            onChange={(e) => setOutcome(e.target.value as "release" | "refund")}
          >
            <option value="release">Release — pay the operator</option>
            <option value="refund">Refund — return funds to the principal</option>
          </Select>
        </Field>
        <Field label="Reasoning" htmlFor="ruling-reasoning" error={error}>
          <Textarea
            id="ruling-reasoning"
            value={reasoning}
            invalid={!!error}
            onChange={(e) => {
              setReasoning(e.target.value);
              setError(undefined);
            }}
            rows={4}
            placeholder="Evidence in the capsule shows the acceptance criteria were met…"
          />
        </Field>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button variant="primary" loading={busy} onClick={() => void handleRule()}>
            Record ruling
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

function DisputeRow({ dispute }: { dispute: DisputeDto }) {
  const [open, setOpen] = useState(false);
  const closed = dispute.status === "ruled";

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-fog">
            Dispute {dispute.id}
          </span>
          <Badge tone={closed ? "phosphor" : "danger"}>
            {closed ? `Ruled${dispute.outcome ? ` · ${humanize(dispute.outcome)}` : ""}` : "Frozen"}
          </Badge>
        </div>
        <span className="font-mono text-[10px] text-dim">{formatDateTime(dispute.createdAt)}</span>
      </div>

      {dispute.disputeCommitment && (
        <CopyButton value={dispute.disputeCommitment} label="evidence capsule commitment" />
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
        <Link
          to={`/mandates/${dispute.mandateId}`}
          className="font-mono text-[11px] uppercase tracking-[0.12em] text-vio hover:underline"
        >
          View mandate →
        </Link>
        {!closed && (
          <Button size="sm" variant="primary" onClick={() => setOpen(true)}>
            Record ruling
          </Button>
        )}
      </div>

      <RulingDialog dispute={dispute} open={open} onClose={() => setOpen(false)} />
    </Card>
  );
}

export function TribunalPage() {
  const disputes = useDisputes();

  return (
    <div>
      <p className="eyebrow">Disputes</p>
      <h1 className="mt-1.5 font-display text-3xl font-bold tracking-tight text-bone">
        Tribunal
      </h1>
      <p className="mt-1.5 max-w-lg text-sm text-fog">
        Frozen settlements awaiting a ruling. The Tribunal sees only the evidence each disclosure
        covenant authorizes — nothing more.
      </p>

      <div className="mt-8">
        {disputes.isPending && (
          <div className="space-y-4" aria-label="Loading disputes">
            <span className="sr-only">Loading disputes</span>
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
        )}

        {disputes.isError && (
          <EmptyState
            title="Tribunal unavailable"
            description="The dispute ledger did not respond."
            action={
              <Button variant="secondary" onClick={() => void disputes.refetch()}>
                Retry
              </Button>
            }
          />
        )}

        {disputes.isSuccess && disputes.data.length === 0 && (
          <EmptyState
            title="No disputes"
            description="Nothing is frozen. Disputes open from a mandate's execution flow when a party contests the outcome."
          />
        )}

        {disputes.isSuccess && disputes.data.length > 0 && (
          <div className="grid gap-4 lg:grid-cols-2">
            {disputes.data.map((d) => (
              <DisputeRow key={d.id} dispute={d} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
