import { useState } from "react";
import { Link } from "react-router";
import type { MandateDto } from "../../api/schemas";
import { Card, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { Field, Select, Textarea } from "../ui/field";
import { useArtifacts } from "../../api/workrooms";
import {
  useCommitSubmission,
  useOpenDispute,
  useRecordEvaluation,
  useSettle,
  type Verdict,
} from "../../api/flow";
import { makeCommitment } from "../../lib/crypto";
import { COMMIT_DOMAINS, deriveSettlementNullifier } from "../../lib/protocol";
import { getChain } from "../../midnight/chain";
import { useNetworkStore } from "../../store/network";
import { toast } from "../../store/toast";

/* ------------------------- submission (operator) -------------------------- */

function SubmissionSection({ mandate }: { mandate: MandateDto }) {
  const artifacts = useArtifacts(mandate.id);
  const commit = useCommitSubmission(mandate.id);
  const networkId = useNetworkStore((s) => s.networkId);
  const [artifactId, setArtifactId] = useState("");
  const [busy, setBusy] = useState(false);

  const selected = artifacts.data?.find((a) => a.id === artifactId);

  const handleCommit = async () => {
    if (!selected?.digest) return;
    setBusy(true);
    try {
      const { commitment } = await makeCommitment(COMMIT_DOMAINS.submission, selected.digest);
      await commit.mutateAsync({
        artifactId: selected.id,
        submissionCommitment: commitment,
        digest: selected.digest,
      });
      await getChain(networkId).commitSubmission({
        mandateId: mandate.id,
        submissionCommitment: commitment,
        artifactDigest: selected.digest,
      });
      toast.success("Submission committed", "The digest is anchored; the artifact stays sealed.");
    } catch (e) {
      toast.error("Submission failed", e instanceof Error ? e.message : undefined);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-fog">
        Commit a workroom artifact as your submission. Only its digest is anchored publicly.
      </p>
      {artifacts.isSuccess && artifacts.data.length === 0 ? (
        <p className="text-sm text-dim">
          No artifacts yet —{" "}
          <Link to={`/workrooms/${mandate.id}`} className="text-vio underline underline-offset-2">
            upload one in the workroom
          </Link>
          .
        </p>
      ) : (
        <div className="flex flex-wrap items-end gap-3">
          <Field label="Artifact" htmlFor="submission-artifact" className="min-w-56">
            <Select
              id="submission-artifact"
              value={artifactId}
              onChange={(e) => setArtifactId(e.target.value)}
            >
              <option value="">Select artifact…</option>
              {(artifacts.data ?? []).map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} (v{a.version ?? "1"})
                </option>
              ))}
            </Select>
          </Field>
          <Button
            variant="primary"
            loading={busy}
            disabled={!selected?.digest}
            onClick={() => void handleCommit()}
          >
            Commit submission
          </Button>
        </div>
      )}
    </div>
  );
}

/* ------------------------- evaluation (principal) ------------------------- */

function EvaluationSection({ mandate }: { mandate: MandateDto }) {
  const evaluate = useRecordEvaluation(mandate.id);
  const networkId = useNetworkStore((s) => s.networkId);
  const [verdict, setVerdict] = useState<Verdict>("accept");
  const [attestation, setAttestation] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);

  const handleEvaluate = async () => {
    if (attestation.trim().length < 10) {
      setError("Attest to the verdict in at least 10 characters.");
      return;
    }
    setBusy(true);
    try {
      const payload = { verdict, attestation: attestation.trim() };
      const { commitment } = await makeCommitment(
        COMMIT_DOMAINS.evaluation,
        JSON.stringify(payload),
      );
      await evaluate.mutateAsync({
        verdict,
        evaluationCommitment: commitment,
        attestation: attestation.trim(),
      });
      await getChain(networkId).recordEvaluation({
        mandateId: mandate.id,
        evaluationCommitment: commitment,
        verdict,
      });
      toast.success(`Evaluation recorded: ${verdict}`);
      setAttestation("");
    } catch (e) {
      toast.error("Evaluation failed", e instanceof Error ? e.message : undefined);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-fog">
        Judge the submission against the covenant's acceptance criteria. The verdict is public;
        your notes are committed, not published.
      </p>
      <div className="grid gap-4 sm:grid-cols-[10rem_1fr]">
        <Field label="Verdict" htmlFor="eval-verdict">
          <Select
            id="eval-verdict"
            value={verdict}
            onChange={(e) => setVerdict(e.target.value as Verdict)}
          >
            <option value="accept">Accept</option>
            <option value="revise">Request revision</option>
            <option value="reject">Reject</option>
          </Select>
        </Field>
        <Field label="Attestation" htmlFor="eval-attestation" error={error}>
          <Textarea
            id="eval-attestation"
            value={attestation}
            invalid={!!error}
            onChange={(e) => {
              setAttestation(e.target.value);
              setError(undefined);
            }}
            placeholder="Acceptance criteria met: all in-scope contracts reviewed…"
            rows={3}
          />
        </Field>
      </div>
      <Button variant="primary" loading={busy} onClick={() => void handleEvaluate()}>
        Record evaluation
      </Button>
    </div>
  );
}

/* ------------------------------- settlement ------------------------------- */

