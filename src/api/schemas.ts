/**
 * Zod schemas for the Zyndicate backend contract (base /api/v1).
 * The backend is being built in parallel, so entity schemas are tolerant:
 * unknown fields pass through, most fields are optional with safe defaults.
 */
import { z } from "zod";

export const MANDATE_STATES = [
  "draft",
  "open_for_bids",
  "bidding_closed",
  "awarded",
  "in_execution",
  "submitted",
  "accepted",
  "settled",
  "disputed",
  "resolved",
  "cancelled",
] as const;

export type MandateState = (typeof MANDATE_STATES)[number];

export const MandateStateSchema = z.enum(MANDATE_STATES).catch("draft");

/**
 * The backend serializes instants as epoch milliseconds. ISO strings are
 * accepted as well so a change of serialization cannot silently empty a list.
 */
export const TimestampSchema = z.union([z.string(), z.number()]).nullish();

export const EncryptedPayloadSchema = z.object({
  ciphertext: z.string(),
  nonce: z.string(),
});

export type EncryptedPayloadDto = z.infer<typeof EncryptedPayloadSchema>;

/* ---------------------------- response envelopes -------------------------- */

/**
 * The backend wraps every single entity in a one-key envelope — `{ mandate }`,
 * `{ bid }`, `{ workroom }`, `{ vault }`, `{ identity }`, … — so unwrap it here
 * and hand callers the entity itself. A missing key is a contract break and
 * fails the parse rather than degrading into an empty render.
 */
export function envelope<T extends z.ZodTypeAny>(key: string, inner: T) {
  return z
    .object({ [key]: inner })
    .passthrough()
    .transform((value) => value[key] as z.infer<T>);
}

/**
 * List envelope: `{ items: [...] }`, with or without the pagination fields
 * beside it. Unwraps to the array; a wrong shape fails rather than yielding [].
 */
export function itemsOf<T extends z.ZodTypeAny>(inner: T) {
  return z
    .object({ items: z.array(inner) })
    .passthrough()
    .transform((value) => value.items as z.infer<T>[]);
}

/* --------------------------------- auth ---------------------------------- */

/** `POST /auth/challenge` → `{ nonce, expiresAt }` — no envelope. */
export const ChallengeSchema = z
  .object({ nonce: z.string(), expiresAt: z.string() })
  .passthrough();

export const IdentitySchema = z
  .object({
    publicKey: z.string(),
    displayName: z.string().nullable(),
    roleHints: z.array(z.string()),
    createdAt: TimestampSchema,
  })
  .passthrough();

/** `POST /auth/verify` → `{ token, identity }` — no envelope. */
export const VerifySchema = z
  .object({
    token: z.string(),
    identity: IdentitySchema,
  })
  .passthrough();

export type IdentityDto = z.infer<typeof IdentitySchema>;

/** `GET /me`, `PUT /me` → `{ identity }`. */
export const IdentityEnvelopeSchema = envelope("identity", IdentitySchema);

/* -------------------------------- mandates -------------------------------- */

/**
 * The caller's role on a mandate, as decided by the backend from
 * `principalKey`, the awarded bid's `operatorKey` and `evaluatorKey`.
 * `null` (or absent, on a Class A summary) means outsider.
 */
export const VIEWER_ROLES = ["principal", "operator", "evaluator"] as const;
export type ViewerRole = (typeof VIEWER_ROLES)[number];
export const ViewerRoleSchema = z.enum(VIEWER_ROLES);

export const MandateSchema = z
  .object({
    id: z.string(),
    publicDomain: z.string(),
    complexityBand: z.string().nullish(),
    discoveryMode: z.string().nullish(),
    state: MandateStateSchema,
    bidDeadline: TimestampSchema,
    executionDeadline: TimestampSchema,
    mandateCommitment: z.string(),
    covenantCommitment: z.string(),
    rewardBand: z.string().nullish(),
    chainAddress: z.string().nullish(),
    createdAt: TimestampSchema,
    updatedAt: TimestampSchema,
    /* Detail-only. Absent on the Class A summaries returned by GET /mandates. */
    viewerRole: ViewerRoleSchema.nullish(),
    /* Participant-only. Absent for outsiders. */
    encryptedPackage: EncryptedPayloadSchema.nullish(),
    principalKey: z.string().nullish(),
    evaluatorKey: z.string().nullish(),
    awardedBidId: z.string().nullish(),
    awardAcceptedAt: TimestampSchema,
  })
  .passthrough();

