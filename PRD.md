# ZYNDICATE

## Big-Picture Product Requirements Document

**Working category:** Confidential Coordination Network
**Product type:** Privacy-preserving marketplace and settlement protocol for autonomous digital work
**Core network:** Midnight
**Status:** Vision and product-definition draft
**Founder:** Danielle Bagaforo Meer
**Version:** 0.1
**Date:** July 29, 2026

---

# 1. Executive Summary

## 1.1 One-sentence definition

**Zyndicate is a confidential coordination network where organizations can commission sensitive digital work, qualified autonomous agents can compete to perform it, and all parties can verify that the agreement was followed without exposing the task, identities, bids, data, strategies, or results publicly.**

## 1.2 Core promise

> **Private by default. Verifiable by design.**

Zyndicate allows a client to create a private mandate, define hidden requirements, receive sealed proposals from qualified providers, select a winner fairly, exchange sensitive data inside an encrypted workroom, verify that agreed conditions were satisfied, and release payment through programmable settlement.

The public network records only the minimum information necessary to establish trust:

* A valid mandate exists.
* An eligible provider was selected.
* The provider accepted the terms.
* Required milestones were submitted.
* Evaluation followed the agreed rules.
* Settlement occurred exactly once.
* Disputes followed an authorized process.

Everything commercially sensitive remains confidential unless a participant deliberately discloses it.

## 1.3 Vision

**Create the default confidential market for machine-executed work.**

In the future, billions of autonomous agents may negotiate, purchase data, perform analysis, write software, manage operations, and contract with other agents. However, serious economic activity cannot operate through systems where every instruction, strategy, price, counterparty, dataset, and result is permanently exposed.

Zyndicate gives autonomous work an environment in which confidentiality and accountability can coexist.

## 1.4 Mission

Zyndicate exists to make sensitive digital work safely procurable.

It enables clients and providers to coordinate without requiring either side to surrender unnecessary information, while preserving enough verifiability to establish trust, enforce agreements, resolve disputes, and build durable economic reputations.

## 1.5 Category thesis

Zyndicate is not merely:

* A freelance marketplace
* An AI-agent directory
* A private chat application
* A compute marketplace
* A blockchain escrow service
* A generic task manager
* A model-hosting platform
* A decentralized autonomous organization

Zyndicate defines a broader category:

# **Confidential Work Coordination**

This category combines:

1. **Private procurement**
2. **Selective identity**
3. **Capability verification**
4. **Sealed negotiation**
5. **Policy-bound execution**
6. **Confidential collaboration**
7. **Proof-based evaluation**
8. **Programmable settlement**
9. **Private, portable reputation**
10. **Controlled auditability**

The product should eventually support agents, human experts, companies, decentralized teams, and hybrid human-machine workforces. Autonomous AI providers are the initial wedge because they make the need for programmable coordination especially urgent.

---

# 2. Product Thesis

## 2.1 The fundamental contradiction

Economic coordination requires information.

Confidentiality requires limiting information.

Traditional marketplaces resolve this contradiction badly. They force participants either to expose excessive information or to trust a centralized intermediary with everything.

Zyndicate introduces a third model:

> Participants reveal proofs about themselves and their work rather than revealing all of the underlying information.

A provider does not need to publish its complete work history. It can prove that it has completed at least 50 relevant mandates.

A client does not need to disclose its maximum budget. It can prove that sufficient funds are reserved.

A bidder does not need to expose its proprietary method. It can prove that it possesses an accepted capability credential.

An evaluator does not need to publish a confidential deliverable. It can attest that defined acceptance conditions were met.

## 2.2 Strategic hypothesis

Zyndicate will become valuable if it can make the following statement true:

> A party can trust the validity of a work transaction while knowing only the information it is authorized to know.

This transforms privacy from a hiding mechanism into a coordination mechanism.

## 2.3 The new economic primitive

The core unit of Zyndicate is not a job listing.

It is a **sealed mandate**.

A sealed mandate is a programmable agreement describing:

* What outcome is required
* Who is eligible to attempt it
* What constraints govern execution
* How proposals will be evaluated
* What milestones must be reached
* How completion will be judged
* What information may be disclosed
* How payment will be released
* What happens during a dispute

The complete mandate may remain encrypted, while commitments and proofs make its enforcement publicly verifiable.

---

# 3. Why Zyndicate Should Exist

## 3.1 Sensitive work is difficult to outsource

Organizations routinely possess work they cannot safely publish:

* Security vulnerability investigations
* Proprietary financial analysis
* Private code reviews
* Legal document processing
* Internal fraud detection
* Medical data analysis
* Strategic market research
* Merger and acquisition diligence
* Customer behavior analysis
* Confidential model evaluation
* Private intellectual-property searches
* Unreleased product testing
* Competitive intelligence
* Political-risk assessment
* Internal compliance investigations

Existing marketplaces are structurally unsuitable for much of this work.

The client may need to disclose the assignment before knowing whether the provider is trustworthy. The provider may need to expose proprietary methods before knowing whether the client is serious. Both sides often surrender sensitive records to a centralized platform.

## 3.2 Autonomous agents intensify the problem

Agents can operate faster, continuously, and across organizational boundaries. They can also accidentally or deliberately leak:

* Prompts
* Credentials
* API keys
* Customer data
* Internal documents
* Trading logic
* Model outputs
* Negotiation strategies
* Payment relationships
* Behavioral history

Agent economies built entirely on transparent ledgers would create permanent intelligence feeds for competitors.

A public observer could potentially infer:

* Which company commissioned a task
* What kind of problem it is facing
* How urgent that problem is
* How much it is willing to pay
* Which providers it trusts
* Which provider won
* Whether the result succeeded
* How frequently the company purchases similar work

Privacy is therefore not an optional cosmetic feature. It is a prerequisite for serious autonomous commerce.

## 3.3 Centralized confidentiality is incomplete

A centralized marketplace can promise confidentiality, but it still becomes:

* A trusted custodian of sensitive records
* A high-value breach target
* A unilateral dispute authority
* A potential censor
* A source of platform lock-in
* An owner of the participants’ reputation data
* A party capable of changing marketplace rules

Zyndicate should not pretend that decentralization magically removes trust. That sort of marketing belongs in 2021 pitch decks and abandoned Discord servers.

Instead, Zyndicate reduces and distributes trust:

* Sensitive data remains with authorized participants.
* Commitments prevent agreements from being altered silently.
* Proofs establish that specific rules were followed.
* Escrow reduces settlement risk.
* Dispute processes are declared in advance.
* Reputation becomes portable.
* Auditors receive only authorized evidence.

---

# 4. Why Midnight

Midnight is a privacy-first blockchain designed around public verifiability, zero-knowledge proofs, private data handling, and selective disclosure. Its development model separates public ledger state, zero-knowledge circuit execution, and local off-chain computation.

Midnight mainnet became live in March 2026, giving Zyndicate a production network rather than forcing the product to remain a permanent testnet science project.

## 4.1 Why the architecture matches Zyndicate

Zyndicate requires several forms of privacy simultaneously:

* Hidden task contents
* Hidden budgets
* Hidden proposals
* Unlinkable provider participation
* Selective credential disclosure
* Confidential settlement
* Verifiable workflow transitions
* Controlled dispute access

Midnight supports commitments, private local state, zero-knowledge circuits, DApp-specific identities, nullifiers, Merkle membership proofs, shielded assets, and deliberate disclosure boundaries.

## 4.2 Product-level advantage

Most systems treat privacy as a separate cryptographic layer that developers must bolt onto a transparent application.

Zyndicate can instead model privacy directly in the product:

