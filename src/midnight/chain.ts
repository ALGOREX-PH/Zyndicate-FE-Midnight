/**
 * ChainSync — the typed boundary between Zyndicate's UI flows and the
 * Midnight contract layer (PRD 16.5 circuit surface).
 *
 * STATUS: the Compact contract is not yet compiled into deployable artifacts,
 * so `LocalChainAdapter` mirrors every protocol transition locally: it
 * records a receipt (kind + commitments + timestamp) in localStorage and
 * derives a deterministic pseudo tx-hash. Wallet connection itself is REAL
 * (see connect-wallet.ts); once the compiled contract + Midnight.js providers
 * are integrated, a `MidnightChainAdapter` implementing this same interface
 * replaces the local one without touching any UI code.
 */
import { sha256Hex, randomHex } from "../lib/crypto";
import type { AppNetworkId } from "./config";

export interface ChainReceipt {
  txHash: string;
  kind: string;
  network: AppNetworkId;
  submittedAt: string;
  /** true while the LocalChainAdapter stands in for the deployed contract */
  local: boolean;
}

export interface ChainSync {
  deployMandate(args: {
    mandateId: string;
    mandateCommitment: string;
    covenantCommitment: string;
    publicDomain: string;
    bidDeadline: string;
    executionDeadline: string;
  }): Promise<ChainReceipt>;
  submitBid(args: {
    mandateId: string;
    bidCommitment: string;
    bidNullifier: string;
  }): Promise<ChainReceipt>;
  awardBid(args: { mandateId: string; winningBidCommitment: string }): Promise<ChainReceipt>;
  acceptAward(args: { mandateId: string }): Promise<ChainReceipt>;
  commitSubmission(args: {
    mandateId: string;
    submissionCommitment: string;
    artifactDigest: string;
  }): Promise<ChainReceipt>;
  recordEvaluation(args: {
    mandateId: string;
    evaluationCommitment: string;
    verdict: string;
  }): Promise<ChainReceipt>;
  settleMandate(args: {
    mandateId: string;
    settlementNullifier: string;
  }): Promise<ChainReceipt>;
  openDispute(args: { mandateId: string; disputeCommitment: string }): Promise<ChainReceipt>;
  resolveDispute(args: {
    disputeId: string;
    rulingCommitment: string;
    outcome: string;
  }): Promise<ChainReceipt>;
  /** Receipts recorded on this device, newest first. */
  listReceipts(): ChainReceipt[];
}

const RECEIPTS_KEY = "zyn.chain.receipts";

export class LocalChainAdapter implements ChainSync {
  constructor(private readonly network: AppNetworkId) {}

  private async record(kind: string, payload: unknown): Promise<ChainReceipt> {
    const submittedAt = new Date().toISOString();
    const txHash = await sha256Hex(
      `zyndicate:tx:${kind}:${JSON.stringify(payload)}:${submittedAt}:${randomHex(8)}`,
    );
    const receipt: ChainReceipt = {
      txHash,
      kind,
      network: this.network,
      submittedAt,
      local: true,
    };
    const receipts = this.listReceipts();
    receipts.unshift(receipt);
    localStorage.setItem(RECEIPTS_KEY, JSON.stringify(receipts.slice(0, 200)));
    return receipt;
  }

  listReceipts(): ChainReceipt[] {
    try {
      return JSON.parse(localStorage.getItem(RECEIPTS_KEY) ?? "[]") as ChainReceipt[];
    } catch {
      return [];
    }
  }

  deployMandate(args: Parameters<ChainSync["deployMandate"]>[0]) {
    return this.record("createMandate", args);
  }
  submitBid(args: Parameters<ChainSync["submitBid"]>[0]) {
    return this.record("submitBid", args);
  }
  awardBid(args: Parameters<ChainSync["awardBid"]>[0]) {
    return this.record("awardBid", args);
  }
  acceptAward(args: Parameters<ChainSync["acceptAward"]>[0]) {
    return this.record("acceptAward", args);
  }
  commitSubmission(args: Parameters<ChainSync["commitSubmission"]>[0]) {
    return this.record("commitSubmission", args);
  }
  recordEvaluation(args: Parameters<ChainSync["recordEvaluation"]>[0]) {
    return this.record("recordEvaluation", args);
  }
  settleMandate(args: Parameters<ChainSync["settleMandate"]>[0]) {
    return this.record("settleMandate", args);
  }
  openDispute(args: Parameters<ChainSync["openDispute"]>[0]) {
    return this.record("openDispute", args);
  }
  resolveDispute(args: Parameters<ChainSync["resolveDispute"]>[0]) {
    return this.record("resolveDispute", args);
  }
}

const adapters = new Map<AppNetworkId, ChainSync>();

/** The active chain adapter for a network (LocalChainAdapter for now). */
export function getChain(network: AppNetworkId): ChainSync {
  let adapter = adapters.get(network);
  if (!adapter) {
    adapter = new LocalChainAdapter(network);
    adapters.set(network, adapter);
  }
  return adapter;
}
