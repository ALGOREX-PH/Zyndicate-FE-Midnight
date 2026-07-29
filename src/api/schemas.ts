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

export const BidSchema = z
  .object({
    id: z.union([z.string(), z.number()]).transform(String),
    mandateId: z.union([z.string(), z.number()]).transform(String).nullish(),
    bidCommitment: z.string().nullish(),
    bidNullifier: z.string().nullish(),
    encryptedBid: EncryptedPayloadSchema.nullish(),
    operatorPublicKey: z.string().nullish(),
    state: z.string().nullish(),
    mine: z.boolean().nullish(),
    createdAt: TimestampSchema,
  })
  .passthrough();

export type BidDto = z.infer<typeof BidSchema>;
export const BidListSchema = z.array(BidSchema).catch([]);

/* -------------------------------- workrooms ------------------------------- */

export const WorkroomSchema = z
  .object({
    mandateId: z.union([z.string(), z.number()]).transform(String).nullish(),
    participants: z.array(z.string()).nullish(),
    createdAt: TimestampSchema,
  })
  .passthrough();

export const WorkroomMessageSchema = z
  .object({
    id: z.union([z.string(), z.number()]).transform(String),
    ciphertext: z.string(),
    nonce: z.string(),
    senderPublicKey: z.string().nullish(),
    createdAt: TimestampSchema,
  })
  .passthrough();

export type WorkroomMessageDto = z.infer<typeof WorkroomMessageSchema>;
export const WorkroomMessageListSchema = z.array(WorkroomMessageSchema).catch([]);

export const ArtifactSchema = z
  .object({
    id: z.union([z.string(), z.number()]).transform(String),
    name: z.string().catch("artifact"),
    digest: z.string().nullish(),
    version: z.union([z.string(), z.number()]).transform(String).nullish(),
    ciphertext: z.string().nullish(),
    nonce: z.string().nullish(),
    createdAt: TimestampSchema,
  })
  .passthrough();

export type ArtifactDto = z.infer<typeof ArtifactSchema>;
export const ArtifactListSchema = z.array(ArtifactSchema).catch([]);

/* ------------------------------ flow objects ------------------------------ */

export const VaultSchema = z
  .object({
    mandateId: z.union([z.string(), z.number()]).transform(String).nullish(),
    state: z.string().nullish(),
    amountBand: z.string().nullish(),
    asset: z.string().nullish(),
    settlementNullifier: z.string().nullish(),
    settledAt: TimestampSchema,
  })
  .passthrough();

export type VaultDto = z.infer<typeof VaultSchema>;

export const DisputeSchema = z
  .object({
    id: z.union([z.string(), z.number()]).transform(String),
    mandateId: z.union([z.string(), z.number()]).transform(String).nullish(),
    state: z.string().nullish(),
    outcome: z.string().nullish(),
    disputeCommitment: z.string().nullish(),
    rulingCommitment: z.string().nullish(),
    createdAt: TimestampSchema,
  })
  .passthrough();

export type DisputeDto = z.infer<typeof DisputeSchema>;
export const DisputeListSchema = z.array(DisputeSchema).catch([]);

/* -------------------------------- passport -------------------------------- */

export const CredentialSchema = z
  .object({
    id: z.union([z.string(), z.number()]).transform(String).nullish(),
    domain: z.string().catch("unspecified"),
    kind: z.string().catch("credential"),
    commitment: z.string().nullish(),
    issuedAt: TimestampSchema,
  })
  .passthrough();

export type CredentialDto = z.infer<typeof CredentialSchema>;

export const ReceiptSchema = z
  .object({
    id: z.union([z.string(), z.number()]).transform(String).nullish(),
    mandateId: z.union([z.string(), z.number()]).transform(String).nullish(),
    kind: z.string().nullish(),
    domain: z.string().nullish(),
    commitment: z.string().nullish(),
    issuedAt: TimestampSchema,
  })
  .passthrough();

export type ReceiptDto = z.infer<typeof ReceiptSchema>;
export const ReceiptListSchema = z.array(ReceiptSchema).catch([]);

export const PassportSchema = z
  .object({
    publicKey: z.string().nullish(),
    displayName: z.string().nullish(),
    identityClass: z.string().nullish(),
    completionBand: z.string().nullish(),
    domains: z.array(z.string()).nullish(),
    credentials: z.array(CredentialSchema).nullish(),
    receipts: z.array(ReceiptSchema).nullish(),
  })
  .passthrough();

export type PassportDto = z.infer<typeof PassportSchema>;

/* --------------------------------- misc ----------------------------------- */

export const OkSchema = z.object({}).passthrough();
