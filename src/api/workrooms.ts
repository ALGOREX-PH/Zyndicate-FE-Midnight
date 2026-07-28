/** Workrooms: encrypted messages + encrypted artifacts. Ciphertext only. */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";
import {
  ArtifactListSchema,
  ArtifactSchema,
  WorkroomMessageListSchema,
  WorkroomMessageSchema,
  WorkroomSchema,
} from "./schemas";

export function useWorkroom(mandateId: string | undefined) {
  return useQuery({
    queryKey: ["workroom", mandateId],
    queryFn: () => api(WorkroomSchema, `/workrooms/${mandateId}`),
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
      api(WorkroomMessageSchema, `/workrooms/${mandateId}/messages`, {
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
  version: string;
  ciphertext: string;
  nonce: string;
}

export function useAddArtifact(mandateId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: AddArtifactBody) =>
      api(ArtifactSchema, `/workrooms/${mandateId}/artifacts`, { method: "POST", body }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["workroom", mandateId, "artifacts"] });
    },
  });
}
