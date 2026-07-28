/**
 * Midnight network endpoints per environment. The proof server always runs
 * locally (proof generation consumes private witness data), even when
 * pointing at public networks.
 */

/** Networks Zyndicate targets today. Mainnet arrives with the audited contract. */
export type AppNetworkId = "undeployed" | "preview" | "preprod";

export interface NetworkConfig {
  id: AppNetworkId;
  label: string;
  description: string;
  indexer: string;
  indexerWS: string;
  node: string;
  proofServer: string;
}

export const NETWORKS: Record<AppNetworkId, NetworkConfig> = {
  undeployed: {
    id: "undeployed",
    label: "Undeployed",
    description: "Local docker stack (node + indexer + proof server).",
    indexer: "http://127.0.0.1:8088/api/v4/graphql",
    indexerWS: "ws://127.0.0.1:8088/api/v4/graphql/ws",
    node: "http://127.0.0.1:9944",
    proofServer: "http://127.0.0.1:6300",
  },
  preview: {
    id: "preview",
    label: "Preview",
    description: "Public testnet for fast iteration.",
    indexer: "https://indexer.preview.midnight.network/api/v4/graphql",
    indexerWS: "wss://indexer.preview.midnight.network/api/v4/graphql/ws",
    node: "https://rpc.preview.midnight.network",
    proofServer: "http://localhost:6300",
  },
  preprod: {
    id: "preprod",
    label: "Preprod",
    description: "Public testnet mirroring production conditions.",
    indexer: "https://indexer.preprod.midnight.network/api/v4/graphql",
    indexerWS: "wss://indexer.preprod.midnight.network/api/v4/graphql/ws",
    node: "https://rpc.preprod.midnight.network",
    proofServer: "http://localhost:6300",
  },
};

export const NETWORK_IDS = Object.keys(NETWORKS) as AppNetworkId[];

export function isAppNetworkId(value: string): value is AppNetworkId {
  return value in NETWORKS;
}
