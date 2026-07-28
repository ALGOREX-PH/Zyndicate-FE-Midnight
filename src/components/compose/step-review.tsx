import { PrivacyPreview } from "../ui/privacy-preview";
import { DefinitionList } from "../ui/definition-list";
import { complexityLabel, domainLabel, rewardBandLabel } from "../../lib/protocol";
import { formatDateTime } from "../../lib/format";
import { DISCLOSURE_POLICIES, DISPUTE_METHODS, type ComposeForm } from "./form";

/** Final check: a plain summary + the privacy preview (PRD 6.4) before sealing. */
export function StepReview({ form }: { form: ComposeForm }) {
  return (
    <div className="space-y-6">
      <section aria-label="Mandate summary" className="rounded-[4px] border border-line p-4">
        <h3 className="eyebrow mb-3">Summary</h3>
        <DefinitionList
          items={[
            { label: "Title", value: form.title },
            { label: "Domain", value: domainLabel(form.domain) },
            { label: "Complexity", value: complexityLabel(form.complexityBand) },
            { label: "Reward band", value: rewardBandLabel(form.rewardBand) },
            { label: "Max budget", value: `${form.maxBudget} (sealed)` },
            { label: "Bid deadline", value: formatDateTime(form.bidDeadline) },
            { label: "Execution deadline", value: formatDateTime(form.executionDeadline) },
            {
              label: "Disclosure",
              value:
                DISCLOSURE_POLICIES.find((p) => p.id === form.disclosurePolicy)?.label ??
                form.disclosurePolicy,
            },
            {
              label: "Disputes",
              value:
                DISPUTE_METHODS.find((m) => m.id === form.disputeMethod)?.label ??
                form.disputeMethod,
            },
          ]}
        />
      </section>

      <PrivacyPreview
        local={[
          "The mandate key (AES-256) — generated on this device, held only by you",
          "Commitment salts (the openings that can later prove what was sealed)",
          "Your Zyndicate identity secret",
        ]}
        sealed={[
          "Title, required outcome, and sensitive context",
          "Eligibility policy and full covenant terms",
          "Maximum budget",
        ]}
        access={[
          "You (Principal) hold the only key until award",
          "The awarded operator receives the workroom key from you, off-ledger",
        ]}
        publicFacts={[
          `A mandate exists in domain "${domainLabel(form.domain)}"`,
          `Complexity "${complexityLabel(form.complexityBand)}" · reward band "${rewardBandLabel(form.rewardBand)}"`,
          "Bid and execution deadlines",
          "Mandate commitment and covenant commitment (hashes only)",
        ]}
        disclosable={[
          "Covenant terms — to the Tribunal, during an authorized dispute",
          "Evidence capsule contents — per your disclosure policy",
        ]}
      />
    </div>
  );
}
