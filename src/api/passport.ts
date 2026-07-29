/** Passport: coarse public reputation, proof receipts, capability credentials. */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";
import { CredentialEnvelopeSchema, PassportEnvelopeSchema, ReceiptListSchema } from "./schemas";

export function usePassport(publicKey: string | null | undefined) {
  return useQuery({
    queryKey: ["passport", publicKey],
    queryFn: () => api(PassportEnvelopeSchema, `/passports/${publicKey}`),
    enabled: !!publicKey,
    retry: false,
  });
}

export function useMyReceipts(enabled = true) {
  return useQuery({
    queryKey: ["receipts"],
    queryFn: () => api(ReceiptListSchema, "/me/receipts"),
    enabled,
  });
}

export interface AddCredentialBody {
  domain: string;
  kind: string;
  commitment: string;
}

export function useAddCredential() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: AddCredentialBody) =>
      api(CredentialEnvelopeSchema, "/passports/credentials", { method: "POST", body }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["passport"] });
    },
  });
}
