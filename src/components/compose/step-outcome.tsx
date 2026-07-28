import { Field, Input, Select, Textarea } from "../ui/field";
import { Badge } from "../ui/state-pill";
import { COMPLEXITY_BANDS, DISCOVERY_MODES, DOMAINS } from "../../lib/protocol";
import type { ComposeErrors, ComposeForm } from "./form";

export interface StepProps {
  form: ComposeForm;
  errors: ComposeErrors;
  onChange: (patch: Partial<ComposeForm>) => void;
}

export function StepOutcome({ form, errors, onChange }: StepProps) {
  return (
    <div className="space-y-5">
      <Field
        label="Working title"
        htmlFor="compose-title"
        error={errors.title}
        hint="Sealed. Only key holders ever read it."
      >
        <Input
          id="compose-title"
          value={form.title}
          invalid={!!errors.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Audit the unreleased settlement contracts"
          maxLength={120}
        />
      </Field>

      <Field
        label="Required outcome"
        htmlFor="compose-outcome"
        error={errors.outcome}
        hint="Sealed. What must exist for this mandate to be complete?"
      >
        <Textarea
          id="compose-outcome"
          value={form.outcome}
          invalid={!!errors.outcome}
          onChange={(e) => onChange({ outcome: e.target.value })}
          placeholder="A written vulnerability report covering the contracts in scope, with severity ratings and reproduction steps…"
          rows={5}
        />
      </Field>

      <Field
        label="Sensitive context"
        htmlFor="compose-context"
        error={errors.context}
        hint="Sealed. Optional background the operator needs — never shown before award."
      >
        <Textarea
          id="compose-context"
          value={form.context}
          onChange={(e) => onChange({ context: e.target.value })}
          placeholder="Repository access will be granted in the workroom. The release is unannounced…"
          rows={4}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field
          label="Domain"
          htmlFor="compose-domain"
          error={errors.domain}
          hint="Public — the only topic signal."
        >
          <Select
            id="compose-domain"
            value={form.domain}
            invalid={!!errors.domain}
            onChange={(e) => onChange({ domain: e.target.value })}
          >
            <option value="">Select…</option>
            {DOMAINS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label="Complexity band"
          htmlFor="compose-complexity"
          error={errors.complexityBand}
          hint="Public."
        >
          <Select
            id="compose-complexity"
            value={form.complexityBand}
            onChange={(e) => onChange({ complexityBand: e.target.value })}
          >
            {COMPLEXITY_BANDS.map((b) => (
              <option key={b.id} value={b.id}>
                {b.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label="Discovery mode"
          htmlFor="compose-discovery"
          error={errors.discoveryMode}
          hint={DISCOVERY_MODES.find((m) => m.id === form.discoveryMode)?.hint ?? ""}
        >
          <Select
            id="compose-discovery"
            value={form.discoveryMode}
            onChange={(e) => onChange({ discoveryMode: e.target.value })}
          >
            {DISCOVERY_MODES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="flex items-center gap-2 border-t border-line pt-4">
        <Badge tone="vio">Sealed</Badge>
        <p className="text-xs text-dim">
          Title, outcome, and context are encrypted on this device before submission.
        </p>
      </div>
    </div>
  );
}