* Every field has a visibility policy.
* Every participant receives a defined disclosure scope.
* Every public transition reveals only its required output.
* Every audit path specifies exactly what may be opened.
* Every reputation claim can be represented as a proof rather than a public dossier.

That architecture is central to the product, not merely a technical implementation choice.

---

# 5. Product Identity

## 5.1 Name

# **Zyndicate**

The name combines the ideas of:

* A coordinated network
* A selective association
* Independent specialists
* Confidential operations
* Economic cooperation
* A powerful organization operating through shared rules

The brand should feel:

* Intelligent
* Controlled
* Selective
* Technically formidable
* Slightly mysterious
* Enterprise-capable
* Agent-native
* Neither anarchic nor sterile

## 5.2 Core tagline

> **The sealed market for trusted digital work.**

## 5.3 Supporting taglines

* Private by default. Verifiable by design.
* Commission outcomes without exposing operations.
* Confidential work. Provable execution.
* Trust the agreement without seeing the secrets.
* Where autonomous work becomes commercially safe.
* The private coordination layer for machine labor.
* Sensitive mandates. Qualified agents. Verifiable results.
* Work can be confidential without becoming unaccountable.

## 5.4 Brand vocabulary

Zyndicate should use product language that feels distinct from conventional freelance platforms.

| Conventional term | Zyndicate term   |
| ----------------- | ---------------- |
| Job listing       | Mandate          |
| Customer          | Principal        |
| Freelancer        | Operator         |
| AI provider       | Agent            |
| Proposal          | Sealed bid       |
| Requirements      | Covenant         |
| Project room      | Workroom         |
| Deliverable       | Submission       |
| Completion record | Proof receipt    |
| Profile           | Passport         |
| Review            | Attestation      |
| Dispute file      | Evidence capsule |
| Marketplace       | Exchange         |
| Escrow            | Vault            |
| Team              | Cell             |
| Category          | Domain           |

These terms are not merely decoration. They should map to concrete product objects and protocol behavior.

---

# 6. Product Principles

## 6.1 Confidentiality must be explicit

Every piece of information must have a declared visibility class.

The system must never use vague labels such as “private” when it actually means “stored in a company database where employees can read it.”

## 6.2 Prove claims, not biographies

Participants should prove only what is needed for a transaction.

For example:

* Reputation is above a threshold.
* The provider has a required certification.
* The client has reserved sufficient funds.
* The evaluator belongs to an approved institution.
* A submission was received before the deadline.

## 6.3 Minimize permanent disclosure

Publishing data on a ledger is irreversible.

Zyndicate should store commitments, state identifiers, nullifiers, roots, timestamps, and minimal settlement information. Raw sensitive documents should remain encrypted off-chain.

## 6.4 Privacy must be understandable

Users cannot protect information if they do not understand where it goes.

Every major action should include a **privacy preview** showing:

* What remains local
* What is encrypted
* Who receives access
* What becomes public
* What may later be disclosed
* Whether a disclosure is permanent

## 6.5 Verification must have a purpose

Zyndicate should not generate proofs merely because the technology permits it.

Each proof must answer a commercially meaningful question:

* Was the bidder eligible?
* Was the bid within the permitted range?
* Was the milestone submitted on time?
* Was the evaluator authorized?
* Was payment released according to the covenant?

## 6.6 Reputation must not become surveillance

Reputation should help parties evaluate risk without creating a permanent public map of every participant’s commercial activity.

## 6.7 The protocol should support progressive decentralization

Early versions may require hosted infrastructure, curated operators, and designated evaluators.

The long-term architecture should allow these functions to become open, competitive, or governed by transparent rules.

## 6.8 Good privacy includes recovery and accountability

A system that protects secrets but makes disputes impossible is not commercially useful.

Zyndicate must support:

* Authorized evidence disclosure
* Recovery mechanisms
* Appeal procedures
* Clear settlement states
* Fraud handling
* Optional institutional audit access

---

# 7. Target Users

## 7.1 Primary principal: Confidential innovation team

A startup or enterprise team needs external work completed but cannot disclose the full assignment publicly.

### Needs

* Protect unreleased product information
* Verify provider capability
* Compare proposals privately
* Reserve a fixed budget
* Maintain a defensible audit trail
* Receive a usable result
* Avoid exposing strategic activity

### Example mandate

> Audit an unreleased smart contract suite for critical vulnerabilities without publicly associating the audit with our organization.

## 7.2 Primary provider: Specialized AI operator

An autonomous or semi-autonomous service can perform valuable work but does not want to reveal its entire architecture, pricing strategy, or client history.

### Needs

* Discover compatible mandates
* Prove capability selectively
* Submit confidential pricing
* Protect proprietary execution methods
* Receive reliable payment
* Build portable reputation
* Avoid public activity correlation

## 7.3 Secondary principal: Regulated institution

A financial, legal, healthcare, or public-sector organization requires external computation under strict information policies.

### Needs

* Restrict provider eligibility
* Enforce data-use conditions
* Maintain evidence for auditors
* Separate public proof from confidential records
* Define retention and deletion requirements
* Permit selective regulator access

## 7.4 Secondary provider: Human-machine cell

A team combines human judgment with multiple autonomous agents.

### Needs

* Represent a shared capability
* Divide work privately
* Protect member identities
* Submit one collective proposal
* Allocate payment internally
* Build cell-level reputation

## 7.5 Evaluator

An independent individual, institution, model, or committee determines whether a submission satisfies an agreed rubric.

### Needs

* Receive only necessary evidence
* Prove authorization
* Evaluate privately
* Sign an attestation
* Avoid exposure to unrelated mandate data
* Receive compensation

## 7.6 Auditor or authorized observer

A regulator, internal compliance officer, arbitrator, or designated third party receives controlled access to evidence.

### Needs

* Verify covenant compliance
* Inspect a narrow subset of records
* Confirm that evidence has not been altered
* Produce an auditable decision
* Avoid receiving excessive personal or commercial information

---

# 8. Jobs to Be Done

## 8.1 Principal jobs

When I have sensitive digital work, help me:

1. Find qualified providers without publishing the assignment.
2. Confirm that bidders satisfy my requirements.
3. Compare proposals without exposing my budget.
4. Protect my data during execution.
5. Know that the agreed process was followed.
6. Release payment only when acceptance conditions are met.
7. Resolve disputes without exposing everything publicly.
8. Preserve an audit trail without creating a public intelligence leak.

## 8.2 Provider jobs

When I offer specialized digital work, help me:

1. Discover mandates compatible with my capabilities.
2. Prove eligibility without publishing my complete history.
3. Protect my pricing and methods from competitors.
4. Know that the principal has reserved funds.
5. Access only the information required for execution.
6. Demonstrate completion without exposing proprietary internals.
7. Receive payment according to predefined rules.
8. Build reputation without sacrificing commercial privacy.

## 8.3 Evaluator jobs

When I evaluate confidential work, help me:

1. Confirm that I am authorized.
2. Receive the correct rubric and submission.
3. Record an assessment privately.
4. Attest to an outcome publicly.
5. Disclose evidence only during an approved dispute.

---

# 9. The Zyndicate System

Zyndicate consists of several connected product layers.

## 9.1 Zyndicate Exchange

The discovery and procurement interface.

Principals create mandates. Operators discover eligible opportunities. Participants submit sealed bids and negotiate terms.

## 9.2 Zyndicate Protocol

The Midnight-based contract system that governs:

* Mandate commitments
* Eligibility verification
* Bid registration
* Selection
* Milestones
* Evaluation
* Settlement
* Nullifiers
* Disputes
* Reputation attestations

## 9.3 Zyndicate Workrooms

Encrypted collaboration environments created for awarded mandates.

A workroom contains:

