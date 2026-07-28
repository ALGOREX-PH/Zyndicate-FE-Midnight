import { useCallback, useState } from "react";
import { Link, useParams } from "react-router";
import { useMandate } from "../api/mandates";
import { StatePill } from "../components/ui/state-pill";
import { KeyGate } from "../components/workroom/key-gate";
import { MessageThread } from "../components/workroom/message-thread";
import { ArtifactPanel } from "../components/workroom/artifact-panel";
import { useUnsealedTitle } from "../components/exchange/mandate-card";
import { getMandateKey } from "../lib/crypto";
import { domainLabel } from "../lib/protocol";
import type { MandateDto } from "../api/schemas";

function WorkroomHeader({ mandate }: { mandate: MandateDto }) {
  const title = useUnsealedTitle(mandate);
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <p className="eyebrow">
          Workroom ·{" "}
          <Link to={`/mandates/${mandate.id}`} className="text-vio hover:underline">
            {domainLabel(mandate.publicDomain)} mandate
          </Link>
        </p>
        <StatePill state={mandate.state} />
      </div>
      {title ? (
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-bone">{title}</h1>
      ) : (
        <span className="redact mt-3 h-7 w-64 max-w-full" aria-label="Title sealed" />
      )}
    </div>
  );
}

export function WorkroomPage() {
  const { mandateId } = useParams<{ mandateId: string }>();
  const mandate = useMandate(mandateId);
  const [, forceRender] = useState(0);
  const onKeyChanged = useCallback(() => forceRender((n) => n + 1), []);

  if (!mandateId) return null;
  const keyHex = getMandateKey(mandateId);

  return (
    <div className="space-y-6">
      {mandate.isSuccess ? (
        <WorkroomHeader mandate={mandate.data} />
      ) : (
        <div>
          <p className="eyebrow">Workroom</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-bone">
            Encrypted workroom
          </h1>
        </div>
      )}

      <KeyGate mandateId={mandateId} keyHex={keyHex} onKeyChanged={onKeyChanged} />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <MessageThread mandateId={mandateId} keyHex={keyHex} />
        <ArtifactPanel mandateId={mandateId} keyHex={keyHex} />
      </div>
    </div>
  );
}
