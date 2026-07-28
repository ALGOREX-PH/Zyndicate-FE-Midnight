/**
 * Mandate flow endpoints: submission → evaluation → settlement, plus the
 * vault view and the tribunal (disputes + rulings).
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, qs } from "./client";
import { DisputeListSchema, DisputeSchema, OkSchema, VaultSchema } from "./schemas";

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
      api(OkSchema, `/mandates/${mandateId}/submissions`, { method: "POST", body }),
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
      api(OkSchema, `/mandates/${mandateId}/evaluations`, { method: "POST", body }),
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
      api(OkSchema, `/mandates/${mandateId}/settle`, {
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
    queryFn: () => api(VaultSchema, `/vault/${mandateId}`),
    enabled: !!mandateId,
    retry: false,
  });
}

/* --------------------------------- tribunal ------------------------------- */

export function useDisputes(mine = true) {
  return useQuery({
    queryKey: ["disputes", { mine }],
    queryFn: () => api(DisputeListSchema, `/disputes${qs({ mine: mine ? "1" : undefined })}`),
  });
}

export function useOpenDispute(mandateId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (disputeCommitment: string) =>
      api(DisputeSchema, `/mandates/${mandateId}/disputes`, {
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
      api(OkSchema, `/disputes/${disputeId}/ruling`, { method: "POST", body }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["disputes"] });
      void queryClient.invalidateQueries({ queryKey: ["mandates"] });
    },
  });
}