* Mandate documents
* Data packages
* Messages
* Execution logs
* Milestone submissions
* Evaluation feedback
* Access policies
* Disclosure permissions

## 9.4 Zyndicate Passport

A privacy-preserving identity and reputation system.

A passport may hold:

* Capability credentials
* Domain experience
* Completion history
* Reliability bands
* Dispute rates
* Evaluation quality
* Institutional attestations
* Geographic or jurisdictional eligibility
* Software and model certifications

## 9.5 Zyndicate Vault

The escrow and programmable settlement layer.

A vault records:

* Reserved amount commitment
* Asset type
* Release conditions
* Milestone allocations
* Refund conditions
* Timeout logic
* Evaluator fees
* Dispute reserves
* Settlement nullifiers

## 9.6 Zyndicate Receipts

Portable cryptographic evidence that a participant completed or participated in a valid transaction.

Receipts may prove:

* A mandate was completed.
* A provider satisfied a capability policy.
* A milestone was accepted.
* A principal paid according to the agreement.
* An evaluator acted within its authority.
* A provider completed work in a specific domain.

## 9.7 Zyndicate Tribunal

The dispute-resolution layer.

The Tribunal is not necessarily one court or centralized team. It is a framework for selecting:

* A designated evaluator
* A panel
* An institution
* A domain-specific arbitrator
* A cryptographic condition
* A hybrid automated-human process

---

# 10. Core Product Objects

## 10.1 Mandate

A procurement request created by a principal.

### Fields

* Mandate ID
* Public category
* Private title
* Private description
* Principal commitment
* Eligibility covenant
* Evaluation covenant
* Budget commitment
* Deadline
* Bid window
* Settlement model
* Disclosure policy
* Dispute policy
* Encrypted resource references
* Public state
* Private metadata

## 10.2 Covenant

A machine-readable policy defining how the mandate operates.

### Covenant sections

1. **Eligibility covenant**
2. **Proposal covenant**
3. **Execution covenant**
4. **Evaluation covenant**
5. **Settlement covenant**
6. **Disclosure covenant**
7. **Dispute covenant**
8. **Retention covenant**

A covenant should be immutable after bidding begins unless all affected parties explicitly approve a new committed version.

## 10.3 Sealed bid

A confidential proposal submitted by an operator.

### Fields

* Bid commitment
* Provider pseudonym
* Price
* Completion estimate
* Capability proofs
* Execution approach
* Requested data access
* Milestone plan
* Bid expiration
* Bid nullifier
* Optional negotiation channel

## 10.4 Award

The principal’s selection of a provider.

An award establishes:

* The winning bid
* The accepted covenant
* The workroom participants
* The vault conditions
* The execution deadline
* The evaluator
* The dispute authority

## 10.5 Submission

A deliverable or milestone output.

### Fields

* Submission commitment
* Encrypted artifact reference
* Artifact digest
* Submission timestamp
* Execution receipt
* Provider attestation
* Evaluation state
* Revision state

## 10.6 Attestation

A signed or proven claim from an authorized actor.

Examples:

* Capability attestation
* Completion attestation
* Evaluation attestation
* Data-deletion attestation
* Payment attestation
* Compliance attestation

## 10.7 Evidence capsule

An encrypted collection of evidence created for possible dispute resolution.

The capsule may contain:

* Original mandate
* Accepted bid
* Messages
* File hashes
* Submitted artifacts
* Evaluation notes
* Execution logs
* Access history
* Relevant credentials

The capsule is accessible only according to the disclosure covenant.

---

# 11. End-to-End User Journey

## 11.1 Stage 1: Principal onboarding

The principal:

1. Connects a compatible wallet.
2. Creates a Zyndicate identity or pseudonymous principal profile.
3. Selects an optional verification level.
4. Configures recovery and disclosure authorities.
5. Creates its first confidential mandate.

The interface must explain that wallet identity, Zyndicate identity, and mandate-specific identity may differ.

## 11.2 Stage 2: Mandate creation

The principal enters:

* Desired outcome
* Sensitive context
* Required skills
* Minimum reputation
* Budget
* Submission deadline
* Evaluation rules
* Permitted execution environments
* Data-use restrictions
* Disclosure permissions
* Dispute method

Zyndicate generates:

* A human-readable covenant
* A machine-readable covenant
* A public mandate summary
* A private mandate package
* A commitment
* An encrypted evidence capsule
* A privacy preview

## 11.3 Stage 3: Discovery

Operators do not necessarily see every mandate.

The discovery engine matches mandates using safe metadata such as:

* Domain
* Broad capability
* Estimated complexity band
* Deadline range
* Jurisdiction requirements
* Provider class
* Public reward band, when permitted

A mandate may use one of several discovery modes:

### Open discovery

Any eligible operator may attempt to prove eligibility.

### Gated discovery

Only operators with qualifying credentials receive the encrypted summary.

### Invitation-only

The principal selects specific operators or cells.

### Brokered discovery

A matching service proves that compatible providers exist without learning the full mandate.

### Blind discovery

Operators receive only enough information to decide whether to submit an initial eligibility proof.

## 11.4 Stage 4: Eligibility

An operator proves required claims.

Example:

```text
reputation_band >= 4
completed_security_mandates >= 10
critical_dispute_rate < 5%
credential_domain == smart_contract_security
jurisdiction ∈ permitted_jurisdictions
sanctioned == false
```

The principal receives proof that the conditions passed.

It does not automatically receive:

* Exact reputation score
* Complete work history
* Legal identity
* Other clients
* Total earnings
* Unrelated credentials

## 11.5 Stage 5: Sealed bidding

Eligible operators submit bids.

Each bid is committed before the bid window closes.

Depending on the mandate, selection may use:

* Principal choice
* Lowest valid bid
* Highest capability score
* Weighted scoring
* Second-price auction
* Multi-round negotiation
* Committee decision
* Random selection among equally qualified providers

Midnight’s official private-reserve auction example already demonstrates hidden reserve commitments and DApp-specific public keys, although Zyndicate would require substantially more private bidding logic than the tutorial contract.

## 11.6 Stage 6: Award and workroom creation

When a bid is selected:

1. The award commitment is published.
2. The winning operator is privately notified.
3. The operator accepts or declines.
4. The vault becomes active.
5. Workroom encryption keys are established.
6. Required data is released according to policy.
7. Execution begins.

Losing bidders should be able to verify that:

* Their bids were registered.
* The selection process followed the declared rule.
* The winning bid was valid.

They should not automatically learn the winner’s identity or terms.

## 11.7 Stage 7: Execution

Work occurs off-chain.

Zyndicate does not attempt to place arbitrary AI inference, document processing, or software execution directly inside a smart contract.

Instead, the protocol verifies commercially meaningful properties surrounding execution:

* Correct provider authorization
* Approved model or tool class
* Deadline compliance
* Required artifact digest
* Milestone sequence
* Evaluator authorization
* Resource-limit compliance
* Data-retention attestation

## 11.8 Stage 8: Submission

The provider submits:

* Encrypted deliverable
* Deliverable digest
* Completion timestamp
* Required execution receipts
* Optional reproducibility package
* Requested milestone payment

A commitment anchors the submission to the mandate.

## 11.9 Stage 9: Evaluation

Evaluation can be:

* Principal-led
* Third-party
* Committee-based
* Automated
* Hybrid
* Optimistic, where acceptance occurs unless challenged

The evaluator receives only the evidence required by the covenant.

## 11.10 Stage 10: Settlement

Settlement may:

* Release full payment
* Release a milestone
* Issue a partial payment
* Return unused funds
* Route fees to evaluators
* Reserve a dispute amount
* Split funds across a cell
* Trigger a revision period

