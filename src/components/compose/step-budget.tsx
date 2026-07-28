import { Field, Input, Select } from "../ui/field";
import { Badge } from "../ui/state-pill";
import { REWARD_BANDS } from "../../lib/protocol";
import type { StepProps } from "./step-outcome";

export function StepBudget({ form, errors, onChange }: StepProps) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Maximum budget"
          htmlFor="compose-budget"
          error={errors.maxBudget}
          hint="Sealed. Bidders never see it — they see only the public reward band."
        >
          <Input
            id="compose-budget"
            type="number"
            inputMode="decimal"
            min="0"
            value={form.maxBudget}
            invalid={!!errors.maxBudget}
            onChange={(e) => onChange({ maxBudget: e.target.value })}
            placeholder="25000"
          />
        </Field>

        <Field
          label="Public reward band"
          htmlFor="compose-reward"
          error={errors.rewardBand}
          hint="Public. Coarse on purpose — pick Undisclosed to reveal nothing."
        >
          <Select
            id="compose-reward"
            value={form.rewardBand}
            onChange={(e) => onChange({ rewardBand: e.target.value })}
          >
            {REWARD_BANDS.map((b) => (
              <option key={b.id} value={b.id}>
                {b.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Bid deadline"
          htmlFor="compose-bid-deadline"
          error={errors.bidDeadline}
          hint="Public. Sealed bids are committed before this moment."
        >
          <Input
            id="compose-bid-deadline"
            type="datetime-local"
            value={form.bidDeadline}
            invalid={!!errors.bidDeadline}
            onChange={(e) => onChange({ bidDeadline: e.target.value })}
          />
        </Field>

        <Field
          label="Execution deadline"
          htmlFor="compose-exec-deadline"
          error={errors.executionDeadline}
          hint="Public. The submission commitment must land before this moment."
        >
          <Input
            id="compose-exec-deadline"
            type="datetime-local"
            value={form.executionDeadline}
            invalid={!!errors.executionDeadline}
            onChange={(e) => onChange({ executionDeadline: e.target.value })}
          />
        </Field>
      </div>

      <div className="flex items-center gap-2 border-t border-line pt-4">
        <Badge tone="neutral">Vault</Badge>
        <p className="text-xs text-dim">
          On award, the vault reserves funds against this budget and releases exactly once, on
          acceptance.
        </p>
      </div>
    </div>
  );
}
