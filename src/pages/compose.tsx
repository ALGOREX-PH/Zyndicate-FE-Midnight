import { useState } from "react";
import { useNavigate } from "react-router";
import { Stepper, type Step } from "../components/ui/stepper";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { StepOutcome } from "../components/compose/step-outcome";
import { StepCovenant } from "../components/compose/step-covenant";
import { StepBudget } from "../components/compose/step-budget";
import { StepReview } from "../components/compose/step-review";
import {
  buildCovenant,
  buildPrivatePackage,
  composeDefaults,
  composeSchema,
  STEP_FIELDS,
  validateStep,
  type ComposeErrors,
  type ComposeForm,
} from "../components/compose/form";
import { useCreateMandate } from "../api/mandates";
import {
  encryptJson,
  generateSymmetricKeyHex,
  makeCommitment,
  storeMandateKey,
} from "../lib/crypto";
import { storeMandateMeta } from "../lib/mandate-meta";
import { COMMIT_DOMAINS } from "../lib/protocol";
import { getChain } from "../midnight/chain";
import { useNetworkStore } from "../store/network";
import { toast } from "../store/toast";

const STEP_TITLES = [
  "Outcome & context",
  "Eligibility & covenant",
  "Budget & deadlines",
  "Review & seal",
] as const;

export function ComposePage() {
  const navigate = useNavigate();
  const networkId = useNetworkStore((s) => s.networkId);
  const createMandate = useCreateMandate();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<ComposeForm>(composeDefaults);
  const [errors, setErrors] = useState<ComposeErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const onChange = (patch: Partial<ComposeForm>) => {
    setForm((f) => ({ ...f, ...patch }));
    setErrors((e) => {
      const next = { ...e };
      for (const key of Object.keys(patch) as Array<keyof ComposeForm>) delete next[key];
      return next;
    });
  };

  const goNext = () => {
    const stepErrors = validateStep(form, STEP_FIELDS[step] ?? []);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length === 0) setStep((s) => Math.min(s + 1, 3));
  };

  const handleSubmit = async () => {
    const parsed = composeSchema.safeParse(form);
    if (!parsed.success) {
      // jump back to the first step that still has an error
      for (let i = 0; i < STEP_FIELDS.length; i++) {
        const stepErrors = validateStep(form, STEP_FIELDS[i] ?? []);
        if (Object.keys(stepErrors).length > 0) {
          setErrors(stepErrors);
          setStep(i);
          return;
        }
      }
      return;
    }

    setSubmitting(true);
    try {
      // 1. per-mandate key, generated and kept on this device
      const keyHex = await generateSymmetricKeyHex();
      // 2. seal the private package client-side
      const privatePackage = buildPrivatePackage(form);
      const covenant = buildCovenant(form);
      const encryptedPackage = await encryptJson(keyHex, privatePackage);
      // 3. commitments with fresh salts (stored locally as openings)
      const { commitment: mandateCommitment } = await makeCommitment(
        COMMIT_DOMAINS.mandate,
        JSON.stringify(privatePackage),
      );
      const { commitment: covenantCommitment } = await makeCommitment(
        COMMIT_DOMAINS.covenant,
        JSON.stringify(covenant),
      );

      const bidDeadline = new Date(form.bidDeadline).toISOString();
      const executionDeadline = new Date(form.executionDeadline).toISOString();

      const mandate = await createMandate.mutateAsync({
        publicDomain: form.domain,
        complexityBand: form.complexityBand,
        discoveryMode: form.discoveryMode,
        bidDeadline,
        executionDeadline,
        mandateCommitment,
        covenantCommitment,
        encryptedPackage,
        ...(form.rewardBand !== "undisclosed" ? { rewardBand: form.rewardBand } : {}),
      });

      storeMandateKey(mandate.id, keyHex);
      storeMandateMeta(mandate.id, { title: form.title });

      await getChain(networkId).deployMandate({
        mandateId: mandate.id,
        mandateCommitment,
        covenantCommitment,
        publicDomain: form.domain,
        bidDeadline,
        executionDeadline,
      });

      toast.success("Mandate sealed", "Only commitments and public metadata left this device.");
      navigate(`/mandates/${mandate.id}`);
    } catch (e) {
      toast.error(
        "Mandate not submitted",
        e instanceof Error ? e.message : "Sealing or submission failed.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const steps: Step[] = STEP_TITLES.map((label, i) => ({
    id: label,
    label,
    status: i < step ? "done" : i === step ? "current" : "upcoming",
  }));

  return (
    <div className="mx-auto max-w-3xl">
      <p className="eyebrow">Mandate composer</p>
      <h1 className="mt-1.5 font-display text-3xl font-bold tracking-tight text-bone">
        Commission a sealed mandate
      </h1>
      <p className="mt-1.5 text-sm text-fog">
        Four steps. Nothing sensitive leaves this device unencrypted, and you will see exactly
        what becomes public before anything is submitted.
      </p>

      <div className="mt-8 overflow-x-auto pb-1">
        <Stepper steps={steps} />
      </div>

      <Card className="mt-6">
        <h2 className="mb-5 font-display text-lg font-semibold text-bone">
          {STEP_TITLES[step]}
        </h2>

        {step === 0 && <StepOutcome form={form} errors={errors} onChange={onChange} />}
        {step === 1 && <StepCovenant form={form} errors={errors} onChange={onChange} />}
        {step === 2 && <StepBudget form={form} errors={errors} onChange={onChange} />}
        {step === 3 && <StepReview form={form} />}

        <div className="mt-8 flex items-center justify-between border-t border-line pt-5">
          <Button variant="ghost" disabled={step === 0 || submitting} onClick={() => setStep((s) => s - 1)}>
            ← Back
          </Button>
          {step < 3 ? (
            <Button variant="primary" onClick={goNext}>
              Continue →
            </Button>
          ) : (
            <Button variant="primary" loading={submitting} onClick={() => void handleSubmit()}>
              {submitting ? "Sealing" : "Seal & submit mandate"}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