Midnight uses DUST as a shielded, non-transferable resource for transaction fees. DUST should not be treated as Zyndicate’s payment currency. NIGHT and custom assets may exist in shielded or unshielded form, so Zyndicate should eventually support multiple settlement assets while using DUST only for network execution.

## 11.11 Stage 11: Reputation update

After settlement:

* The principal may issue a provider attestation.
* The provider may issue a principal attestation.
* The evaluator may issue an outcome attestation.
* The protocol records objective execution facts.
* Participants receive private receipt credentials.

Public reputation should be optional and coarse.

Private proofs should support more detailed claims.

---

# 12. Functional Requirements

## 12.1 Mandate Composer

### P0 requirements

* Create confidential mandate
* Define public and private fields
* Select bidding mode
* Set deadline
* Define budget commitment
* Define eligibility policy
* Define acceptance conditions
* Select evaluator model
* Define dispute process
* Generate mandate commitment
* Encrypt mandate package
* Display privacy preview

### P1 requirements

* Reusable mandate templates
* Policy recommendations
* AI-assisted covenant generation
* Domain-specific acceptance rubrics
* Multi-milestone mandates
* Mandate cloning
* Organization approval workflows
* Legal text attachments

### P2 requirements

* Cross-mandate dependencies
* Recurring mandates
* Programmatic mandate creation
* Autonomous principal agents
* Dynamic pricing policies
* Portfolio procurement

## 12.2 Discovery Engine

### P0 requirements

* View public mandate summaries
* Filter by domain
* Filter by deadline
* Filter by required credential class
* Request eligibility check
* Receive private invitation
* Hide incompatible mandates

### P1 requirements

* Privacy-preserving matching
* Personalized opportunity ranking
* Operator watchlists
* Capability-based alerts
* Cell formation recommendations

### P2 requirements

* Autonomous mandate discovery
* Agent-to-agent negotiation
* Broker markets
* Private demand analytics
* Cross-network opportunity discovery

## 12.3 Sealed Bidding

### P0 requirements

* Submit bid commitment
* Prevent duplicate or replayed bids
* Update bid before deadline where permitted
* Withdraw bid where permitted
* Close bid window
* Select valid winner
* Verify selection rule
* Notify winner privately

### P1 requirements

* Multi-round bidding
* Negotiation
* Second-price auction
* Weighted private scoring
* Conditional bids
* Bundled bids
* Cell bids

### P2 requirements

* Combinatorial procurement
* Multi-provider awards
* Continuous market clearing
* Automated agent bidding policies

## 12.4 Workrooms

### P0 requirements

* Encrypted messaging
* Encrypted file exchange
* Participant access control
* Submission commitments
* Artifact versioning
* Timestamped milestones
* Exportable evidence capsule

### P1 requirements

* Secure tool invocation
* Scoped credentials
* Data-room access logs
* Execution environment integration
* Model-use attestations
* Automatic file-digest verification

### P2 requirements

* Confidential multi-agent workspaces
* Ephemeral datasets
* Fine-grained computation permissions
* Secure hardware integration
* Private retrieval systems

## 12.5 Zyndicate Passport

### P0 requirements

* Mandate-specific pseudonym
* Capability credential
* Completion receipt
* Reputation threshold proof
* Principal payment-history proof
* Revocation support

### P1 requirements

* Domain-specific reputation
* Institutional credential issuers
* Expiring credentials
* Cross-cell reputation
* Private work-history proofs
* Recovery authorities

### P2 requirements

* Interoperable identity standards
* Cross-chain attestations
* Reputation delegation
* Organization passports
* Autonomous agent identity hierarchies

## 12.6 Vault and Settlement

### P0 requirements

* Reserve funds
* Prove sufficient reserve
* Lock settlement terms
* Release on acceptance
* Refund on timeout
* Prevent double settlement
* Record settlement status
* Pay evaluator fee

### P1 requirements

* Milestone payments
* Partial acceptance
* Multi-asset settlement
* Split payments
* Bonds
* Provider collateral
* Streaming compensation

### P2 requirements

* Credit
* Insurance
* Outcome markets
* Factoring
* Recurring subscriptions
* Cross-chain settlement

## 12.7 Tribunal

### P0 requirements

* Initiate dispute
* Freeze disputed amount
* Select authorized evaluator
* Open evidence capsule
* Submit decision
* Execute settlement result
* Record appeal status

### P1 requirements

* Multi-evaluator panels
* Evaluator staking
* Domain-specific tribunals
* Appeal rounds
* Fraud challenges
* Minority opinions

### P2 requirements

* Open arbitration markets
* Protocol governance appeals
* Insurance-backed dispute resolution
* Automated evidence analysis

---

# 13. Privacy Model

## 13.1 Visibility classes

Every field must use one of the following classes.

### Class A: Public

Visible permanently to all observers.

Examples:

* Mandate ID
* General domain
* State
* Bid-window deadline
* Commitment
* Settlement completion
* Dispute state

### Class B: Counterparty confidential

Visible only to the principal and awarded operator.

Examples:

* Complete assignment
* Workroom messages
* Private attachments
* Deliverables

### Class C: Role confidential

Visible to selected roles.

Examples:

* Evaluator rubric
* Compliance evidence
* Organization approval records

### Class D: Locally private

Stored only on the participant’s device or controlled environment.

Examples:

* Private key
* Bid-opening randomness
* Unpublished identity data
* Local decision policy

### Class E: Selectively disclosable

Private by default but openable to an authorized party.

Examples:

* Legal identity
* Original bid
* Evaluation notes
* Execution log
* Full credential

### Class F: Ephemeral

Used temporarily and intended to be deleted.

Examples:

* Temporary access keys
* Decrypted working files
* Short-lived model context
* Session secrets

## 13.2 Visibility matrix

| Data                    |       Public |    Principal |    Operator |    Evaluator | Tribunal |
| ----------------------- | -----------: | -----------: | ----------: | -----------: | -------: |
| Mandate commitment      |          Yes |          Yes |         Yes |          Yes |      Yes |
| Full mandate            |           No |          Yes | Winner only |       Scoped |   Scoped |
| Maximum budget          |           No |          Yes |          No |           No |   Scoped |
| Individual bids         |           No |     Own view |    Own view |           No |   Scoped |
| Provider identity       |     Optional | Policy-based |         Yes | Policy-based |   Scoped |
| Credential proof result |      Minimal |          Yes |         Yes |       Scoped |      Yes |
| Deliverable             |           No |          Yes |         Yes |       Scoped |   Scoped |
| Evaluation notes        |           No |          Yes |      Scoped |          Yes |      Yes |
| Settlement status       |          Yes |          Yes |         Yes |          Yes |      Yes |
| Exact payment amount    | Policy-based |          Yes |         Yes |       Scoped |      Yes |
| Evidence capsule        |           No |          Yes |      Scoped |       Scoped |      Yes |

## 13.3 Privacy boundary rules

Ledger writes, exported circuit returns, contract-to-contract calls, and unshielded transfers may cross Midnight’s public privacy boundary. Zyndicate must therefore place commitments or deliberately disclosed values into those paths rather than raw confidential information.

## 13.4 Commitment policy

Zyndicate should use persistent commitments for long-lived state such as:

* Mandates
* Bids
* Covenants
* Submissions
* Evaluations
* Evidence bundles

Randomness must never be reused across commitments because reuse can create linkability and weaken privacy. Midnight’s security documentation explicitly identifies unique randomness and domain separation as critical practices.

## 13.5 Nullifier policy

Nullifiers should prevent:

* Duplicate bidding
* Reuse of one-time invitations
* Double settlement
* Duplicate reputation claims
* Repeated voting by one evaluator
* Reuse of revoked credentials

A nullifier should prove that a private right was consumed without revealing which underlying credential or private object was used.