export type MandateDto = z.infer<typeof MandateSchema>;

/** `POST /mandates`, `GET /mandates/:id`, `/state`, `/award`, `/accept`. */
export const MandateEnvelopeSchema = envelope("mandate", MandateSchema);

/**
 * `{ items, page, pageSize, total, totalPages }`. No `.catch` fallbacks: a
 * contract break must surface as an error state, not as "nothing here yet".
 */
export function paginated<T extends z.ZodTypeAny>(item: T) {
  return z
    .object({
      items: z.array(item),
      total: z.number(),
      page: z.number(),
      pageSize: z.number(),
      totalPages: z.number().optional(),
    })
    .passthrough();
}

export const PaginatedMandatesSchema = paginated(MandateSchema);
export type PaginatedMandates = z.infer<typeof PaginatedMandatesSchema>;

/* ---------------------------------- bids ---------------------------------- */

export const BID_STATUSES = ["pending", "withdrawn", "awarded", "rejected"] as const;
export type BidStatus = (typeof BID_STATUSES)[number];

export const BidSchema = z
  .object({
    id: z.string(),
    mandateId: z.string(),
    /** Bidding operator's public key — the "is this mine?" signal. */
    operatorKey: z.string(),
    bidCommitment: z.string(),
    bidNullifier: z.string(),
    status: z.enum(BID_STATUSES),
    createdAt: TimestampSchema,
    updatedAt: TimestampSchema,
    /** Present for rows the caller is entitled to decrypt. */
    encryptedBid: EncryptedPayloadSchema.optional(),
  })
  .passthrough();

export type BidDto = z.infer<typeof BidSchema>;

/** `POST /mandates/:id/bids`, `DELETE /mandates/:id/bids/:bidId`. */
export const BidEnvelopeSchema = envelope("bid", BidSchema);
/** `GET /mandates/:id/bids` → `{ items }`. */
export const BidListSchema = itemsOf(BidSchema);

/* -------------------------------- workrooms ------------------------------- */

export const WorkroomMemberSchema = z
  .object({ publicKey: z.string(), role: ViewerRoleSchema })
  .passthrough();

export type WorkroomMemberDto = z.infer<typeof WorkroomMemberSchema>;

export const WorkroomSchema = z
  .object({
    mandateId: z.string(),
    state: z.string(),
    createdAt: TimestampSchema,
    /** Principal + awarded operator + designated evaluator. */
    members: z.array(WorkroomMemberSchema),
  })
  .passthrough();

export type WorkroomDto = z.infer<typeof WorkroomSchema>;
export const WorkroomEnvelopeSchema = envelope("workroom", WorkroomSchema);

export const WorkroomMessageSchema = z
  .object({
    id: z.string(),
    mandateId: z.string().nullish(),
    senderKey: z.string(),
    ciphertext: z.string(),
    nonce: z.string(),
    createdAt: TimestampSchema,
  })
  .passthrough();

export type WorkroomMessageDto = z.infer<typeof WorkroomMessageSchema>;
export const WorkroomMessageEnvelopeSchema = envelope("message", WorkroomMessageSchema);
/** Paginated envelope; the thread only needs the rows. */
export const WorkroomMessageListSchema = itemsOf(WorkroomMessageSchema);

export const ArtifactSchema = z
  .object({
    id: z.string(),
    mandateId: z.string().nullish(),
    uploaderKey: z.string().nullish(),
    name: z.string(),
    digest: z.string(),
    /** Client-managed integer version counter. */
    version: z.number(),
    ciphertext: z.string(),
    nonce: z.string(),
    createdAt: TimestampSchema,
  })
  .passthrough();

export type ArtifactDto = z.infer<typeof ArtifactSchema>;
export const ArtifactEnvelopeSchema = envelope("artifact", ArtifactSchema);
export const ArtifactListSchema = itemsOf(ArtifactSchema);

/* ------------------------------ flow objects ------------------------------ */

export const SubmissionSchema = z
  .object({
    id: z.string(),
    mandateId: z.string(),
    artifactId: z.string(),
    submissionCommitment: z.string(),
    digest: z.string(),
    submittedAt: TimestampSchema,
  })
  .passthrough();

/** `POST /mandates/:id/submissions` → `{ submission, state }`. */
export const SubmissionEnvelopeSchema = envelope("submission", SubmissionSchema);

