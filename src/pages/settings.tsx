import { Card, CardHeader } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/state-pill";
import { DefinitionList } from "../components/ui/definition-list";
import { IdentityPanel } from "../components/settings/identity-panel";
import { NETWORKS, NETWORK_IDS, type AppNetworkId } from "../midnight/config";
import { useNetworkStore } from "../store/network";
import { useWalletStore } from "../store/wallet";
import { toast } from "../store/toast";
import { cx } from "../lib/format";

function NetworkPanel() {
  const networkId = useNetworkStore((s) => s.networkId);
  const setNetwork = useNetworkStore((s) => s.setNetwork);
  const disconnect = useWalletStore((s) => s.disconnect);
  const walletStatus = useWalletStore((s) => s.status);

  const handleSelect = (id: AppNetworkId) => {
    if (id === networkId) return;
    setNetwork(id);
    if (walletStatus === "connected") {
      disconnect();
      toast.info("Network changed", "Wallet disconnected — reconnect on the new network.");
    } else {
      toast.info(`Network set to ${NETWORKS[id].label}`);
    }
  };

  return (
    <Card>
      <CardHeader eyebrow="Midnight" title="Network" />
      <div role="radiogroup" aria-label="Midnight network" className="grid gap-3 sm:grid-cols-3">
        {NETWORK_IDS.map((id) => {
          const net = NETWORKS[id];
          const active = id === networkId;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => handleSelect(id)}
              className={cx(
                "rounded-[4px] border p-4 text-left transition-colors",
                active ? "border-vio/60 bg-vio/5" : "border-line hover:border-line-strong",
              )}
            >
              <span
                className={cx(
                  "font-mono text-[11px] font-bold uppercase tracking-[0.16em]",
                  active ? "text-vio" : "text-bone",
                )}
              >
                {net.label}
              </span>
              <span className="mt-1.5 block text-xs text-fog">{net.description}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-4 border-t border-line pt-4">
        <DefinitionList
          items={[
            { label: "Indexer", value: NETWORKS[networkId].indexer, mono: true },
            { label: "Node", value: NETWORKS[networkId].node, mono: true },
            { label: "Proof server", value: NETWORKS[networkId].proofServer, mono: true },
          ]}
        />
        <p className="mt-3 text-[11px] text-dim">
          The proof server always runs locally — proof generation consumes private witness data.
        </p>
      </div>
    </Card>
  );
}

function WalletPanel() {
  const { status, unshieldedAddress, dustBalance, nightBalance, error, connect, disconnect } =
    useWalletStore();
  const networkId = useNetworkStore((s) => s.networkId);

  return (
    <Card>
      <CardHeader
        eyebrow="Lace"
        title="Wallet"
        aside={
          <Badge tone={status === "connected" ? "phosphor" : "neutral"}>
            {status === "connected" ? "Connected" : status === "unavailable" ? "Not detected" : "Disconnected"}
          </Badge>
        }
      />

      {status === "connected" ? (
        <>
          <DefinitionList
            items={[
              ...(unshieldedAddress ? [{ label: "Address", copy: unshieldedAddress }] : []),
              { label: "DUST", value: dustBalance ?? "—", mono: true },
              { label: "Unshielded balance", value: nightBalance ?? "—", mono: true },
            ]}
          />
          <Button size="sm" variant="danger" className="mt-4" onClick={disconnect}>
            Disconnect
          </Button>
        </>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-fog">
            {status === "unavailable"
              ? "No Midnight wallet with a 4.x DApp connector was found in this browser."
              : "Connect Lace to sign and balance Midnight transactions. Zyndicate never sees your wallet keys."}
          </p>
          {error && <p className="text-xs text-danger">{error}</p>}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="primary"
              loading={status === "connecting"}
              onClick={() => void connect(networkId)}
            >
              {status === "connecting" ? "Awaiting approval" : "Connect Lace"}
            </Button>
            {status === "unavailable" && (
              <a
                href="https://www.lace.io"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-8 items-center rounded-[2px] border border-line-strong px-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-fog transition-colors hover:text-bone"
              >
                Get Lace ↗
              </a>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

export function SettingsPage() {
  return (
    <div>
      <p className="eyebrow">Configuration</p>
      <h1 className="mt-1.5 font-display text-3xl font-bold tracking-tight text-bone">
        Settings
      </h1>
      <p className="mt-1.5 max-w-lg text-sm text-fog">
        Network, wallet, identity, and the keys that make your privacy real.
      </p>

      <div className="mt-8 space-y-6">
        <NetworkPanel />
        <div className="grid gap-6 lg:grid-cols-2">
          <WalletPanel />
          <IdentityPanel />
        </div>
      </div>
    </div>
  );
}
