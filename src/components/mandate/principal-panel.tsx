import { useState } from "react";
import type { BidDto, MandateDto } from "../../api/schemas";
import { Card, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/state-pill";
import { Skeleton } from "../ui/skeleton";
import { EmptyState } from "../ui/empty-state";
import { CopyButton } from "../ui/copy-button";
import { useBids, useAwardBid } from "../../api/bids";
import { useMandateStateAction, type MandateStateAction } from "../../api/mandates";
import { getChain } from "../../midnight/chain";
import { useNetworkStore } from "../../store/network";
import { toast } from "../../store/toast";
import { formatDateTime } from "../../lib/format";

function BidRow({
  bid,
  canAward,
  onAward,
  awarding,
}: {
  bid: BidDto;
  canAward: boolean;
  onAward: (bid: BidDto) => void;
  awarding: boolean;
}) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-3 border-t border-line py-3 first:border-t-0">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-fog">
            Sealed bid
          </span>
          {bid.mine && <Badge tone="vio">Yours</Badge>}
          {bid.state === "awarded" && <Badge tone="phosphor">Awarded</Badge>}
        </div>
        {bid.bidCommitment && (
          <div className="mt-1">
            <CopyButton value={bid.bidCommitment} label="bid commitment" />
          </div>
        )}
        <p className="mt-1 font-mono text-[10px] text-dim">
          registered {formatDateTime(bid.createdAt)}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className="redact w-20" aria-label="Bid value sealed" />
        {canAward && (
          <Button size="sm" variant="proof" loading={awarding} onClick={() => onAward(bid)}>
            Award
          </Button>
        )}
      </div>
    </li>
  );
}

/** Principal controls: state transitions + the sealed bid ledger + award. */
export function PrincipalPanel({ mandate }: { mandate: MandateDto }) {
  const bids = useBids(mandate.id);
  const stateAction = useMandateStateAction(mandate.id);
  const awardBid = useAwardBid(mandate.id);
  const networkId = useNetworkStore((s) => s.networkId);
  const [awardingId, setAwardingId] = useState<string | null>(null);

  const runAction = (action: MandateStateAction, label: string) => {
    stateAction.mutate(action, {
      onSuccess: () => toast.success(label),
      onError: (e) => toast.error(`${label} failed`, e instanceof Error ? e.message : undefined),
    });
  };

  const handleAward = (bid: BidDto) => {
    setAwardingId(bid.id);
    awardBid.mutate(bid.id, {
      onSuccess: () => {
        toast.success("Mandate awarded", "The winning operator is being notified privately.");
        if (bid.bidCommitment) {
          void getChain(networkId).awardBid({
            mandateId: mandate.id,
            winningBidCommitment: bid.bidCommitment,
          });
        }
      },
      onError: (e) =>
        toast.error("Award failed", e instanceof Error ? e.message : undefined),
      onSettled: () => setAwardingId(null),
    });
  };

  const canAward = mandate.state === "bidding_closed";

  return (
    <Card>
      <CardHeader
        eyebrow="Principal"
        title="Bidding & award"
        aside={
          <div className="flex flex-wrap justify-end gap-2">
            {mandate.state === "draft" && (
              <Button
                size="sm"
                variant="primary"
                loading={stateAction.isPending}
                onClick={() => runAction("open_bidding", "Bidding opened")}
              >
                Open bidding
              </Button>
            )}
            {mandate.state === "open_for_bids" && (
              <Button
                size="sm"
                variant="secondary"
                loading={stateAction.isPending}
                onClick={() => runAction("close_bidding", "Bidding closed")}
              >
                Close bidding
              </Button>
            )}
            {["draft", "open_for_bids", "bidding_closed"].includes(mandate.state) && (
              <Button
                size="sm"
                variant="danger"
                disabled={stateAction.isPending}
                onClick={() => runAction("cancel", "Mandate cancelled")}
              >
                Cancel
              </Button>
            )}
          </div>
        }
      />

      {bids.isPending && (
        <div className="space-y-3" aria-label="Loading bids">
          <span className="sr-only">Loading bids</span>
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      )}

      {bids.isError && (
        <EmptyState
          title="Bids unavailable"
          description="The sealed bid ledger did not respond."
          action={
            <Button size="sm" variant="secondary" onClick={() => void bids.refetch()}>
              Retry
            </Button>
          }
        />
      )}

      {bids.isSuccess && bids.data.length === 0 && (
        <EmptyState
          title="No sealed bids yet"
          description={
            mandate.state === "open_for_bids"
              ? "Eligible operators can register sealed bids until the deadline."
              : "Open bidding to start receiving sealed bids."
          }
        />
      )}

      {bids.isSuccess && bids.data.length > 0 && (
        <>
          <p className="mb-2 text-xs text-dim">
            {bids.data.length} sealed bid{bids.data.length === 1 ? "" : "s"} — values stay
            sealed{canAward ? "; award under your declared selection rule." : "."}
          </p>
          <ul>
            {bids.data.map((bid) => (
              <BidRow
                key={bid.id}
                bid={bid}
                canAward={canAward}
                onAward={handleAward}
                awarding={awardingId === bid.id && awardBid.isPending}
              />
            ))}
          </ul>
        </>
      )}
    </Card>
  );
}