export const EVALUATION_VERDICTS = ["accept", "reject", "revise"] as const;

export const EvaluationSchema = z
  .object({
    id: z.string(),
    mandateId: z.string(),
    evaluatorKey: z.string(),
    verdict: z.enum(EVALUATION_VERDICTS),
    evaluationCommitment: z.string(),
    attestation: z.string(),
    createdAt: TimestampSchema,
  })
  .passthrough();

/** `POST /mandates/:id/evaluations` → `{ evaluation, state }`. */
export const EvaluationEnvelopeSchema = envelope("evaluation", EvaluationSchema);

export const SettlementSchema = z
  .object({
    mandateId: z.string().nullish(),
    settlementNullifier: z.string(),
    amountCommitment: z.string().nullish(),
    settledAt: TimestampSchema,
  })
  .passthrough();

export type SettlementDto = z.infer<typeof SettlementSchema>;

/** `POST /mandates/:id/settle` → `{ settlement, state, receipts }`. */
export const SettlementEnvelopeSchema = envelope("settlement", SettlementSchema);

export const VaultSchema = z
  .object({
    mandateId: z.string(),
    /** The mandate's state, mirrored — the vault has no state of its own. */
    state: z.string(),
    disputeOpen: z.boolean(),
    /** `null` until settlement is released. */
    settlement: SettlementSchema.nullable(),
  })
  .passthrough();

export type VaultDto = z.infer<typeof VaultSchema>;
export const VaultEnvelopeSchema = envelope("vault", VaultSchema);

export const DISPUTE_STATUSES = ["open", "ruled"] as const;
export const DISPUTE_OUTCOMES = ["release", "refund"] as const;

export const DisputeSchema = z
  .object({
    id: z.string(),
    mandateId: z.string(),
    openedBy: z.string().nullish(),
    disputeCommitment: z.string(),
    status: z.enum(DISPUTE_STATUSES),
    rulingCommitment: z.string().nullish(),
    outcome: z.enum(DISPUTE_OUTCOMES).nullish(),
    ruledAt: TimestampSchema,
    createdAt: TimestampSchema,
  })
  .passthrough();

export type DisputeDto = z.infer<typeof DisputeSchema>;
/** `POST /mandates/:id/disputes` and `POST /disputes/:id/ruling` → `{ dispute, state }`. */
export const DisputeEnvelopeSchema = envelope("dispute", DisputeSchema);
/** `GET /disputes` → `{ items }`. */
export const DisputeListSchema = itemsOf(DisputeSchema);

/* -------------------------------- passport -------------------------------- */

export const CredentialSchema = z
  .object({
    id: z.string(),
    passportKey: z.string().nullish(),
    domain: z.string(),
    kind: z.string(),
    commitment: z.string(),
    revokedAt: TimestampSchema,
    issuedAt: TimestampSchema,
  })
  .passthrough();

export type CredentialDto = z.infer<typeof CredentialSchema>;
/** `POST /passports/credentials` → `{ credential }`. */
export const CredentialEnvelopeSchema = envelope("credential", CredentialSchema);

export const RECEIPT_KINDS = ["completion", "payment", "evaluation"] as const;

export const ReceiptSchema = z
  .object({
    id: z.string(),
    mandateId: z.string().nullish(),
    holderKey: z.string().nullish(),
    kind: z.enum(RECEIPT_KINDS),
    receiptCommitment: z.string(),
    issuedAt: TimestampSchema,
  })
  .passthrough();

export type ReceiptDto = z.infer<typeof ReceiptSchema>;
/** `GET /me/receipts` → `{ items }`. */
export const ReceiptListSchema = itemsOf(ReceiptSchema);

/**
 * The coarse public passport. There is no credential or receipt list on it:
 * `domains` is the only public trace of registered credentials, and receipts
 * are read from `GET /me/receipts` by their holder alone.
 */
export const PassportSchema = z
  .object({
    publicKey: z.string(),
    identityClass: z.string(),
    domains: z.array(z.string()),
    completionBand: z.string(),
    activeSince: TimestampSchema,
  })
  .passthrough();

export type PassportDto = z.infer<typeof PassportSchema>;
/** `GET /passports/:publicKey` → `{ passport }`. */
export const PassportEnvelopeSchema = envelope("passport", PassportSchema);
