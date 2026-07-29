/** Mandate queries + mutations. */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, qs } from "./client";
import {
  MandateEnvelopeSchema,
  PaginatedMandatesSchema,
  type EncryptedPayloadDto,
} from "./schemas";

export interface MandateFilters {
  domain?: string;
  state?: string;
  mine?: boolean;
  page?: number;
  pageSize?: number;
}

export function useMandates(filters: MandateFilters) {
  return useQuery({
    queryKey: ["mandates", filters],
    queryFn: () =>
      api(
        PaginatedMandatesSchema,
        `/mandates${qs({
          domain: filters.domain,
          state: filters.state,
          mine: filters.mine ? "1" : undefined,
          page: filters.page ?? 1,
          pageSize: filters.pageSize ?? 12,
        })}`,
      ),
  });
}

export function useMandate(id: string | undefined) {
  return useQuery({
    queryKey: ["mandate", id],
    queryFn: () => api(MandateEnvelopeSchema, `/mandates/${id}`),
    enabled: !!id,
  });
}

export interface CreateMandateBody {
  publicDomain: string;
  complexityBand: string;
  discoveryMode: string;
  bidDeadline: string;
  executionDeadline: string;
  mandateCommitment: string;
  covenantCommitment: string;
  encryptedPackage: EncryptedPayloadDto;
  rewardBand?: string;
}

export function useCreateMandate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateMandateBody) =>
      api(MandateEnvelopeSchema, "/mandates", { method: "POST", body }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["mandates"] });
    },
  });
}

export type MandateStateAction = "open_bidding" | "close_bidding" | "cancel";

export function useMandateStateAction(mandateId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (action: MandateStateAction) =>
      api(MandateEnvelopeSchema, `/mandates/${mandateId}/state`, {
        method: "POST",
        body: { action },
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["mandate", mandateId] });
      void queryClient.invalidateQueries({ queryKey: ["mandates"] });
    },
  });
}
