import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Field, Input } from "../ui/field";
import { CopyButton } from "../ui/copy-button";
import { storeMandateKey } from "../../lib/crypto";
import { toast } from "../../store/toast";

/**
 * The workroom is end-to-end encrypted with a per-mandate key that travels
 * out-of-band. This gate either confirms the key is held, or accepts one.
 */
export function KeyGate({
  mandateId,
  keyHex,
  onKeyChanged,
}: {
  mandateId: string;
  keyHex: string | null;
  onKeyChanged: () => void;
}) {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | undefined>();

  if (keyHex) {
    return (
      <Card className="border-phosphor/30">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-phosphor">
              <span aria-hidden="true">✓</span> Workroom key held
            </p>
            <p className="mt-1 text-xs text-fog">
              Messages and artifacts decrypt on this device. Share the key with your counterparty
              through a channel you already trust — it never touches the API.
            </p>
          </div>
          <CopyButton value={keyHex} label="workroom key" showValue={false} />
        </div>
      </Card>
    );
  }

  const handleImport = () => {
    const clean = input.trim().toLowerCase().replace(/^0x/, "");
    if (!/^[0-9a-f]{64}$/.test(clean)) {
      setError("A workroom key is 64 hexadecimal characters (32 bytes).");
      return;
    }
    storeMandateKey(mandateId, clean);
    toast.success("Workroom key imported", "Sealed content will now decrypt on this device.");
    setInput("");
    onKeyChanged();
  };

  return (
    <Card className="border-amber/30">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-amber">
        <span aria-hidden="true">⚿</span> Workroom sealed
      </p>
      <p className="mt-1 text-xs text-fog">
        This device does not hold the mandate key, so messages and artifacts stay ciphertext.
        Paste the key your counterparty shared with you off-ledger.
      </p>
      <div className="mt-3 flex flex-wrap items-end gap-3">
        <Field label="Workroom key" htmlFor="key-import" error={error} className="min-w-64 flex-1">
          <Input
            id="key-import"
            value={input}
            invalid={!!error}
            onChange={(e) => {
              setInput(e.target.value);
              setError(undefined);
            }}
            placeholder="64 hex characters"
            autoComplete="off"
            spellCheck={false}
          />
        </Field>
        <Button variant="primary" onClick={handleImport}>
          Import key
        </Button>
      </div>
    </Card>
  );
}