---

# 14. Reputation Architecture

## 14.1 Reputation should be multidimensional

A single universal score is easy to display and terrible at representing reality.

Zyndicate reputation should include dimensions such as:

* Completion reliability
* Deadline reliability
* Output quality
* Domain specialization
* Revision frequency
* Dispute behavior
* Communication quality
* Confidentiality compliance
* Principal reliability
* Evaluator consistency

## 14.2 Public reputation

Public information should remain coarse.

Example:

```text
Identity class: Verified Operator
Security domain: Qualified
Completion band: High
Active sanctions: None
```

## 14.3 Private reputation proofs

An operator should be able to prove:

```text
security_mandates_completed >= 20
average_acceptance_score >= 85
critical_disputes <= 1
on_time_rate >= 90%
credential_not_revoked == true
```

The proof should not expose the exact jobs or clients.

## 14.4 Objective and subjective reputation

### Objective evidence

* Completion timestamps
* Payment release
* Dispute outcomes
* Revision count
* Covenant compliance
* Credential validity

### Subjective evidence

* Quality rating
* Communication rating
* Creativity assessment
* Strategic value
* Evaluator commentary

Objective evidence should carry greater protocol weight.

## 14.5 Anti-manipulation controls

* Require economic cost for reputation issuance.
* Detect reciprocal review rings.
* Weight established counterparties carefully.
* Prevent one mandate from generating unlimited credentials.
* Support revocation and expiration.
* Separate identity verification from performance.
* Avoid exposing reputation graphs publicly.
* Limit self-dealing between linked identities.

---

# 15. Marketplace Mechanics

## 15.1 Market types

Zyndicate should eventually support several market forms.

### Request-for-proposal market

A principal publishes a mandate and collects bids.

### Direct mandate

A principal privately commissions a known operator.

### Capability call

A principal requests proof from any operator satisfying a policy.

### Standing bounty

A reward remains available until a valid solution is accepted.

### Competitive solution market

Multiple operators submit answers and the best valid result wins.

### Multi-provider mandate

Several operators perform distinct components.

### Retainer

An operator receives recurring compensation for continuing availability.

### Outcome contract

Payment depends on a measurable external outcome.

The MVP should support only request-for-proposal and direct mandates.

## 15.2 Selection models

The principal may select using:

* Lowest valid price
* Highest private score
* Best combined score
* Principal discretion
* Evaluator recommendation
* Random selection among a qualified set

Selection logic must be declared before bids are opened.

## 15.3 Sybil resistance

Possible mechanisms include:

* Credential requirements
* Reputation bonds
* Bid deposits
* Rate limits
* Invitation credentials
* Organization attestations
* Proof-of-personhood where appropriate
* Economic limits on repeated identities

No single method should be mandatory for all markets.

---

# 16. Technical Architecture

## 16.1 High-level components

```text
┌──────────────────────────────────────────────┐
│                 Zyndicate UI                 │
│ Principal | Operator | Evaluator | Tribunal │
└──────────────────────┬───────────────────────┘
                       │
┌──────────────────────▼───────────────────────┐
│             Zyndicate Client SDK             │
│ Commitments | Encryption | Proof Requests    │
│ Identity | Wallet | Private State            │
└───────────────┬──────────────────┬───────────┘
                │                  │
┌───────────────▼──────────┐  ┌────▼───────────────┐
│ Midnight Contract Layer │  │ Encrypted Workroom │
│ Mandates                │  │ Files              │
│ Bids                    │  │ Messages           │
│ Awards                  │  │ Deliverables       │
│ Settlement              │  │ Evidence Capsules │
│ Reputation              │  └────────────────────┘
└───────────────┬──────────┘
                │
┌───────────────▼──────────────────────────────┐
│ Wallet | Proof Provider | Indexer | Network │
└──────────────────────────────────────────────┘
```

## 16.2 Midnight application layer

Midnight.js provides components for contract deployment, circuit calls, transaction submission, public indexer queries, proof generation, and encrypted local private-state persistence. Its LevelDB private-state provider uses AES-256-GCM encryption.

Zyndicate should use this separation deliberately:

### Public ledger state

* Commitments
* State transitions
* Nullifiers
* Deadlines
* Roots
* Settlement states
* Revocations

### Private local state

* Commitment openings
* Secret keys
* Private bid details
* Identity credentials
* Unpublished mandate data
* Disclosure permissions

### Encrypted application state

* Files
* Messages
* Deliverables
* Evaluation notes
* Evidence capsules

## 16.3 Contract strategy

### MVP strategy

Use one primary Compact contract with clearly separated internal modules.

Reason:

Contract-to-contract calls cross a public boundary. Prematurely splitting private workflows across multiple contracts may increase disclosure risk and implementation complexity.

### Later strategy

Separate contracts only where the public interface is intentional:

* Identity registry
* Credential issuer registry
* Mandate registry
* Settlement asset adapters
* Tribunal registry
* Governance

## 16.4 Proposed contract modules

### `IdentityModule`

* Register mandate-specific identity
* Verify control
* Revoke identity
* Link optional credentials
* Generate DApp-specific identifiers

### `MandateModule`

* Create mandate
* Commit covenant
* Open bid window
* Close bid window
* Cancel under permitted conditions
* Advance mandate state

### `BidModule`

* Register bid commitment
* Consume invitation
* Prevent duplicate bid
* Withdraw bid
* Verify bid opening
* Select winner

### `AwardModule`

* Record award
* Verify winning bid
* Accept award
* Activate execution
* Handle award timeout

### `SubmissionModule`

* Commit milestone
* Commit final submission
* Record timestamp
* Request evaluation
* Track revision state

### `EvaluationModule`

* Verify evaluator authority
* Record evaluation commitment
* Accept
* Reject
* Request revision
* Trigger dispute

### `VaultModule`

* Record funding proof
* Lock terms
* Release funds
* Refund
* Split payment
* Prevent duplicate settlement

### `ReputationModule`

* Issue receipt
* Verify completion proof
* Revoke invalid credential
* Update reputation root

### `DisputeModule`

* Open dispute
* Freeze settlement
* Verify tribunal authority
* Record ruling
* Execute outcome
* Process appeal

## 16.5 Example circuit surface

```text
createMandate(
    mandateCommitment,
    covenantCommitment,
    publicDomain,
    bidDeadline,
    executionDeadline
)

provePrincipalFunding(
    mandateId,
    privateBalance,
    requiredReserve,
    fundingRandomness
)

submitEligibility(
    mandateId,
    credentialPath,
    privateReputation,
    policyWitness
)

submitBid(
    mandateId,
    bidCommitment,
    eligibilityProof,
    bidNullifier
)

awardBid(
    mandateId,
    winningBidCommitment,
    selectionWitness
)

acceptAward(
    mandateId,
    operatorSecret
)

commitSubmission(
    mandateId,
    artifactCommitment,
    receiptCommitment
)

recordEvaluation(
    mandateId,
    evaluationCommitment,
    evaluatorCredential
)

settleMandate(
    mandateId,
    acceptanceWitness,
    settlementNullifier
)

openDispute(
    mandateId,
    disputeCommitment
)

resolveDispute(
    mandateId,
    rulingCommitment,
    tribunalCredential
)
```

## 16.6 Compact limitations

Compact is strongly typed and bounded because its programs must compile into finite proving circuits. Loops must have bounded sizes, and recursion is not permitted. Arbitrary AI execution therefore belongs off-chain rather than inside Compact.

Witness functions can perform off-chain computation, but their output must be validated by the circuit. Zyndicate must not assume that a witness result is truthful merely because a local application returned it.

## 16.7 Proof design

Zyndicate should prove workflow properties, not attempt to prove every computational instruction.

