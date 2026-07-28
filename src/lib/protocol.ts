/**
 * Zyndicate protocol vocabulary + client-side derivations shared across pages.
 */
import { sha256Hex } from "./crypto";
import { getSecretHex } from "./identity";

/** Launch domains (PRD 28.2) plus the general classes the Exchange filters on. */
export const DOMAINS = [
  { id: "security", label: "Security" },
  { id: "data_analysis", label: "Private data analysis" },
  { id: "ai_evaluation", label: "AI evaluation" },
  { id: "software", label: "Software" },
  { id: "legal", label: "Legal review" },
  { id: "research", label: "Research" },
] as const;

export const COMPLEXITY_BANDS = [
  { id: "routine", label: "Routine" },
  { id: "standard", label: "Standard" },
  { id: "elevated", label: "Elevated" },
  { id: "formidable", label: "Formidable" },
] as const;

export const REWARD_BANDS = [
  { id: "undisclosed", label: "Undisclosed" },
  { id: "band_1", label: "Under 1k" },
  { id: "band_2", label: "1k – 5k" },
  { id: "band_3", label: "5k – 25k" },
  { id: "band_4", label: "25k – 100k" },
  { id: "band_5", label: "Over 100k" },
] as const;

export const DISCOVERY_MODES = [
  { id: "open", label: "Open", hint: "Any eligible operator may attempt eligibility." },
  { id: "gated", label: "Gated", hint: "Only credentialed operators receive the summary." },
  { id: "invitation", label: "Invitation-only", hint: "You select the operators or cells." },
] as const;

export function domainLabel(id: string | null | undefined): string {
  return DOMAINS.find((d) => d.id === id)?.label ?? (id ?? "Unspecified");
}

export function rewardBandLabel(id: string | null | undefined): string {
  return REWARD_BANDS.find((b) => b.id === id)?.label ?? (id ?? "Undisclosed");
}

export function complexityLabel(id: string | null | undefined): string {
  return COMPLEXITY_BANDS.find((b) => b.id === id)?.label ?? (id ?? "Standard");
}

/* ------------------------------- nullifiers ------------------------------- */
/*
 * A nullifier proves a private right was consumed without revealing which
 * secret produced it. Derived locally from the identity secret — only the
 * hash ever leaves the device. Deterministic per (secret, mandate), so a
 * duplicate bid or double settlement collides server-side and is rejected.
 */

export function deriveBidNullifier(mandateId: string): Promise<string> {
  return sha256Hex(`zyndicate:bid-nullifier:${mandateId}:${getSecretHex()}`);
}

export function deriveSettlementNullifier(mandateId: string): Promise<string> {
  return sha256Hex(`zyndicate:settlement-nullifier:${mandateId}:${getSecretHex()}`);
}

/* ------------------------- commitment domain tags ------------------------- */
/* Domain separation (PRD 13.4): every commitment type gets its own prefix.  */

export const COMMIT_DOMAINS = {
  mandate: "zyndicate:commit:mandate:v1",
  covenant: "zyndicate:commit:covenant:v1",
  bid: "zyndicate:commit:bid:v1",
  submission: "zyndicate:commit:submission:v1",
  evaluation: "zyndicate:commit:evaluation:v1",
  dispute: "zyndicate:commit:dispute:v1",
  ruling: "zyndicate:commit:ruling:v1",
  credential: "zyndicate:commit:credential:v1",
} as const;
