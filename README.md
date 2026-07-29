# Zyndicate

**The sealed market for trusted digital work.**

Private by default. Verifiable by design.

Zyndicate is a confidential work-coordination exchange. A **Principal** commissions a sensitive
outcome; qualified **Operators** compete for it through **sealed bids**; a **Covenant** governs
execution; and the ledger proves the agreement was followed without ever seeing what the agreement
said.

This repository is the **frontend dApp** — a Vite + React + TypeScript single-page application that
performs all of its cryptography in the browser, talks to the Zyndicate backend over a typed REST
client, and connects to the Midnight Network through the Lace wallet's DApp connector.

The problem it addresses: genuinely sensitive work — unreleased code, private datasets,
pre-disclosure research, regulated material — is difficult to outsource, because the act of
describing the work usually leaks it. Conventional marketplaces solve trust by making everything
visible to the platform operator. Zyndicate solves it by making the commercially meaningful facts
*provable* while the commercially sensitive facts stay sealed on the participants' own devices.

## Vocabulary

The product language is deliberately distinct from conventional freelance platforms, and each term
maps to a concrete object in the code (PRD §5.4).

| Conventional term | Zyndicate term       | Where it lives                                |
| ----------------- | -------------------- | --------------------------------------------- |
| Marketplace       | **Exchange**         | `/exchange` — public mandate summaries only    |
| Job listing       | **Mandate**          | `src/api/mandates.ts`, `/mandates/:id`         |
| Customer          | **Principal**        | `components/mandate/principal-panel.tsx`       |
| Freelancer        | **Operator**         | `components/mandate/operator-panel.tsx`        |
| Proposal          | **Sealed bid**       | `components/mandate/bid-composer.tsx`          |
| Requirements      | **Covenant**         | `components/compose/step-covenant.tsx`         |
| Project room      | **Workroom**         | `/workrooms/:mandateId`                        |
| Deliverable       | **Submission**       | `components/workroom/artifact-panel.tsx`       |
| Completion record | **Proof receipt**    | `/passport`, `src/midnight/chain.ts`           |
| Profile           | **Passport**         | `/passport`                                    |
| Escrow            | **Vault**            | `/vault`, `components/mandate/vault-card.tsx`  |
| Dispute file      | **Evidence capsule** | `/tribunal`                                    |
| Category          | **Domain**           | `src/lib/protocol.ts`                          |

---

## Client-side privacy architecture

This is the part that matters. **Encryption happens in the browser, before anything reaches the
API.** The server is a ciphertext-and-commitment store; it never receives plaintext and never
receives a key. If you run the backend and read its database directly, you find hex blobs and
hashes — nothing else.

The primitives live in [`src/lib/crypto.ts`](src/lib/crypto.ts) (WebCrypto) and
[`src/lib/identity.ts`](src/lib/identity.ts) (`@noble/ed25519`).

### 1. AES-256-GCM sealing in the browser

Every sensitive payload is encrypted client-side with `crypto.subtle`, using a 256-bit AES-GCM key
and a fresh random 12-byte IV per operation. What crosses the wire is
`{ ciphertext: hex, nonce: hex }` and nothing more.

| Payload | Key | Sealed in |
| ------- | --- | --------- |
| Mandate package (title, required outcome, sensitive context) | per-mandate key from `generateSymmetricKeyHex()` | `src/pages/compose.tsx` |
| Sealed bid (price, method, operator notes) | per-bid key, one per mandate | `components/mandate/bid-composer.tsx` |
| Workroom messages | the mandate key | `components/workroom/message-thread.tsx` |
| Workroom artifacts (raw file bytes) | the mandate key | `components/workroom/artifact-panel.tsx` |

Keys are generated with `crypto.subtle.generateKey`, exported to hex, and held in `localStorage`
under `zyn.keys.mandate` / `zyn.keys.bid`. They are **never** included in any request body. A
counterparty receives a workroom key out of band and pastes it into the key gate
(`components/workroom/key-gate.tsx`); until they do, the workroom stays ciphertext and says so
explicitly rather than failing silently.

### 2. SHA-256 commitments with per-item random salts

A commitment lets the ledger record *that* something was agreed without recording *what*:

```
commitment = SHA-256( domainSeparator || payload || salt )
```

The salt is **32 fresh random bytes per commitment** — never reused, per PRD §13.4 — and is retained
locally (`zyn.salts`, keyed by commitment) so the opening can be produced later during an authorized
disclosure or dispute. Domain separators are versioned and namespaced in `COMMIT_DOMAINS`
(`src/lib/protocol.ts`): `zyndicate:commit:mandate:v1`, `…:covenant:v1`, `…:bid:v1`,
`…:submission:v1`, `…:evaluation:v1`, `…:dispute:v1`, `…:ruling:v1`, `…:credential:v1` — so a
commitment made in one context can never be replayed as another.

