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

/* --------------------------------- auth ---------------------------------- */

export const ChallengeSchema = z.object({ nonce: z.string() }).passthrough();

export const IdentitySchema = z
  .object({
    publicKey: z.string().optional(),
    displayName: z.string().nullish(),
    createdAt: z.string().nullish(),
  })
  .passthrough();

export const VerifySchema = z
  .object({
    token: z.string(),
    identity: IdentitySchema.nullish(),
  })
  .passthrough();

export type IdentityDto = z.infer<typeof IdentitySchema>;

/* -------------------------------- mandates -------------------------------- */

export const MandateSchema = z
  .object({
    id: z.union([z.string(), z.number()]).transform(String),
    publicDomain: z.string().catch("unspecified"),
    complexityBand: z.string().nullish(),
    discoveryMode: z.string().nullish(),
    state: MandateStateSchema,
    bidDeadline: TimestampSchema,
    executionDeadline: TimestampSchema,
    rewardBand: z.string().nullish(),
    mandateCommitment: z.string().nullish(),
    covenantCommitment: z.string().nullish(),
    encryptedPackage: EncryptedPayloadSchema.nullish(),
    principalPublicKey: z.string().nullish(),
    awardedBidId: z.union([z.string(), z.number()]).transform(String).nullish(),
    bidCount: z.number().nullish(),
    mine: z.boolean().nullish(),
    createdAt: z.string().nullish(),
  })
  .passthrough();

export type MandateDto = z.infer<typeof MandateSchema>;

export function paginated<T extends z.ZodTypeAny>(item: T) {
  return z
    .object({
      items: z.array(item).catch([]),
      total: z.number().catch(0),
      page: z.number().catch(1),
      pageSize: z.number().catch(20),
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
    createdAt: z.string().nullish(),
  })
  .passthrough();

export type BidDto = z.infer<typeof BidSchema>;
export const BidListSchema = z.array(BidSchema).catch([]);

/* -------------------------------- workrooms ------------------------------- */

export const WorkroomSchema = z
  .object({
    mandateId: z.union([z.string(), z.number()]).transform(String).nullish(),
    participants: z.array(z.string()).nullish(),
    createdAt: z.string().nullish(),
  })
  .passthrough();

export const WorkroomMessageSchema = z
  .object({
    id: z.union([z.string(), z.number()]).transform(String),
    ciphertext: z.string(),
    nonce: z.string(),
    senderPublicKey: z.string().nullish(),
    createdAt: z.string().nullish(),
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
    createdAt: z.string().nullish(),
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
    settledAt: z.string().nullish(),
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
    createdAt: z.string().nullish(),
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
    issuedAt: z.string().nullish(),
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
    issuedAt: z.string().nullish(),
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
