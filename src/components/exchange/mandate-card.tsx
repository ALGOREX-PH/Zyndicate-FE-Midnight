import { useEffect, useState } from "react";
import { Link } from "react-router";
import type { MandateDto } from "../../api/schemas";
import { StatePill } from "../ui/state-pill";
import { decryptJson, getMandateKey } from "../../lib/crypto";
import { getMandateMeta, storeMandateMeta } from "../../lib/mandate-meta";
import { complexityLabel, domainLabel, rewardBandLabel } from "../../lib/protocol";
import { formatDeadline } from "../../lib/format";

/**
 * Resolve the unsealed title if this device holds the mandate key.
 * Otherwise the card shows a redaction bar — the honest default.
 */
function useUnsealedTitle(mandate: MandateDto): string | null {
  const cached = getMandateMeta(mandate.id)?.title ?? null;
  const [title, setTitle] = useState<string | null>(cached);

  useEffect(() => {
    if (title) return;
    const key = getMandateKey(mandate.id);
    const pkg = mandate.encryptedPackage;
    if (!key || !pkg) return;
    let cancelled = false;
    void decryptJson<{ title?: string }>(key, pkg)
      .then((data) => {
        if (!cancelled && data.title) {
          storeMandateMeta(mandate.id, { title: data.title });
          setTitle(data.title);
        }
      })
      .catch(() => {
        /* wrong key — stay sealed */
      });
    return () => {
      cancelled = true;
    };
  }, [mandate.id, mandate.encryptedPackage, title]);

  return title;
}

export function MandateCard({ mandate }: { mandate: MandateDto }) {
  const title = useUnsealedTitle(mandate);

  return (
    <Link
      to={`/mandates/${mandate.id}`}
      className="group flex flex-col rounded-[4px] border border-line bg-panel p-5 transition-colors hover:border-line-strong"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-fog">
          {domainLabel(mandate.publicDomain)}
        </span>
        <StatePill state={mandate.state} />
      </div>

      <div className="mt-4 min-h-11">
        {title ? (
          <h3 className="line-clamp-2 font-display text-base font-semibold text-bone">
            {title}
          </h3>
        ) : (
          <div aria-label="Title sealed">
            <span className="redact w-4/5" />
            <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-dim">
              Sealed — key not held
            </p>
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-line pt-3.5 font-mono text-[10px] tracking-[0.06em] text-fog">
        <span title="Complexity band">{complexityLabel(mandate.complexityBand)}</span>
        <span aria-hidden="true" className="text-dim">
          ·
        </span>
        <span title="Reward band">{rewardBandLabel(mandate.rewardBand)}</span>
        <span aria-hidden="true" className="text-dim">
          ·
        </span>
        <span title="Bid deadline">bids {formatDeadline(mandate.bidDeadline)}</span>
        {typeof mandate.bidCount === "number" && (
          <>
            <span aria-hidden="true" className="text-dim">
              ·
            </span>
            <span>
              {mandate.bidCount} sealed bid{mandate.bidCount === 1 ? "" : "s"}
            </span>
          </>
        )}
      </div>
    </Link>
  );
}