Artifacts additionally carry a plain `SHA-256` digest of the raw bytes, computed before encryption,
which is what a submission commitment binds to.

### 3. Nullifiers — spend-once rights without identity

A nullifier proves a private right was consumed without revealing which secret produced it. Both are
derived locally from the identity secret, and only the hash ever leaves the device:

```ts
bidNullifier        = SHA-256(`zyndicate:bid-nullifier:${mandateId}:${secret}`)
settlementNullifier = SHA-256(`zyndicate:settlement-nullifier:${mandateId}:${secret}`)
```

Because they are deterministic per `(secret, mandate)`, a duplicate bid or a second settlement
attempt produces the *same* nullifier and collides. "One bid per operator" and "each vault releases
exactly once" are therefore enforced by arithmetic rather than by trusting the host.

### 4. A Zyndicate identity deliberately separate from the wallet identity

Per PRD §11.1, wallet identity, Zyndicate identity, and mandate-specific identity are allowed to
differ. `src/lib/identity.ts` maintains an **ed25519 keypair that is not the wallet key**. It is
generated on first use, stored at `zyn.identity.secret`, and used to:

* **sign backend auth challenges** — ed25519 over the UTF-8 string `zyndicate:auth:<nonce>`,
  exchanged for a Bearer token in `src/api/auth.ts`. The wallet is never involved in API auth.
* **derive the nullifiers** above.

Stated plainly: connecting Lace does not deanonymize your Exchange activity, and the backend
authenticates a public key rather than a person. The secret never leaves the device unless the user
explicitly exports it from Settings → Identity.

### 5. What this costs the user

Client-side encryption means **the keys are the account**. There is no host-side recovery, so key
portability is a first-class feature rather than an afterthought: `exportKeyring()` /
`importKeyring()` serialize mandate keys, bid keys, and salts as JSON, and the identity secret can be
exported and re-imported separately (`components/settings/identity-panel.tsx`). Clearing browser
storage without an export is unrecoverable, and the UI says so instead of hiding it.

### 6. Privacy previews

PRD §6.4 requires that users can see where information goes *before* they commit to it.
`components/ui/privacy-preview.tsx` renders, for each major action, what stays local, what is
encrypted, who gains access, and what becomes permanently public. The mandate composer shows this
before sealing, and the landing page walks through the same ledger-vs-sealed split across all six
lifecycle stages.

### Visibility classes (PRD §13.1)

| Class | Meaning | Example in this app |
| ----- | ------- | ------------------- |
| **A — Public** | Permanent, visible to all | mandate id, domain, complexity band, deadlines, state, commitments, nullifiers |
| **B — Counterparty confidential** | Principal + awarded operator only | workroom messages, artifacts, full assignment |
| **C — Role confidential** | Selected roles | evaluator rubric, compliance evidence |
| **D — Locally private** | Never leaves the device | identity secret, AES keys, commitment salts |
| **E — Selectively disclosable** | Sealed, openable to an authorized party | original bid, evaluation notes, evidence capsule |
| **F — Ephemeral** | Temporary, meant to be discarded | decrypted working files, session token |

The Exchange renders only Class A data. Everything richer requires a key the server does not have.

---

## Midnight integration status

Being precise about this matters more than sounding finished. There are two halves, and they are at
different stages.

### Real: wallet connection

[`src/midnight/connect-wallet.ts`](src/midnight/connect-wallet.ts) is a genuine **DApp connector v4**
integration against `@midnight-ntwrk/dapp-connector-api`.

* Wallets inject under `window.midnight.{uuid}` with a freshly generated UUID. The code **discovers**
  the provider by iterating that object and semver-matching `apiVersion` against `4.x` — it does not
  hardcode `window.midnight.mnLace`, which is the legacy API.
* Extensions inject asynchronously, so discovery polls every 100 ms for up to 1 s before giving up.
* `connect(networkId)` opens Lace's approval UI and rejects if the user declines or is on the wrong
  network; `getConnectionStatus()` is then called immediately so an unusable session fails loudly at
  connect time rather than at first use.
* Connection state lives in `src/store/wallet.ts` and surfaces in `components/shell/wallet-button.tsx`
  and the Settings page, which distinguishes "no 4.x connector detected" from "detected but not
  connected".

Note that `@midnight-ntwrk/dapp-connector-api` is consumed as **types only** — the connector is an
interface contract fulfilled at runtime by the injected extension, which is why no Midnight vendor
chunk appears in the build output.

### Standing in: the contract layer

[`src/midnight/chain.ts`](src/midnight/chain.ts) defines `ChainSync`, a typed interface covering the
full PRD §16.5 circuit surface — `deployMandate`, `submitBid`, `awardBid`, `acceptAward`,
`commitSubmission`, `recordEvaluation`, `settleMandate`, `openDispute`, `resolveDispute`.

