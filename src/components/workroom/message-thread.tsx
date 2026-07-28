import { useEffect, useState, type FormEvent } from "react";
import { Card, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Textarea } from "../ui/field";
import { Skeleton } from "../ui/skeleton";
import { EmptyState } from "../ui/empty-state";
import { useSendMessage, useWorkroomMessages } from "../../api/workrooms";
import { decryptJson, encryptJson } from "../../lib/crypto";
import { useSessionStore } from "../../store/session";
import { cx, formatDateTime } from "../../lib/format";
import { toast } from "../../store/toast";
import type { WorkroomMessageDto } from "../../api/schemas";

interface MessageBody {
  text: string;
}

/** Decrypt every message locally; failures render as sealed rows, honestly. */
function useDecryptedMessages(
  messages: WorkroomMessageDto[] | undefined,
  keyHex: string | null,
): Record<string, string | null> {
  const [texts, setTexts] = useState<Record<string, string | null>>({});

  useEffect(() => {
    if (!messages || !keyHex) return;
    let cancelled = false;
    void (async () => {
      const next: Record<string, string | null> = {};
      for (const m of messages) {
        try {
          const body = await decryptJson<MessageBody>(keyHex, {
            ciphertext: m.ciphertext,
            nonce: m.nonce,
          });
          next[m.id] = body.text ?? null;
        } catch {
          next[m.id] = null; // wrong key or corrupted — stays sealed
        }
      }
      if (!cancelled) setTexts(next);
    })();
    return () => {
      cancelled = true;
    };
  }, [messages, keyHex]);

  return texts;
}

export function MessageThread({
  mandateId,
  keyHex,
}: {
  mandateId: string;
  keyHex: string | null;
}) {
  const messages = useWorkroomMessages(mandateId);
  const send = useSendMessage(mandateId);
  const myKey = useSessionStore((s) => s.publicKey);
  const texts = useDecryptedMessages(messages.data, keyHex);
  const [draft, setDraft] = useState("");

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!keyHex || draft.trim().length === 0) return;
    try {
      const payload = await encryptJson(keyHex, { text: draft.trim() } satisfies MessageBody);
      await send.mutateAsync(payload);
      setDraft("");
    } catch (err) {
      toast.error("Message not sent", err instanceof Error ? err.message : undefined);
    }
  };

  return (
    <Card>
      <CardHeader eyebrow="Encrypted thread" title="Messages" />

      {messages.isPending && (
        <div className="space-y-3" aria-label="Loading messages">
          <span className="sr-only">Loading messages</span>
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="ml-auto h-12 w-2/3" />
          <Skeleton className="h-12 w-1/2" />
        </div>
      )}

      {messages.isError && (
        <EmptyState
          title="Thread unavailable"
          description="The workroom did not respond."
          action={
            <Button size="sm" variant="secondary" onClick={() => void messages.refetch()}>
              Retry
            </Button>
          }
        />
      )}

      {messages.isSuccess && messages.data.length === 0 && (
        <EmptyState
          title="No messages yet"
          description="Everything written here is encrypted with the workroom key before it leaves the device."
        />
      )}

      {messages.isSuccess && messages.data.length > 0 && (
        <ul className="max-h-96 space-y-3 overflow-y-auto pr-1">
          {messages.data.map((m) => {
            const own = !!myKey && m.senderPublicKey === myKey;
            const text = texts[m.id];
            return (
              <li key={m.id} className={cx("flex", own && "justify-end")}>
                <div
                  className={cx(
                    "max-w-[85%] rounded-[4px] border px-3.5 py-2.5",
                    own ? "border-vio/30 bg-vio/5" : "border-line bg-raise",
                  )}
                >
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-dim">
                    {own ? "You" : "Counterparty"} · {formatDateTime(m.createdAt)}
                  </p>
                  {text != null ? (
                    <p className="mt-1 text-sm whitespace-pre-wrap text-bone">{text}</p>
                  ) : keyHex ? (
                    <p className="mt-1 text-xs text-dim italic">
                      Sealed — not readable with the held key.
                    </p>
                  ) : (
                    <span className="redact mt-1.5 w-40" aria-label="Message sealed" />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <form onSubmit={(e) => void handleSend(e)} className="mt-5 border-t border-line pt-4">
        <label htmlFor="message-draft" className="sr-only">
          Write an encrypted message
        </label>
        <Textarea
          id="message-draft"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={2}
          disabled={!keyHex || send.isPending}
          placeholder={
            keyHex ? "Write a message — encrypted before sending" : "Import the workroom key to write"
          }
        />
        <div className="mt-2.5 flex items-center justify-between">
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-dim">
            AES-256-GCM · encrypted on this device
          </p>
          <Button
            type="submit"
            size="sm"
            variant="primary"
            loading={send.isPending}
            disabled={!keyHex || draft.trim().length === 0}
          >
            Send sealed
          </Button>
        </div>
      </form>
    </Card>
  );
}