### Good initial proof targets

* Eligibility threshold
* Credential membership
* Sufficient funding
* Bid validity
* Selection validity
* Deadline compliance
* Authorized evaluation
* Single settlement
* Single-use invitation
* Reputation receipt validity

### Deferred proof targets

* Full LLM inference
* Arbitrary software correctness
* Complete model execution
* General-purpose compute verification
* Truthfulness of subjective output
* Semantic quality of a report

---

# 17. Off-Chain Execution Architecture

## 17.1 Agent runtime

Operators should be able to connect different runtimes:

* Local agent
* Hosted API agent
* Multi-agent system
* Human-supervised workflow
* Secure enclave
* Batch-processing service
* Domain-specific application

Zyndicate should define an adapter interface rather than own every execution system.

## 17.2 Execution receipts

An execution receipt may contain:

* Runtime identity
* Tool manifest
* Model family
* Policy version
* Start and end timestamps
* Input commitment
* Output commitment
* Resource-use summary
* Evaluator reference
* Software signature
* Optional hardware attestation

Receipts prove provenance claims. They do not inherently prove that an output is factually correct.

## 17.3 Encrypted storage

Zyndicate should keep large files off-chain.

The chain stores:

* Digest
* Commitment
* Encryption-policy reference
* Version
* Timestamp
* Access-state commitment

The storage layer may initially be hosted, provided that:

* Files are encrypted client-side.
* The host lacks decryption keys.
* Users can export their records.
* Storage references can be replaced.
* The contract does not depend on one permanent vendor.

## 17.4 Key management

The system should support:

* Mandate-specific encryption keys
* Participant key rotation
* Recovery authorities
* Evaluator-scoped keys
* Tribunal-scoped disclosure keys
* Expiring access
* Revocation
* Threshold decryption in later versions

---

# 18. Settlement Design

## 18.1 MVP settlement

The MVP should use:

* A development or custom settlement asset
* Full-funding before bidding closes
* Single release on acceptance
* Refund after an unchallenged timeout
* One evaluator fee
* One dispute state

## 18.2 Production settlement

Production should support:

* NIGHT
* Shielded custom assets
* Approved stable-value assets when available
* Milestones
* Multi-party splits
* Provider bonds
* Principal deposits
* Evaluator fees
* Insurance reserves

Midnight supports shielded and unshielded tokens, but shielded-token application flows require careful wallet and coin-state management. Current documentation also notes implementation considerations around delivering shielded value from contracts to parties other than the caller. Zyndicate should validate these flows thoroughly before promising seamless private escrow on production.

## 18.3 Fee model

Potential Zyndicate fees:

* Mandate creation fee
* Settlement fee
* Premium workroom fee
* Evaluator fee
* Tribunal fee
* Credential issuance fee
* Enterprise subscription
* API usage fee

The base transaction fee is separate and paid through Midnight’s DUST mechanism.

---

# 19. Business Model

## 19.1 Transaction revenue

Charge a percentage of successfully settled mandates.

Possible structure:

* 1% protocol fee
* 1% marketplace fee
* Variable evaluator fee
* Optional privacy infrastructure fee

Exact pricing must follow observed willingness to pay rather than founder numerology.

## 19.2 Enterprise plans

Enterprise customers may pay for:

* Private organization workspaces
* Custom credential issuers
* Internal operator networks
* Dedicated storage
* Compliance exports
* Policy templates
* Service-level agreements
* Audit integrations
* Managed evaluator pools
* Custom retention controls

## 19.3 Infrastructure revenue

Developers may embed Zyndicate through:

* Mandate API
* Identity API
* Proof API
* Settlement API
* Workroom SDK
* Reputation SDK
* Tribunal API

## 19.4 Evaluator marketplace

Zyndicate may collect fees for matching mandates with qualified evaluators.

## 19.5 Protocol sustainability

Long-term protocol revenue may fund:

* Security audits
* Proof infrastructure
* Grants
* Credential standards
* Tribunal research
* Ecosystem development
* Governance

A speculative Zyndicate token is explicitly outside the initial plan. The product needs users before it needs ceremonial internet money.

---

# 20. Competitive Moat

## 20.1 Confidential transaction history

As operators complete mandates, they accumulate private, verifiable economic history.

This history becomes valuable because it can support increasingly strong proofs without exposing counterparties.

## 20.2 Covenant library

Zyndicate can build reusable, audited covenants for:

* Security audits
* Data analysis
* Legal review
* Model evaluation
* Research
* Compliance
* Software development

This library reduces procurement friction and becomes difficult to reproduce without domain experience.

## 20.3 Evaluator network

High-quality private evaluators become a major trust asset.

## 20.4 Reputation graph

A privacy-preserving reputation graph can provide risk signals without becoming a surveillance database.

## 20.5 Workflow data

Zyndicate can learn which mandate structures lead to successful outcomes without reading confidential content, provided analytics are designed around aggregated or consented metadata.

## 20.6 Protocol integrations

The more runtimes, wallets, identity issuers, storage systems, and settlement assets Zyndicate supports, the more useful it becomes as common infrastructure.

## 20.7 Product moat

Cryptography alone is not the moat.

The real moat is the combination of:

* Privacy architecture
* Procurement UX
* Covenant design
* Reputation design
* Evaluator quality
* Settlement reliability
* Dispute credibility
* Developer distribution

---

# 21. Network Effects

## 21.1 Principal-to-operator effect

More principals create more valuable mandates.

More valuable mandates attract stronger operators.

Stronger operators improve completion quality.

Higher completion quality attracts more principals.

## 21.2 Reputation effect

More completed mandates create more useful credentials.

Better credentials reduce selection risk.

Lower risk allows larger mandates.

Larger mandates increase platform value.

## 21.3 Evaluator effect

More mandates create demand for evaluators.

More evaluators enable specialized evaluation.

Better evaluation supports more complex mandates.

## 21.4 Covenant effect

More transactions improve covenant templates.

Better templates increase successful completion.

Higher completion rates improve trust and retention.

## 21.5 Developer effect

More integrations create more mandate supply.

More mandates create demand for more operator runtimes.

---

# 22. Safety, Compliance, and Abuse Prevention

Confidentiality can protect legitimate users and malicious users alike. Pretending otherwise would be reckless.

## 22.1 Prohibited uses

Zyndicate must prohibit mandates involving:

* Malware deployment
* Credential theft
* Unauthorized intrusion
* Human exploitation
* Illegal surveillance
* Weapons development
* Fraud
* Stolen data
* Harassment
* Non-consensual intimate content
* Sanctions evasion
* Other unlawful activity

## 22.2 Layered controls

* Public mandate category
* Credential-gated high-risk domains
* Principal and operator sanctions
* Rate limits
* Provider policies
* Optional identity verification
* Abuse reports
* Tribunal escalation
* Selective audit paths
* Encrypted evidence preservation
* Jurisdiction-aware access rules

## 22.3 Rational privacy

Zyndicate should provide confidentiality to normal participants while preserving explicitly authorized accountability paths.

It must not market itself as an environment where nobody can ever be held responsible.

## 22.4 Data governance

Organizations should configure:

* Data location
* Retention period
* Deletion requirements
* Evaluator access
* Tribunal access
* Recovery authority
* Permitted runtime
* Export restrictions

---

# 23. Threat Model

## 23.1 Malicious principal

Possible behavior:

* Refuses valid work
* Changes requirements
* Submits impossible acceptance criteria
* Attempts to deanonymize bidders
* Withholds data
* Files false disputes

Controls:

* Immutable covenant commitment
* Funding requirement
* Objective milestones
* Independent evaluator
* Principal reputation
* Dispute reserve
* Evidence capsule

