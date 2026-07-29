import { useEffect, useState } from "react";
import type { BidDto, MandateDto } from "../../api/schemas";
import { Card, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/state-pill";
import { DefinitionList } from "../ui/definition-list";
import { BidComposer } from "./bid-composer";
import { useAcceptAward, useBids, useWithdrawBid } from "../../api/bids";
import { decryptJson, getBidKey } from "../../lib/crypto";
import { getChain } from "../../midnight/chain";
import { useNetworkStore } from "../../store/network";
import { useSessionStore } from "../../store/session";
import { toast } from "../../store/toast";

interface BidContents {
  price?: string;
  deliveryDays?: string;
  approach?: string;
}

/** Decrypt the operator's own sealed bid with the locally held bid key. */
function useOwnBidContents(mandateId: string, bid: BidDto | undefined): BidContents | null {
  const [contents, setContents] = useState<BidContents | null>(null);
  useEffect(() => {
    setContents(null);
    if (!bid?.encryptedBid) return;
    const key = getBidKey(mandateId);
    if (!key) return;
    let cancelled = false;
    void decryptJson<BidContents>(key, bid.encryptedBid)
      .then((data) => {
        if (!cancelled) setContents(data);
      })
      .catch(() => {
        /* key mismatch — leave sealed */
      });
    return () => {
      cancelled = true;
    };
  }, [mandateId, bid?.encryptedBid]);
  return contents;
}

/** Operator side: compose a sealed bid, track it, accept an award. */
export function OperatorPanel({ mandate }: { mandate: MandateDto }) {
  const bids = useBids(mandate.id);
  const withdraw = useWithdrawBid(mandate.id);
  const acceptAward = useAcceptAward(mandate.id);
  const networkId = useNetworkStore((s) => s.networkId);
  const myKey = useSessionStore((s) => s.publicKey);

  // GET /mandates/:id/bids returns only the caller's own rows to a
  // non-principal, but match on operatorKey so the principal's view is right
  // too. `mine` was never a backend field.
  const ownBid = myKey
    ? bids.data?.find((b) => b.operatorKey === myKey && b.status !== "withdrawn")
    : undefined;
  const contents = useOwnBidContents(mandate.id, ownBid);

  const wonAward =
    !!ownBid &&
    (mandate.state === "awarded" || mandate.state === "in_execution") &&
    (ownBid.status === "awarded" ||
      (mandate.awardedBidId != null && mandate.awardedBidId === ownBid.id));

  const handleAccept = () => {
    acceptAward.mutate(undefined, {
      onSuccess: () => {
        toast.success("Award accepted", "The workroom is now active. Execution begins.");
        void getChain(networkId).acceptAward({ mandateId: mandate.id });
      },
      onError: (e) =>
        toast.error("Acceptance failed", e instanceof Error ? e.message : undefined),
    });
  };

  return (
    <Card>
      <CardHeader
        eyebrow="Operator"
        title="Your sealed bid"
        aside={ownBid && <Badge tone="vio">Registered</Badge>}
      />

      {mandate.state === "open_for_bids" && !ownBid && (
        <div className="space-y-3">
          <p className="text-sm text-fog">
            Bidding is open. Your price and approach are encrypted on this device; the ledger
            receives only a commitment and a one-time nullifier.
          </p>
          <BidComposer mandateId={mandate.id} />
        </div>
      )}

      {!ownBid && mandate.state !== "open_for_bids" && (
        <p className="text-sm text-fog">
          {mandate.state === "draft"
            ? "Bidding has not opened yet. Watch this mandate — the window is announced publicly."
            : "You did not register a bid on this mandate."}
        </p>
      )}

      {ownBid && (
        <div className="space-y-4">
          {contents ? (
            <DefinitionList
              items={[
                { label: "Price (sealed)", value: contents.price ?? "—", mono: true },
                {
                  label: "Delivery (sealed)",
                  value: contents.deliveryDays ? `${contents.deliveryDays} days` : "—",
                },
                { label: "Approach (sealed)", value: contents.approach ?? "—" },
              ]}
            />
          ) : (
            <p className="text-sm text-fog">
              Bid registered. The bid key is not on this device, so the contents stay sealed
              here too.
            </p>
          )}

          {ownBid.bidCommitment && (
            <DefinitionList items={[{ label: "Commitment", copy: ownBid.bidCommitment }]} />
          )}

          {mandate.state === "open_for_bids" && (
            <Button
              size="sm"
              variant="danger"
              loading={withdraw.isPending}
              onClick={() =>
                withdraw.mutate(ownBid.id, {
                  onSuccess: () => toast.success("Bid withdrawn"),
                  onError: (e) =>
                    toast.error("Withdrawal failed", e instanceof Error ? e.message : undefined),
                })
              }
            >
              Withdraw bid
            </Button>
          )}

          {wonAward && mandate.state === "awarded" && (
            <div className="rounded-[4px] border border-phosphor/40 bg-phosphor/5 p-4">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-phosphor">
                You won this mandate
              </p>
              <p className="mt-1.5 text-sm text-fog">
                Accepting activates the vault and opens the encrypted workroom.
              </p>
              <Button
                variant="proof"
                className="mt-3"
                loading={acceptAward.isPending}
                onClick={handleAccept}
              >
                Accept award
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
