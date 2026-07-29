/** Workrooms: encrypted messages + encrypted artifacts. Ciphertext only. */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";
import {
  ArtifactEnvelopeSchema,
  ArtifactListSchema,
  WorkroomEnvelopeSchema,
  WorkroomMessageEnvelopeSchema,
  WorkroomMessageListSchema,
} from "./schemas";

export function useWorkroom(mandateId: string | undefined) {
  return useQuery({
    queryKey: ["workroom", mandateId],
    queryFn: () => api(WorkroomEnvelopeSchema, `/workrooms/${mandateId}`),
    enabled: !!mandateId,
  });
}

export function useWorkroomMessages(mandateId: string | undefined) {
  return useQuery({
    queryKey: ["workroom", mandateId, "messages"],
    queryFn: () => api(WorkroomMessageListSchema, `/workrooms/${mandateId}/messages`),
    enabled: !!mandateId,
    refetchInterval: 5_000,
  });
}

export function useSendMessage(mandateId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { ciphertext: string; nonce: string }) =>
      api(WorkroomMessageEnvelopeSchema, `/workrooms/${mandateId}/messages`, {
        method: "POST",
        body,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["workroom", mandateId, "messages"] });
    },
  });
}

export function useArtifacts(mandateId: string | undefined) {
  return useQuery({
    queryKey: ["workroom", mandateId, "artifacts"],
    queryFn: () => api(ArtifactListSchema, `/workrooms/${mandateId}/artifacts`),
    enabled: !!mandateId,
  });
}

export interface AddArtifactBody {
  name: string;
  digest: string;
  /** Integer counter — the backend rejects a string. */
  version: number;
  ciphertext: string;
  nonce: string;
}

export function useAddArtifact(mandateId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: AddArtifactBody) =>
      api(ArtifactEnvelopeSchema, `/workrooms/${mandateId}/artifacts`, { method: "POST", body }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["workroom", mandateId, "artifacts"] });
    },
  });
}
