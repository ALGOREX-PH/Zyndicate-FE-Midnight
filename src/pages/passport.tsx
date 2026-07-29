import { useState, type FormEvent } from "react";
import { Card, CardHeader } from "../components/ui/card";
import { Badge } from "../components/ui/state-pill";
import { Button } from "../components/ui/button";
import { Field, Input, Select } from "../components/ui/field";
import { DefinitionList } from "../components/ui/definition-list";
import { Skeleton } from "../components/ui/skeleton";
import { EmptyState } from "../components/ui/empty-state";
import { CopyButton } from "../components/ui/copy-button";
import { useMyReceipts, usePassport, useAddCredential } from "../api/passport";
import { useUpdateDisplayName } from "../api/auth";
import { useSessionStore } from "../store/session";
import { useWalletStore } from "../store/wallet";
import { makeCommitment } from "../lib/crypto";
import { COMMIT_DOMAINS, DOMAINS, domainLabel } from "../lib/protocol";
import { formatDate, humanize } from "../lib/format";
import { toast } from "../store/toast";

function IdentityCard() {
  const publicKey = useSessionStore((s) => s.publicKey);
  const displayName = useSessionStore((s) => s.displayName);
  const status = useSessionStore((s) => s.status);
  const walletAddress = useWalletStore((s) => s.unshieldedAddress);
  const updateName = useUpdateDisplayName();
  const [name, setName] = useState(displayName ?? "");

  const handleRename = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim().length === 0) return;
    updateName.mutate(name.trim(), {
      onSuccess: () => toast.success("Display name updated"),
      onError: (err) =>
        toast.error("Rename failed", err instanceof Error ? err.message : undefined),
    });
  };

  return (
    <Card>
      <CardHeader
        eyebrow="Identity"
        title="Who you are here"
        aside={
          <Badge tone={status === "authenticated" ? "phosphor" : "neutral"}>
            {status === "authenticated" ? "Session active" : humanize(status)}
          </Badge>
        }
      />
      <DefinitionList
        items={[
          ...(publicKey ? [{ label: "Zyndicate key", copy: publicKey }] : []),
          {
            label: "Wallet",
            ...(walletAddress
              ? { copy: walletAddress }
              : { value: "Not connected", mono: false }),
          },
        ]}
      />
      <p className="mt-3 border-t border-line pt-3 text-[11px] text-dim">
        Wallet identity and Zyndicate identity are deliberately separate. Mandate-specific
        pseudonyms differ from both.
      </p>
      <form onSubmit={handleRename} className="mt-4 flex flex-wrap items-end gap-3">
        <Field label="Display name" htmlFor="passport-name" className="min-w-48 flex-1">
          <Input
            id="passport-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Aliased operator handle"
            maxLength={40}
          />
        </Field>
        <Button
          type="submit"
          size="sm"
          variant="secondary"
          loading={updateName.isPending}
          disabled={name.trim().length === 0}
        >
          Save name
        </Button>
      </form>
    </Card>
  );
}

function ReputationCard() {
  const publicKey = useSessionStore((s) => s.publicKey);
  const passport = usePassport(publicKey);

  return (
    <Card>
      <CardHeader eyebrow="Public reputation" title="Coarse on purpose" />
      {passport.isPending && (
        <div className="space-y-2" aria-label="Loading reputation">
          <span className="sr-only">Loading reputation</span>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      )}
      {passport.isError && (
        <p className="text-sm text-dim">
          No public reputation yet. Complete mandates to earn proof receipts — detailed claims
          stay private and provable.
        </p>
      )}
      {passport.isSuccess && (
        <DefinitionList
          items={[
            {
              label: "Identity class",
              value: passport.data.identityClass ?? "Unverified",
            },
            {
              label: "Completion band",
              value: passport.data.completionBand ?? "None yet",
            },
            {
              label: "Qualified domains",
              value:
                passport.data.domains && passport.data.domains.length > 0
                  ? passport.data.domains.map(domainLabel).join(", ")
                  : "None yet",
            },
          ]}
        />
      )}
    </Card>
  );
}