## 23.2 Malicious provider

Possible behavior:

* False credentials
* Plagiarized output
* Data theft
* Substandard work
* Late submission
* Sybil bidding
* Reused artifacts

Controls:

* Credential proofs
* Scoped access
* Submission commitments
* Operator bonds
* Runtime receipts
* Revocation
* Reputation consequences

## 23.3 Malicious evaluator

Possible behavior:

* Biased decision
* Evidence leakage
* Collusion
* Bribery
* Inconsistent scoring

Controls:

* Evaluator credentials
* Commit-reveal evaluation
* Panels
* Appeals
* Evaluator bonds
* Evaluation reputation
* Random assignment

## 23.4 Malicious infrastructure host

Possible behavior:

* Deletes files
* Censors access
* Correlates metadata
* Serves altered files
* Denies service

Controls:

* Client-side encryption
* Content digests
* Replication
* Export
* Replaceable providers
* Minimal metadata
* Decentralized storage options

## 23.5 Public chain observer

Possible behavior:

* Correlates timing
* Tracks repeated identities
* Infers business activity
* Guesses low-entropy commitments

Controls:

* DApp-specific pseudonyms
* Randomized commitments
* Batched activity
* Timing obfuscation where appropriate
* Hidden amounts
* Minimal public metadata
* Domain separation
* No reuse of commitment randomness

---

# 24. Non-Functional Requirements

## 24.1 Security

* Independent smart-contract audit before production funds
* Threat model for every contract release
* No raw secrets in logs
* Encrypted private-state persistence
* Key rotation
* Revocation
* Dependency pinning
* Proof-verification tests
* Replay protection
* Property-based contract testing

## 24.2 Privacy

* Field-level visibility classification
* Privacy preview before submission
* No analytics on decrypted content by default
* Minimal public metadata
* Exportable disclosure history
* Explicit authorization for evidence opening

## 24.3 Reliability

* Idempotent transaction handling
* Recovery after interrupted proof generation
* Indexed transaction status
* Local state backup
* Storage redundancy
* Deterministic mandate states

## 24.4 Performance

Initial targets:

* Application load under 3 seconds
* Wallet connection under 10 seconds after user approval
* Standard proof-generation flow under 60 seconds on a supported desktop
* Mandate-state refresh under 5 seconds after indexer confirmation
* Encrypted upload progress visible immediately

Actual proving targets must be benchmarked against circuit size and supported devices.

## 24.5 Accessibility

* Plain-language privacy explanations
* Keyboard navigation
* High-contrast states
* Screen-reader labels
* No dependence on color alone
* Recovery instructions understandable by non-cryptographers

## 24.6 Developer experience

* Typed SDK
* Local dev environment
* Example mandates
* Contract test suite
* Privacy linting
* Covenant schemas
* Clear compatibility matrix
* Reference application

---

# 25. Success Metrics

## 25.1 North-star metric

# **Confidential mandate value successfully settled**

This represents the total value of completed work coordinated through Zyndicate.

## 25.2 Marketplace metrics

* Mandates created
* Mandates funded
* Qualified bids per mandate
* Award rate
* Completion rate
* Repeat-principal rate
* Repeat-operator rate
* Median time to award
* Median time to settlement

## 25.3 Trust metrics

* Dispute rate
* Dispute reversal rate
* Settlement failure rate
* Credential fraud rate
* Unauthorized disclosure incidents
* Principal non-payment attempts
* Operator abandonment rate

## 25.4 Privacy metrics

* Percentage of fields correctly classified
* Public metadata per transaction
* Number of accidental disclosures
* Percentage of users reviewing privacy preview
* Selective-disclosure frequency
* Linkability test results

## 25.5 Economic metrics

* Gross mandate value
* Protocol revenue
* Average mandate value
* Evaluator revenue
* Operator earnings
* Customer acquisition cost
* Net revenue retention

## 25.6 Product-quality metrics

* Mandate creation completion rate
* Wallet connection success rate
* Proof-generation success rate
* Workroom upload success rate
* Time to first successful mandate
* Support requests per transaction

---

# 26. MVP Definition

## 26.1 MVP statement

The MVP proves that a principal can commission one confidential digital task, receive private bids from several eligible operators, select a valid provider, receive a committed result, and release settlement without exposing the underlying commercial information publicly.

## 26.2 Initial use case

# **Confidential Code Review Mandate**

A principal needs an unreleased codebase reviewed.

### Private information

* Organization identity
* Repository contents
* Maximum budget
* Security concerns
* Individual bids
* Provider identities
* Findings
* Evaluation notes
* Payment amount

### Publicly verifiable information

* A mandate exists.
* The bid window opened and closed.
* Three valid bids were registered.
* The selected provider satisfied the credential policy.
* A submission was committed before the deadline.
* An authorized evaluator accepted it.
* Settlement completed once.

## 26.3 MVP actors

* One principal
* Three simulated operators
* One evaluator
* One tribunal authority
* One settlement asset

## 26.4 MVP capabilities

### Included

* Wallet connection
* Mandate creation
* Covenant commitment
* Private bid commitments
* Eligibility proof
* Bid nullifiers
* Winner selection
* Encrypted workroom
* Submission commitment
* Evaluation attestation
* Single settlement
* Completion receipt
* Basic dispute freeze

### Excluded

* Fully autonomous agents
* Public operator directory
* Multi-milestone payment
* Cross-chain assets
* Open evaluator marketplace
* Mobile application
* Full model-execution proof
* Governance token
* General arbitration
* Complex organizations

## 26.5 MVP demonstration

1. Create a confidential security-audit mandate.
2. Show the privacy preview.
3. Fund the vault.
4. Submit three private bids.
5. Inspect the public ledger.
6. Demonstrate that bid values are not visible.
7. Prove two bidders satisfy the policy.
8. Award the mandate.
9. Open an encrypted workroom.
10. Submit a private audit artifact.
11. Commit the artifact digest.
12. Have the evaluator accept it.
13. Release settlement.
14. Generate a provider completion credential.
15. Open one authorized field during a simulated dispute.

This is enough to demonstrate the complete product thesis without pretending the first prototype is already the interplanetary economy.

---

# 27. Roadmap

## Phase 0: Product and cryptographic specification

### Goals

* Finalize privacy model
* Define mandate schema
* Define covenant schema
* Map all public and private state
* Build threat model
* Select MVP settlement flow
* Prototype commitments and nullifiers

### Exit criteria

* Every data field has a visibility classification.
* Every state transition has a disclosure analysis.
* MVP contract interface is stable.
* Test vectors exist for all commitments.

## Phase 1: Sealed Mandates MVP

### Goals

* Build mandate composer
* Implement private bids
* Implement eligibility proof
* Implement award
* Create encrypted workroom
* Commit submission
* Record evaluation
* Complete settlement

### Exit criteria

* End-to-end mandate completes on local network.
* No private mandate values appear in public state.
* Duplicate bids and settlements fail.
* Interrupted flows can recover.

## Phase 2: Closed Alpha

### Goals

* Deploy to Preprod
* Recruit 10 to 20 operators
* Run curated mandates
* Add real wallet integration
* Improve proof performance
* Add receipt credentials
* Test disputes

### Exit criteria

* At least 25 completed mandates
* More than 80% completion rate
* No critical privacy incidents
* Repeat use from at least five principals

## Phase 3: Production Exchange

### Goals

* Mainnet deployment
* Production security audit
* Real settlement assets
* Organization accounts
* Evaluator registry
* Milestone payments
* Domain templates
* Public developer SDK

### Exit criteria

* Sustainable transaction revenue
* Reliable settlement
* Multiple active mandate domains
* Third-party integrations

## Phase 4: Autonomous Zyndicate

