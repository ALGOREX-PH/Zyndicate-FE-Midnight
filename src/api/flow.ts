/**
 * Mandate flow endpoints: submission → evaluation → settlement, plus the
 * vault view and the tribunal (disputes + rulings).
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";
import {
  DisputeEnvelopeSchema,
  DisputeListSchema,
  EvaluationEnvelopeSchema,
  SettlementEnvelopeSchema,
  SubmissionEnvelopeSchema,
  VaultEnvelopeSchema,
} from "./schemas";

/* ------------------------------- submissions ------------------------------ */

export interface SubmissionBody {
  artifactId: string;
  submissionCommitment: string;
  digest: string;
}

export function useCommitSubmission(mandateId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: SubmissionBody) =>
      api(SubmissionEnvelopeSchema, `/mandates/${mandateId}/submissions`, { method: "POST", body }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["mandate", mandateId] });
    },
  });
}

/* ------------------------------- evaluations ------------------------------ */

export type Verdict = "accept" | "reject" | "revise";

export interface EvaluationBody {
  verdict: Verdict;
  evaluationCommitment: string;
  attestation: string;
}

export function useRecordEvaluation(mandateId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: EvaluationBody) =>
      api(EvaluationEnvelopeSchema, `/mandates/${mandateId}/evaluations`, { method: "POST", body }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["mandate", mandateId] });
    },
  });
}

/* -------------------------------- settlement ------------------------------ */

export function useSettle(mandateId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settlementNullifier: string) =>
      api(SettlementEnvelopeSchema, `/mandates/${mandateId}/settle`, {
        method: "POST",
        body: { settlementNullifier },
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["mandate", mandateId] });
      void queryClient.invalidateQueries({ queryKey: ["vault", mandateId] });
    },
  });
}

export function useVault(mandateId: string | undefined) {
  return useQuery({
    queryKey: ["vault", mandateId],
    queryFn: () => api(VaultEnvelopeSchema, `/vault/${mandateId}`),
    enabled: !!mandateId,
    retry: false,
  });
}

/* --------------------------------- tribunal ------------------------------- */

/**
 * GET /disputes is always scoped to the caller — there is no unscoped listing,
 * so no query parameter is sent.
 */
export function useDisputes() {
  return useQuery({
    queryKey: ["disputes"],
    queryFn: () => api(DisputeListSchema, "/disputes"),
  });
}

export function useOpenDispute(mandateId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (disputeCommitment: string) =>
      api(DisputeEnvelopeSchema, `/mandates/${mandateId}/disputes`, {
        method: "POST",
        body: { disputeCommitment },
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["mandate", mandateId] });
      void queryClient.invalidateQueries({ queryKey: ["disputes"] });
    },
  });
}

export interface RulingBody {
  rulingCommitment: string;
  outcome: "release" | "refund";
}

export function useRecordRuling() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ disputeId, ...body }: RulingBody & { disputeId: string }) =>
      api(DisputeEnvelopeSchema, `/disputes/${disputeId}/ruling`, { method: "POST", body }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["disputes"] });
      void queryClient.invalidateQueries({ queryKey: ["mandates"] });
    },
  });
}