function ReceiptsCard() {
  const token = useSessionStore((s) => s.token);
  const receipts = useMyReceipts(!!token);

  return (
    <Card>
      <CardHeader eyebrow="Proof receipts" title="What you can prove" />
      {receipts.isPending && (
        <div className="space-y-2" aria-label="Loading receipts">
          <span className="sr-only">Loading receipts</span>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      )}
      {receipts.isError && (
        <p className="text-sm text-dim">Receipts are unavailable right now.</p>
      )}
      {receipts.isSuccess && receipts.data.length === 0 && (
        <EmptyState
          title="No receipts yet"
          description="Each settled mandate issues a portable, provable completion receipt."
        />
      )}
      {receipts.isSuccess && receipts.data.length > 0 && (
        <ul className="divide-y divide-line">
          {receipts.data.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <p className="text-sm font-medium text-bone">{humanize(r.kind)} receipt</p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-dim">
                  {formatDate(r.issuedAt)}
                </p>
              </div>
              <CopyButton value={r.receiptCommitment} label="receipt commitment" />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function CredentialsCard() {
  const publicKey = useSessionStore((s) => s.publicKey);
  const passport = usePassport(publicKey);
  const addCredential = useAddCredential();
  const [domain, setDomain] = useState("security");
  const [kind, setKind] = useState("");
  const [error, setError] = useState<string | undefined>();

  // The passport exposes no credential list — a credential's only public trace
  // is the domain it qualifies. That is what the server is willing to say.
  const domains = passport.data?.domains ?? [];

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (kind.trim().length < 3) {
      setError("Name the credential kind (3+ characters).");
      return;
    }
    try {
      const { commitment } = await makeCommitment(
        COMMIT_DOMAINS.credential,
        JSON.stringify({ domain, kind: kind.trim() }),
      );
      await addCredential.mutateAsync({ domain, kind: kind.trim(), commitment });
      toast.success("Credential registered", "Only its commitment is public.");
      setKind("");
    } catch (err) {
      toast.error("Credential not registered", err instanceof Error ? err.message : undefined);
    }
  };

  return (
    <Card>
      <CardHeader eyebrow="Capability credentials" title="Prove, don't publish" />
      {domains.length > 0 ? (
        <ul className="mb-4 divide-y divide-line">
          {domains.map((d) => (
            <li key={d} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <p className="text-sm font-medium text-bone">{domainLabel(d)}</p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-dim">
                  Qualified — credential held, contents never published
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-4 text-sm text-dim">
          No credentials registered. Register one to pass gated discovery and eligibility checks.
        </p>
      )}
      <form
        onSubmit={(e) => void handleAdd(e)}
        className="flex flex-wrap items-end gap-3 border-t border-line pt-4"
      >
        <Field label="Domain" htmlFor="cred-domain" className="w-44">
          <Select id="cred-domain" value={domain} onChange={(e) => setDomain(e.target.value)}>
            {DOMAINS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field
          label="Credential kind"
          htmlFor="cred-kind"
          error={error}
          className="min-w-48 flex-1"
        >
          <Input
            id="cred-kind"
            value={kind}
            invalid={!!error}
            onChange={(e) => {
              setKind(e.target.value);
              setError(undefined);
            }}
            placeholder="smart_contract_security"
          />
        </Field>
        <Button type="submit" size="sm" variant="primary" loading={addCredential.isPending}>
          Register
        </Button>
      </form>
    </Card>
  );
}

export function PassportPage() {
  return (
    <div>
      <p className="eyebrow">Passport</p>
      <h1 className="mt-1.5 font-display text-3xl font-bold tracking-tight text-bone">
        Your passport
      </h1>
      <p className="mt-1.5 max-w-lg text-sm text-fog">
        Identity, coarse public reputation, proof receipts, and capability credentials — the
        detailed history stays yours.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <IdentityCard />
        <ReputationCard />
        <ReceiptsCard />
        <CredentialsCard />
      </div>
    </div>
  );
}
