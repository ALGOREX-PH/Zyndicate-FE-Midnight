import { useState } from "react";
import { z } from "zod";
import { Dialog } from "../ui/dialog";
import { Button } from "../ui/button";
import { Field, Input, Textarea } from "../ui/field";
import { PrivacyPreview } from "../ui/privacy-preview";
import { useSubmitBid } from "../../api/bids";
import {
  encryptJson,
  generateSymmetricKeyHex,
  makeCommitment,
  storeBidKey,
} from "../../lib/crypto";
import { COMMIT_DOMAINS, deriveBidNullifier } from "../../lib/protocol";
import { getChain } from "../../midnight/chain";
import { useNetworkStore } from "../../store/network";
import { toast } from "../../store/toast";

const bidSchema = z.object({
  price: z
    .string()
    .trim()
    .min(1, "Enter your price — it is sealed before it leaves this device.")
    .refine((v) => Number(v) > 0, "Price must be a number greater than zero."),
  deliveryDays: z
    .string()
    .trim()
    .min(1, "Estimate delivery in days.")
    .refine((v) => Number(v) > 0, "Delivery estimate must be a positive number of days."),
  approach: z
    .string()
    .trim()
    .min(20, "Outline your approach in at least 20 characters — only the principal can ever read it."),
});

type BidErrors = Partial<Record<"price" | "deliveryDays" | "approach", string>>;

/** Sealed-bid composer: encrypt → commit → nullify, all client-side. */
export function BidComposer({ mandateId }: { mandateId: string }) {
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState("");
  const [deliveryDays, setDeliveryDays] = useState("");
  const [approach, setApproach] = useState("");
  const [errors, setErrors] = useState<BidErrors>({});
  const [sealing, setSealing] = useState(false);

  const submitBid = useSubmitBid(mandateId);
  const networkId = useNetworkStore((s) => s.networkId);

  const handleSubmit = async () => {
    const parsed = bidSchema.safeParse({ price, deliveryDays, approach });
    if (!parsed.success) {
      const next: BidErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof BidErrors;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setSealing(true);
    try {
      const payload = {
        price: parsed.data.price,
        deliveryDays: parsed.data.deliveryDays,
        approach: parsed.data.approach,
      };
      const bidKey = await generateSymmetricKeyHex();
      const encryptedBid = await encryptJson(bidKey, payload);
      const { commitment: bidCommitment } = await makeCommitment(
        COMMIT_DOMAINS.bid,
        JSON.stringify(payload),
      );
      const bidNullifier = await deriveBidNullifier(mandateId);

      await submitBid.mutateAsync({ bidCommitment, bidNullifier, encryptedBid });
      storeBidKey(mandateId, bidKey);
      await getChain(networkId).submitBid({ mandateId, bidCommitment, bidNullifier });

      toast.success("Sealed bid registered", "Your price and approach never left this device unencrypted.");
      setOpen(false);
      setPrice("");
      setDeliveryDays("");
      setApproach("");
    } catch (e) {
      toast.error(
        "Bid not registered",
        e instanceof Error ? e.message : "Sealing or submission failed.",
      );
    } finally {
      setSealing(false);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Compose sealed bid
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Sealed bid" wide>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Price" htmlFor="bid-price" error={errors.price} hint="Sealed.">
              <Input
                id="bid-price"
                type="number"
                inputMode="decimal"
                min="0"
                value={price}
                invalid={!!errors.price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  setErrors((prev) => ({ ...prev, price: undefined }));
                }}
                placeholder="18000"
              />
            </Field>
            <Field
              label="Delivery estimate (days)"
              htmlFor="bid-days"
              error={errors.deliveryDays}
              hint="Sealed."
            >
              <Input
                id="bid-days"
                type="number"
                inputMode="numeric"
                min="1"
                value={deliveryDays}
                invalid={!!errors.deliveryDays}
                onChange={(e) => {
                  setDeliveryDays(e.target.value);
                  setErrors((prev) => ({ ...prev, deliveryDays: undefined }));
                }}
                placeholder="14"
              />
            </Field>
          </div>

          <Field
            label="Approach"
            htmlFor="bid-approach"
            error={errors.approach}
            hint="Sealed. Your method stays yours."
          >
            <Textarea
              id="bid-approach"
              value={approach}
              invalid={!!errors.approach}
              onChange={(e) => {
                setApproach(e.target.value);
                setErrors((prev) => ({ ...prev, approach: undefined }));
              }}
              placeholder="Static analysis pass, then targeted fuzzing of the settlement paths…"
              rows={4}
            />
          </Field>

          <PrivacyPreview
            local={["Your bid key — generated on this device", "The commitment salt"]}
            sealed={["Price, delivery estimate, and approach"]}
            access={["Only you can open this bid today; reveal happens per the covenant"]}
            publicFacts={[
              "A bid commitment exists for this mandate",
              "A one-time bid nullifier (prevents duplicate bids)",
            ]}
          />

          <div className="flex justify-end gap-3 border-t border-line pt-4">
            <Button variant="ghost" onClick={() => setOpen(false)} disabled={sealing}>
              Cancel
            </Button>
            <Button variant="primary" loading={sealing} onClick={() => void handleSubmit()}>
              {sealing ? "Sealing" : "Seal & register bid"}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
