/** Sealed bids: commitments + nullifiers in, ciphertext only, award + accept. */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";
import {
  BidEnvelopeSchema,
  BidListSchema,
  MandateEnvelopeSchema,
  type EncryptedPayloadDto,
} from "./schemas";

export function useBids(mandateId: string | undefined) {
  return useQuery({
    queryKey: ["bids", mandateId],
    queryFn: () => api(BidListSchema, `/mandates/${mandateId}/bids`),
    enabled: !!mandateId,
  });
}

export interface SubmitBidBody {
  bidCommitment: string;
  bidNullifier: string;
  encryptedBid: EncryptedPayloadDto;
}

export function useSubmitBid(mandateId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: SubmitBidBody) =>
      api(BidEnvelopeSchema, `/mandates/${mandateId}/bids`, { method: "POST", body }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["bids", mandateId] });
      void queryClient.invalidateQueries({ queryKey: ["mandate", mandateId] });
    },
  });
}

export function useWithdrawBid(mandateId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bidId: string) =>
      api(BidEnvelopeSchema, `/mandates/${mandateId}/bids/${bidId}`, { method: "DELETE" }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["bids", mandateId] });
    },
  });
}

export function useAwardBid(mandateId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bidId: string) =>
      api(MandateEnvelopeSchema, `/mandates/${mandateId}/award`, { method: "POST", body: { bidId } }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["mandate", mandateId] });
      void queryClient.invalidateQueries({ queryKey: ["bids", mandateId] });
    },
  });
}

export function useAcceptAward(mandateId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api(MandateEnvelopeSchema, `/mandates/${mandateId}/accept`, { method: "POST" }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["mandate", mandateId] });
    },
  });
}
