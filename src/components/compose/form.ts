/** Composer form model: zod-validated, per-step field groups. */
import { z } from "zod";

export const DISCLOSURE_POLICIES = [
  { id: "none", label: "No later disclosure" },
  { id: "tribunal_only", label: "Tribunal only, during a dispute" },
  { id: "evaluator_and_tribunal", label: "Evaluator + Tribunal, scoped" },
] as const;

export const DISPUTE_METHODS = [
  { id: "designated_evaluator", label: "Designated evaluator rules" },
  { id: "panel", label: "Three-member panel" },
  { id: "negotiation_first", label: "Negotiation, then evaluator" },
] as const;

export const composeSchema = z
  .object({
    // step 1 — outcome & context
    title: z.string().trim().min(4, "Give the mandate a working title (4+ characters)."),
    outcome: z
      .string()
      .trim()
      .min(20, "Describe the required outcome in at least 20 characters."),
    context: z.string().trim(),
    domain: z.string().min(1, "Select a domain — it is the only public topic signal."),
    complexityBand: z.string().min(1, "Select a complexity band."),
    discoveryMode: z.string().min(1, "Select a discovery mode."),

    // step 2 — eligibility & covenant
    minReputationBand: z.string().min(1, "Select a minimum reputation band."),
    requiredCredential: z.string().trim(),
    acceptanceCriteria: z
      .string()
      .trim()
      .min(20, "State the acceptance criteria in at least 20 characters."),
    executionConstraints: z.string().trim(),
    disclosurePolicy: z.string().min(1, "Select a disclosure policy."),
    disputeMethod: z.string().min(1, "Select a dispute method."),

    // step 3 — budget & deadlines
    maxBudget: z
      .string()
      .trim()
      .min(1, "Enter the maximum budget — it stays sealed.")
      .refine((v) => Number(v) > 0, "Budget must be a number greater than zero."),
    rewardBand: z.string().min(1, "Select a public reward band (or Undisclosed)."),
    bidDeadline: z
      .string()
      .min(1, "Set a bid deadline.")
      .refine(
        (v) => new Date(v).getTime() > Date.now(),
        "Bid deadline must be in the future.",
      ),
    executionDeadline: z.string().min(1, "Set an execution deadline."),
  })
  .refine(
    (data) =>
      !data.bidDeadline ||
      !data.executionDeadline ||
      new Date(data.executionDeadline).getTime() > new Date(data.bidDeadline).getTime(),
    {
      message: "Execution deadline must come after the bid deadline.",
      path: ["executionDeadline"],
    },
  );

export type ComposeForm = z.infer<typeof composeSchema>;
export type ComposeErrors = Partial<Record<keyof ComposeForm, string>>;

export const composeDefaults: ComposeForm = {
  title: "",
  outcome: "",
  context: "",
  domain: "",
  complexityBand: "standard",
  discoveryMode: "open",
  minReputationBand: "2",
  requiredCredential: "",
  acceptanceCriteria: "",
  executionConstraints: "",
  disclosurePolicy: "tribunal_only",
  disputeMethod: "designated_evaluator",
  maxBudget: "",
  rewardBand: "undisclosed",
  bidDeadline: "",
  executionDeadline: "",
};

export const STEP_FIELDS: ReadonlyArray<ReadonlyArray<keyof ComposeForm>> = [
  ["title", "outcome", "context", "domain", "complexityBand", "discoveryMode"],
  [
    "minReputationBand",
    "requiredCredential",
    "acceptanceCriteria",
    "executionConstraints",
    "disclosurePolicy",
    "disputeMethod",
  ],
  ["maxBudget", "rewardBand", "bidDeadline", "executionDeadline"],
  [],
];

/** Validate the whole form and keep only errors belonging to `fields`. */
export function validateStep(
  form: ComposeForm,
  fields: ReadonlyArray<keyof ComposeForm>,
): ComposeErrors {
  const result = composeSchema.safeParse(form);
  if (result.success) return {};
  const errors: ComposeErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof ComposeForm | undefined;
    if (key && fields.includes(key) && !errors[key]) {
      errors[key] = issue.message;
    }
  }
  return errors;
}

/** The private mandate package — encrypted client-side before upload. */
export function buildPrivatePackage(form: ComposeForm) {
  return {
    title: form.title,
    outcome: form.outcome,
    context: form.context,
    eligibility: {
      minReputationBand: form.minReputationBand,
      requiredCredential: form.requiredCredential || null,
    },
    covenant: buildCovenant(form),
    maxBudget: form.maxBudget,
  };
}

/** The covenant portion, committed separately (immutable once bidding opens). */
export function buildCovenant(form: ComposeForm) {
  return {
    acceptanceCriteria: form.acceptanceCriteria,
    executionConstraints: form.executionConstraints || null,
    disclosurePolicy: form.disclosurePolicy,
    disputeMethod: form.disputeMethod,
    minReputationBand: form.minReputationBand,
    requiredCredential: form.requiredCredential || null,
  };
}
