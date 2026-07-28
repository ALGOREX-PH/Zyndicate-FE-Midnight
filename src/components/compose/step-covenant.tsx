import { Field, Input, Select, Textarea } from "../ui/field";
import { Badge } from "../ui/state-pill";
import { DISCLOSURE_POLICIES, DISPUTE_METHODS } from "./form";
import type { StepProps } from "./step-outcome";

export function StepCovenant({ form, errors, onChange }: StepProps) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Minimum reputation band"
          htmlFor="compose-repband"
          error={errors.minReputationBand}
          hint="Operators prove band ≥ threshold — never their exact score."
        >
          <Select
            id="compose-repband"
            value={form.minReputationBand}
            onChange={(e) => onChange({ minReputationBand: e.target.value })}
          >
            {["1", "2", "3", "4", "5"].map((band) => (
              <option key={band} value={band}>
                Band {band}+
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label="Required credential"
          htmlFor="compose-credential"
          error={errors.requiredCredential}
          hint="Optional. Operators prove possession without revealing the full credential."
        >
          <Input
            id="compose-credential"
            value={form.requiredCredential}
            onChange={(e) => onChange({ requiredCredential: e.target.value })}
            placeholder="smart_contract_security"
          />
        </Field>
      </div>

      <Field
        label="Acceptance criteria"
        htmlFor="compose-acceptance"
        error={errors.acceptanceCriteria}
        hint="Sealed. The evaluator judges the submission against exactly this."
      >
        <Textarea
          id="compose-acceptance"
          value={form.acceptanceCriteria}
          invalid={!!errors.acceptanceCriteria}
          onChange={(e) => onChange({ acceptanceCriteria: e.target.value })}
          placeholder="Every contract in scope reviewed; all critical and high findings documented with reproduction steps; false-positive rate under 20%…"
          rows={5}
        />
      </Field>

      <Field
        label="Execution constraints"
        htmlFor="compose-constraints"
        error={errors.executionConstraints}
        hint="Sealed. Optional: data-use limits, permitted tooling, retention rules."
      >
        <Textarea
          id="compose-constraints"
          value={form.executionConstraints}
          onChange={(e) => onChange({ executionConstraints: e.target.value })}
          placeholder="No third-party data processors. Working copies deleted after settlement, attested…"
          rows={4}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Disclosure policy"
          htmlFor="compose-disclosure"
          error={errors.disclosurePolicy}
          hint="Who may open sealed evidence, and when."
        >
          <Select
            id="compose-disclosure"
            value={form.disclosurePolicy}
            onChange={(e) => onChange({ disclosurePolicy: e.target.value })}
          >
            {DISCLOSURE_POLICIES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label="Dispute method"
          htmlFor="compose-dispute"
          error={errors.disputeMethod}
          hint="Declared now, immutable once bidding opens."
        >
          <Select
            id="compose-dispute"
            value={form.disputeMethod}
            onChange={(e) => onChange({ disputeMethod: e.target.value })}
          >
            {DISPUTE_METHODS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="flex items-center gap-2 border-t border-line pt-4">
        <Badge tone="amber">Committed</Badge>
        <p className="text-xs text-dim">
          The covenant is hashed into a public commitment — it cannot be altered silently after
          bidding opens.
        </p>
      </div>
    </div>
  );
}