The only implementation today is **`LocalChainAdapter`**, and it is documented as a stand-in. It
mirrors each protocol transition locally: it records a receipt (kind, network, timestamp) in
`localStorage` under `zyn.chain.receipts` and derives a deterministic pseudo transaction hash. Every
receipt it produces carries **`local: true`**, and the UI renders that flag rather than passing local
receipts off as settled chain state.

**No transaction is submitted to a Midnight node today, and no zk proof is generated.** That is
waiting on:

1. the compiled Compact artifacts from the companion **Zyndicate-Smart-Contract-Midnight** repository,
2. a running node + indexer + proof-server stack (endpoints for `undeployed` / `preview` / `preprod`
   are already configured in [`src/midnight/config.ts`](src/midnight/config.ts)), and
3. Midnight.js providers wired to `deployContract` / `findDeployedContract`.

When those land, a `MidnightChainAdapter` implementing the same `ChainSync` interface replaces the
local one inside `getChain()` — **no UI code changes**. That is the entire reason the boundary exists.

The proof server is always configured as `localhost:6300`, including for the public testnets, because
proof generation consumes private witness data and must never leave the operator's machine.

---

## Routes

Routing is `react-router` v7 in `BrowserRouter` mode, declared in [`src/App.tsx`](src/App.tsx). The
landing page renders standalone; every other route renders inside `AppShell` (sidebar, topbar,
network badge, identity chip, wallet button, toaster). The whole tree is wrapped in an
`ErrorBoundary`.

| Route | Page | Purpose |
| ----- | ---- | ------- |
| `/` | `pages/landing.tsx` | Brand entry — hero, six-stage lifecycle with a ledger-vs-sealed split per stage, closing call to action |
| `/exchange` | `pages/exchange.tsx` | Discovery. Public mandate summaries only, with domain/state/mine filters and pagination |
| `/mandates/new` | `pages/compose.tsx` | Four-step mandate composer: outcome & context → eligibility & covenant → budget & deadlines → review & seal |
| `/mandates/:id` | `pages/mandate-detail.tsx` | Mandate record, state timeline, role-aware principal/operator panels, bid composer, vault card, flow panel |
| `/workrooms` | `pages/workrooms-index.tsx` | Every awarded mandate with an encrypted room |
| `/workrooms/:mandateId` | `pages/workroom.tsx` | The encrypted room — key gate, message thread, artifact panel |
| `/passport` | `pages/passport.tsx` | Identity, coarse public reputation, proof receipts, capability credentials |
| `/vault` | `pages/vault.tsx` | Escrow across mandates; each vault releases exactly once |
| `/tribunal` | `pages/tribunal.tsx` | Frozen settlements awaiting a ruling, scoped to what each disclosure covenant authorizes |
| `/settings` | `pages/settings.tsx` | Network selection, Lace connection, identity and keyring management |
| `*` | `pages/not-found.tsx` | 404 |

## Design system

The visual direction is **"classified terminal"** — intelligent, controlled, selective, technically
formidable, slightly mysterious; neither anarchic nor sterile (PRD §5.1). Deep blue-violet near-black
surfaces, bone text, hairline borders, near-square 2px radii, and a faint SVG grain overlay so large
dark surfaces do not read as flat plastic.

Tailwind v4 is configured **CSS-first** via `@theme` in [`src/styles/index.css`](src/styles/index.css)
— there is no `tailwind.config.js`.

| Token | Value | Use |
| ----- | ----- | --- |
| `ink` / `panel` / `raise` | `#07070e` / `#0c0c16` / `#12121f` | Surface elevation |
| `line` / `line-strong` | `#1f1f33` / `#30304e` | Hairline borders |
| `bone` / `fog` / `dim` | `#ecebf3` / `#a3a0b8` / `#6b6883` | Text hierarchy |
| `phosphor` | `#49f0a8` | **Reserved** for proof / verified / settled states only |
| `vio` | `#8d7bf5` | Interactive accent — focus, links, active states |
| `amber` / `danger` | `#e0b35c` / `#ef6f6c` | Warning / error |

`phosphor` being reserved is a deliberate constraint: green means *verified*, never merely
*decorative*, so a proof receipt cannot be visually confused with a styling choice.

**Typography** — three self-hosted families, bundled through `@fontsource` so the app makes no
third-party font requests at runtime:

* **Bricolage Grotesque Variable** (`--font-display`) — headings
* **Schibsted Grotesk Variable** (`--font-sans`) — body
* **Spline Sans Mono** (`--font-mono`) — hashes, commitments, keys, labels, eyebrows

Monospace is used semantically: anything cryptographic or machine-generated is rendered in mono, so a
commitment is visually distinguishable from prose at a glance.
