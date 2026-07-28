import { useRef, useState } from "react";
import { Card, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { EmptyState } from "../ui/empty-state";
import { CopyButton } from "../ui/copy-button";
import { useAddArtifact, useArtifacts } from "../../api/workrooms";
import { useCommitSubmission } from "../../api/flow";
import { decryptBytes, encryptBytes, makeCommitment, sha256Hex } from "../../lib/crypto";
import { COMMIT_DOMAINS } from "../../lib/protocol";
import { getChain } from "../../midnight/chain";
import { useNetworkStore } from "../../store/network";
import { toast } from "../../store/toast";
import { formatDateTime } from "../../lib/format";
import type { ArtifactDto } from "../../api/schemas";

export function ArtifactPanel({
  mandateId,
  keyHex,
}: {
  mandateId: string;
  keyHex: string | null;
}) {
  const artifacts = useArtifacts(mandateId);
  const addArtifact = useAddArtifact(mandateId);
  const commitSubmission = useCommitSubmission(mandateId);
  const networkId = useNetworkStore((s) => s.networkId);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [committingId, setCommittingId] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    if (!keyHex) return;
    setUploading(true);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const digest = await sha256Hex(bytes);
      const { ciphertext, nonce } = await encryptBytes(keyHex, bytes);
      const priorVersions = (artifacts.data ?? []).filter((a) => a.name === file.name).length;
      await addArtifact.mutateAsync({
        name: file.name,
        digest,
        version: String(priorVersions + 1),
        ciphertext,
        nonce,
      });
      toast.success("Artifact sealed & uploaded", `SHA-256 ${digest.slice(0, 16)}…`);
    } catch (e) {
      toast.error("Upload failed", e instanceof Error ? e.message : undefined);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleDownload = async (artifact: ArtifactDto) => {
    if (!keyHex || !artifact.ciphertext || !artifact.nonce) return;
    try {
      const bytes = await decryptBytes(keyHex, {
        ciphertext: artifact.ciphertext,
        nonce: artifact.nonce,
      });
      const buffer = new ArrayBuffer(bytes.length);
      new Uint8Array(buffer).set(bytes);
      const url = URL.createObjectURL(new Blob([buffer]));
      const a = document.createElement("a");
      a.href = url;
      a.download = artifact.name;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Decryption failed", "The held key does not open this artifact.");
    }
  };

  const handleCommit = async (artifact: ArtifactDto) => {
    if (!artifact.digest) return;
    setCommittingId(artifact.id);
    try {
      const { commitment } = await makeCommitment(COMMIT_DOMAINS.submission, artifact.digest);
      await commitSubmission.mutateAsync({
        artifactId: artifact.id,
        submissionCommitment: commitment,
        digest: artifact.digest,
      });
      await getChain(networkId).commitSubmission({
        mandateId,
        submissionCommitment: commitment,
        artifactDigest: artifact.digest,
      });
      toast.success("Submission committed", "The digest is anchored publicly; the file stays sealed.");
    } catch (e) {
      toast.error("Submission failed", e instanceof Error ? e.message : undefined);
    } finally {
      setCommittingId(null);
    }
  };

  return (
    <Card>
      <CardHeader
        eyebrow="Evidence"
        title="Artifacts"
        aside={
          <>
            <input
              ref={fileRef}
              type="file"
              className="sr-only"
              aria-label="Choose a file to encrypt and upload"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleUpload(file);
              }}
            />
            <Button
              size="sm"
              variant="primary"
              loading={uploading}
              disabled={!keyHex}
              onClick={() => fileRef.current?.click()}
              title={keyHex ? undefined : "Import the workroom key first"}
            >
              {uploading ? "Sealing" : "Upload sealed"}
            </Button>
          </>
        }
      />

      {artifacts.isPending && (
        <div className="space-y-3" aria-label="Loading artifacts">
          <span className="sr-only">Loading artifacts</span>
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      )}

      {artifacts.isError && (
        <EmptyState
          title="Artifacts unavailable"
          description="The artifact ledger did not respond."
          action={
            <Button size="sm" variant="secondary" onClick={() => void artifacts.refetch()}>
              Retry
            </Button>
          }
        />
      )}

      {artifacts.isSuccess && artifacts.data.length === 0 && (
        <EmptyState
          title="No artifacts yet"
          description="Files are encrypted on this device before upload; the host stores ciphertext and a digest."
        />
      )}

      {artifacts.isSuccess && artifacts.data.length > 0 && (
        <ul className="divide-y divide-line">
          {artifacts.data.map((artifact) => (
            <li
              key={artifact.id}
              className="flex flex-wrap items-center justify-between gap-3 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-bone">
                  {artifact.name}
                  <span className="ml-2 font-mono text-[10px] text-dim">
                    v{artifact.version ?? "1"}
                  </span>
                </p>
                {artifact.digest && (
                  <div className="mt-1">
                    <CopyButton value={artifact.digest} label={`${artifact.name} digest`} />
                  </div>
                )}
                <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-dim">
                  {formatDateTime(artifact.createdAt)}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={!keyHex || !artifact.ciphertext}
                  onClick={() => void handleDownload(artifact)}
                >
                  Decrypt ↓
                </Button>
                <Button
                  size="sm"
                  variant="proof"
                  loading={committingId === artifact.id}
                  disabled={!artifact.digest || committingId !== null}
                  onClick={() => void handleCommit(artifact)}
                >
                  Commit as submission
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