function SettleSection({ mandate }: { mandate: MandateDto }) {
  const settle = useSettle(mandate.id);
  const networkId = useNetworkStore((s) => s.networkId);
  const [busy, setBusy] = useState(false);

  const handleSettle = async () => {
    setBusy(true);
    try {
      const nullifier = await deriveSettlementNullifier(mandate.id);
      await settle.mutateAsync(nullifier);
      await getChain(networkId).settleMandate({
        mandateId: mandate.id,
        settlementNullifier: nullifier,
      });
      toast.success("Settlement released", "The nullifier guarantees this can only happen once.");
    } catch (e) {
      toast.error("Settlement failed", e instanceof Error ? e.message : undefined);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="max-w-md text-sm text-fog">
        The submission was accepted. Release the vault — a settlement nullifier makes double
        payment impossible.
      </p>
      <Button variant="proof" loading={busy} onClick={() => void handleSettle()}>
        Release settlement
      </Button>
    </div>
  );
}

/* --------------------------------- dispute -------------------------------- */

function DisputeButton({ mandate }: { mandate: MandateDto }) {
  const openDispute = useOpenDispute(mandate.id);
  const networkId = useNetworkStore((s) => s.networkId);
  const [open, setOpen] = useState(false);
  const [statement, setStatement] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);

  const handleOpen = async () => {
    if (statement.trim().length < 20) {
      setError("State the grounds in at least 20 characters — this seeds the evidence capsule.");
      return;
    }
    setBusy(true);
    try {
      const { commitment } = await makeCommitment(COMMIT_DOMAINS.dispute, statement.trim());
      await openDispute.mutateAsync(commitment);
      await getChain(networkId).openDispute({
        mandateId: mandate.id,
        disputeCommitment: commitment,
      });
      toast.success("Dispute opened", "The disputed amount is frozen pending a ruling.");
      setOpen(false);
      setStatement("");
    } catch (e) {
      toast.error("Dispute not opened", e instanceof Error ? e.message : undefined);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Button size="sm" variant="danger" onClick={() => setOpen(true)}>
        Open dispute
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Open dispute">
        <div className="space-y-4">
          <p className="text-sm text-fog">
            Opening a dispute freezes settlement. Your statement stays sealed in the evidence
            capsule; only its commitment is public.
          </p>
          <Field label="Grounds" htmlFor="dispute-grounds" error={error}>
            <Textarea
              id="dispute-grounds"
              value={statement}
              invalid={!!error}
              onChange={(e) => {
                setStatement(e.target.value);
                setError(undefined);
              }}
              rows={4}
              placeholder="The submission does not satisfy acceptance criterion 2…"
            />
          </Field>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setOpen(false)} disabled={busy}>
              Cancel
            </Button>
            <Button variant="danger" loading={busy} onClick={() => void handleOpen()}>
              Freeze & open dispute
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}

/* ---------------------------------- panel --------------------------------- */

const DISPUTABLE = ["awarded", "in_execution", "submitted", "accepted"];

export function FlowPanel({
  mandate,
  isPrincipal,
}: {
  mandate: MandateDto;
  isPrincipal: boolean;
}) {
  const showWorkroomLink = [
    "awarded",
    "in_execution",
    "submitted",
    "accepted",
    "settled",
    "disputed",
    "resolved",
  ].includes(mandate.state);

  return (
    <Card>
      <CardHeader
        eyebrow="Execution flow"
        title="Proof & settlement"
        aside={
          <div className="flex items-center gap-2">
            {showWorkroomLink && (
              <Link
                to={`/workrooms/${mandate.id}`}
                className="inline-flex h-8 items-center rounded-[2px] border border-line-strong px-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-bone transition-colors hover:border-fog"
              >
                Workroom →
              </Link>
            )}
            {DISPUTABLE.includes(mandate.state) && <DisputeButton mandate={mandate} />}
          </div>
        }
      />

      {mandate.state === "in_execution" && !isPrincipal && (
        <SubmissionSection mandate={mandate} />
      )}
      {mandate.state === "in_execution" && isPrincipal && (
        <p className="text-sm text-fog">
          Execution is under way in the encrypted workroom. You will be able to evaluate once a
          submission is committed.
        </p>
      )}

      {mandate.state === "submitted" &&
        (isPrincipal ? (
          <EvaluationSection mandate={mandate} />
        ) : (
          <p className="text-sm text-fog">
            Submission committed before the deadline. Awaiting the evaluation verdict.
          </p>
        ))}

      {mandate.state === "accepted" &&
        (isPrincipal ? (
          <SettleSection mandate={mandate} />
        ) : (
          <p className="text-sm text-fog">
            Accepted. Settlement releases from the vault — your proof receipt follows.
          </p>
        ))}

      {mandate.state === "settled" && (
        <p className="text-sm">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-phosphor">
            ✓ Settled once
          </span>
          <span className="mt-1 block text-fog">
            The vault released exactly once. Proof receipts were issued to both passports.
          </span>
        </p>
      )}

      {mandate.state === "disputed" && (
        <p className="text-sm text-fog">
          Settlement is frozen. The Tribunal opens only the evidence the disclosure covenant
          authorizes.{" "}
          <Link to="/tribunal" className="text-vio underline underline-offset-2">
            Track it in the Tribunal
          </Link>
          .
        </p>
      )}

      {mandate.state === "resolved" && (
        <p className="text-sm text-fog">
          The Tribunal ruled and the outcome executed. This mandate is closed.
        </p>
      )}

      {["draft", "open_for_bids", "bidding_closed", "awarded", "cancelled"].includes(
        mandate.state,
      ) && (
        <p className="text-sm text-dim">
          {mandate.state === "cancelled"
            ? "This mandate was cancelled before execution."
            : mandate.state === "awarded"
              ? "Waiting for the operator to accept the award."
              : "Execution actions unlock after award and acceptance."}
        </p>
      )}
    </Card>
  );
}
