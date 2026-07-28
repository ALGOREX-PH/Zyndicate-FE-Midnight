import { useState } from "react";
import { Card, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { Field, Textarea } from "../ui/field";
import { CopyButton } from "../ui/copy-button";
import { DefinitionList } from "../ui/definition-list";
import {
  exportIdentity,
  getOrCreateIdentity,
  importIdentity,
  resetIdentity,
} from "../../lib/identity";
import { exportKeyring, importKeyring } from "../../lib/crypto";
import { useSessionStore } from "../../store/session";
import { login } from "../../api/auth";
import { toast } from "../../store/toast";

export function IdentityPanel() {
  const publicKey = useSessionStore((s) => s.publicKey);
  const [exportOpen, setExportOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [secretInput, setSecretInput] = useState("");
  const [importError, setImportError] = useState<string | undefined>();
  const [keyringOpen, setKeyringOpen] = useState(false);
  const [keyringInput, setKeyringInput] = useState("");
  const [keyringError, setKeyringError] = useState<string | undefined>();

  const refreshSession = async (message: string) => {
    const identity = getOrCreateIdentity();
    useSessionStore.getState().clearSession();
    useSessionStore.getState().setPublicKey(identity.publicHex);
    toast.success(message);
    try {
      await login();
    } catch {
      /* API offline — identity still switched locally */
    }
  };

  const handleImportIdentity = async () => {
    try {
      importIdentity(secretInput);
      setImportOpen(false);
      setSecretInput("");
      await refreshSession("Identity imported");
    } catch (e) {
      setImportError(e instanceof Error ? e.message : "Invalid secret.");
    }
  };

  const handleReset = async () => {
    if (
      !window.confirm(
        "Reset your Zyndicate identity? Without a backup of the current secret, its reputation and receipts become unreachable.",
      )
    ) {
      return;
    }
    resetIdentity();
    await refreshSession("Identity reset — a fresh keypair was generated");
  };

  const handleImportKeyring = () => {
    try {
      importKeyring(keyringInput);
      setKeyringOpen(false);
      setKeyringInput("");
      toast.success("Keyring imported", "Mandate and bid keys merged into this device.");
    } catch {
      setKeyringError("That is not a valid keyring export.");
    }
  };

  return (
    <Card>
      <CardHeader eyebrow="Identity & keys" title="Zyndicate identity" />
      {publicKey && (
        <DefinitionList items={[{ label: "Public key", copy: publicKey }]} />
      )}
      <p className="mt-3 text-[11px] text-dim">
        The secret signs API auth challenges and derives nullifiers. It exists only in this
        browser's storage until you export it.
      </p>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
        <Button size="sm" variant="secondary" onClick={() => setExportOpen(true)}>
          Export secret
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setImportOpen(true)}>
          Import secret
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setKeyringOpen(true)}>
          Import keyring
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            void navigator.clipboard
              .writeText(exportKeyring())
              .then(() => toast.success("Keyring copied", "Mandate keys, bid keys, and salts."))
              .catch(() => toast.error("Copy failed"));
          }}
        >
          Export keyring
        </Button>
        <Button size="sm" variant="danger" onClick={() => void handleReset()}>
          Reset identity
        </Button>
      </div>

      <Dialog open={exportOpen} onClose={() => setExportOpen(false)} title="Export identity secret">
        <div className="space-y-4">
          <p className="text-sm text-danger">
            Anyone holding this secret can act as you. Store it offline; never paste it into
            anything you do not control.
          </p>
          <div className="rounded-[2px] border border-line bg-ink p-3">
            <CopyButton value={exportIdentity()} label="identity secret" />
          </div>
          <div className="flex justify-end">
            <Button variant="ghost" onClick={() => setExportOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog open={importOpen} onClose={() => setImportOpen(false)} title="Import identity secret">
        <div className="space-y-4">
          <p className="text-sm text-fog">
            Replaces the identity on this device. The current secret is discarded — export it
            first if it matters.
          </p>
          <Field label="Secret (64 hex chars)" htmlFor="identity-import" error={importError}>
            <Textarea
              id="identity-import"
              value={secretInput}
              invalid={!!importError}
              onChange={(e) => {
                setSecretInput(e.target.value);
                setImportError(undefined);
              }}
              rows={2}
              spellCheck={false}
            />
          </Field>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setImportOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => void handleImportIdentity()}>
              Replace identity
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog open={keyringOpen} onClose={() => setKeyringOpen(false)} title="Import keyring">
        <div className="space-y-4">
          <p className="text-sm text-fog">
            Paste a keyring export (mandate keys, bid keys, commitment salts). Entries merge with
            what this device already holds.
          </p>
          <Field label="Keyring JSON" htmlFor="keyring-import" error={keyringError}>
            <Textarea
              id="keyring-import"
              value={keyringInput}
              invalid={!!keyringError}
              onChange={(e) => {
                setKeyringInput(e.target.value);
                setKeyringError(undefined);
              }}
              rows={5}
              spellCheck={false}
            />
          </Field>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setKeyringOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleImportKeyring}>
              Merge keyring
            </Button>
          </div>
        </div>
      </Dialog>
    </Card>
  );
}