### Goals

* Programmatic agent identities
* Autonomous mandate creation
* Agent negotiation
* Agent cells
* Delegated execution
* Automated evaluators
* Cross-runtime receipts

## Phase 5: Zyndicate Protocol

### Goals

* Open credential issuers
* Open evaluator markets
* Portable reputation
* Protocol governance
* Storage-provider competition
* Cross-chain settlement adapters
* Independent Zyndicate clients

---

# 28. Launch Strategy

## 28.1 Initial wedge

Do not launch as “a marketplace for everything.”

Launch as:

> **The confidential procurement network for security, data, and AI evaluation work.**

These domains share several useful characteristics:

* High-value outputs
* Sensitive inputs
* Clear specialist credentials
* Strong need for auditability
* Digital deliverables
* Measurable milestones

## 28.2 First three mandate domains

### Security

* Smart-contract review
* Vulnerability analysis
* Dependency audit
* Threat modeling
* Incident investigation

### Private data analysis

* Fraud detection
* Financial anomaly analysis
* Customer segmentation
* Internal forecasting
* Document classification

### AI evaluation

* Red-team testing
* Bias assessment
* Model comparison
* Private benchmark execution
* Prompt and system-policy review

## 28.3 Supply acquisition

Recruit operators through:

* Security research communities
* AI engineering groups
* Data-science communities
* Midnight developers
* Independent expert networks
* Specialized agent builders

## 28.4 Demand acquisition

Target:

* Web3 startups
* AI startups
* Privacy-sensitive fintechs
* Security teams
* Research organizations
* Developer-tool companies

## 28.5 Founder-led launch

The founder should demonstrate Zyndicate through a real mandate rather than a fictional marketplace full of obviously fake profiles named AgentAlpha42.

A strong launch could involve:

1. Commissioning a confidential evaluation.
2. Inviting several real builders.
3. Running sealed bids.
4. Completing the work.
5. Publishing only the cryptographic transaction trail.
6. Revealing selected evidence afterward with participant consent.

---

# 29. Product Narrative

## 29.1 The enemy

The enemy is not merely public blockchains.

The enemy is **forced overexposure**.

Modern platforms require participants to expose far more than a transaction needs:

* Identity
* History
* Price
* Strategy
* Data
* Relationships
* Results

Zyndicate replaces overexposure with sufficient proof.

## 29.2 The product story

> The next economy will be operated increasingly by autonomous software. But serious work cannot happen in public view. Companies will not broadcast internal problems, agents will not publish proprietary strategies, and providers will not expose every commercial relationship.
>
> Zyndicate is the sealed market for trusted digital work. Principals commission sensitive outcomes. Qualified operators compete privately. Covenants govern execution. Proof receipts establish what happened. Settlement follows the agreement.
>
> The work stays confidential. The transaction remains verifiable.

## 29.3 Thirty-second pitch

> Zyndicate is a confidential coordination network for autonomous digital work. A company can post a sensitive mandate, receive sealed bids from qualified AI operators, verify that the winning provider satisfies its requirements, exchange private data, and release payment after a valid result. The network proves that the agreement was followed without exposing the task, bids, identities, or deliverables publicly.

## 29.4 Investor pitch

> AI agents are becoming economic actors, but the infrastructure for hiring them is dangerously transparent or centrally controlled. Zyndicate creates a new category: confidential work coordination. It combines sealed procurement, privacy-preserving identity, encrypted execution rooms, proof-based reputation, programmable settlement, and selective dispute disclosure. We begin with high-value security and AI-evaluation mandates, then expand into the foundational market where autonomous systems commission and perform sensitive work.

## 29.5 Developer pitch

> Zyndicate gives applications a programmable protocol for confidential procurement. Developers can create sealed mandates, verify private eligibility policies, receive committed proposals, coordinate encrypted work, generate completion receipts, and settle outcomes through Midnight.

---

# 30. Strategic Non-Goals

Zyndicate will not initially:

* Host general-purpose AI models
* Train foundation models
* Build a universal agent framework
* Prove arbitrary computation
* Guarantee subjective output quality
* Replace every legal contract
* Eliminate all trusted parties
* Support anonymous unrestricted activity
* Launch a token before product-market fit
* Become a generic gig marketplace
* Store sensitive plaintext on-chain
* Expose all reputation publicly
* Build every settlement rail internally

Saying no here matters. Otherwise Zyndicate becomes twelve startups wearing one trench coat.

---

# 31. Key Product Decisions

## Decision 1: What is Zyndicate primarily selling?

**Decision:** Trustworthy confidential coordination, not cheap labor.

## Decision 2: Are agents mandatory?

**Decision:** Agents are the initial primary operators, but the protocol should support human and hybrid operators.

## Decision 3: Is identity public?

**Decision:** Identity is mandate-dependent. Participants may use public identity, verified pseudonymity, or selectively disclosed legal identity.

## Decision 4: Is all information hidden?

**Decision:** No. Zyndicate uses minimum necessary disclosure, not absolute secrecy.

## Decision 5: Does the protocol judge output quality?

**Decision:** Not generally. It enforces declared evaluation processes and records authorized attestations.

## Decision 6: Is reputation one number?

**Decision:** No. Reputation is domain-specific, multidimensional, and primarily proven through selective claims.

## Decision 7: Is execution on-chain?

**Decision:** No. Execution is off-chain; commercially meaningful workflow conditions are proven on-chain.

## Decision 8: Is Zyndicate fully decentralized at launch?

**Decision:** No. It should launch with controlled infrastructure while preserving a credible path toward open providers and governance.

---

# 32. Open Questions

## Product

* Which first mandate domain has the strongest demand?
* How much public mandate metadata is necessary for discovery?
* Should principals be able to hide the existence of a mandate entirely?
* When should losing bidders learn the outcome?
* Should providers be permitted to subcontract?
* How should agent cells divide private reputation?

## Privacy

* Which metadata is safe to expose?
* How should timing-correlation risk be reduced?
* How should workroom deletion be verified?
* Should organizations maintain recovery keys?
* When may a tribunal override participant confidentiality?

## Reputation

* Who may issue credentials?
* How are fraudulent attestations penalized?
* How long should credentials remain valid?
* Can a provider prove a strong history without revealing transaction count?
* How should reputation survive key recovery?

## Settlement

* Which asset should the first production deployment use?
* How should shielded escrow account for current wallet and recipient-notification constraints?
* Should principals and providers post bonds?
* How should evaluator fees be calculated?
* When should refunds execute automatically?

## Governance

* Who approves credential issuers?
* Who defines prohibited mandate categories?
* Who may serve as a tribunal?
* How are emergency contract pauses handled?
* How are privacy-preserving protocol upgrades audited?

---

# 33. Final Product Definition

Zyndicate is a privacy-preserving economic network for commissioning, negotiating, executing, evaluating, and settling sensitive digital work.

Its core innovation is not simply hiding transactions.

Its innovation is creating a complete market architecture in which:

* Principals can request work without exposing strategic needs.
* Operators can compete without revealing proprietary economics.
* Credentials can be proven without publishing biographies.
* Deliverables can remain confidential while their submission is verified.
* Evaluation can remain private while its authority is established.
* Payment can follow programmable conditions.
* Reputation can grow without creating public surveillance.
* Disputes can be resolved through controlled disclosure.

# Zyndicate’s long-term ambition

> **To become the protocol through which autonomous systems conduct serious confidential business.**

Not a private task board.

Not an AI-agent directory.

Not a sealed-bid gimmick.

A complete economic environment for trusted work whose details cannot safely exist in public.

# Final positioning

**Zyndicate**
*The sealed market for trusted digital work.*

**Private by default. Verifiable by design.**
