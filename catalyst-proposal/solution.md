---
layout:
  width: default
  title:
    visible: true
  description:
    visible: true
  tableOfContents:
    visible: true
  outline:
    visible: true
  pagination:
    visible: true
  metadata:
    visible: true
---

# Solution

### &#x20;Overview

The primary objective is to deliver an **interactive prototype** of the bridgeless swap app that includes all screens, user flows, transaction states, and deposit address verification.\
Alongside the prototype, a minimal smart contract integration with Wanchain’s testnet will be implemented to demonstrate an end-to-end Cardano ↔ EVM swap.

***

### &#x20;App Interface Scope

**1. Main User Flows**

* **Landing / Token Pair Selection** – choose swap pair, enter amount, view price quote.
* **Deposit Address Screen** – display address and QR code with backend-signed proof, chain/token warnings.
* **Progress Tracking** – visual timeline: Deposit detected → Confirmations → Proof relay → Swap execution → Complete.
* **Refund Request Screen** – refund button available after timeout with clear instructions.
* **Settings & Info** – display estimated fees, allow path selection (Hydra or Wanchain).

**2. UX Features**

* **Signed Deposit Quote Display** – show hash and backend signature so users can verify authenticity.
* **Step-by-step Warnings** – preflight checks before copying deposit address.
* **Live Explorer Links** – clickable links to view transactions on-chain.
* **Adaptive Path Recommendation** – suggest Hydra for small trades, Wanchain for larger trades.

**3. Prototype Tools**

* Figma or Framer for wireframes and interactive mockups.
* React (Next.js) for the interactive prototype running on testnet.
* TailwindCSS + shadcn/ui for consistent UI components.

### &#x20;Minimal Smart Contract Scope

**Cardano side**&#x20;

* Hold funds at a script address with datum containing token, amount, destination chain, and timeout.
* Allow refunds after timeout.
* Accept settlement trigger from proof relay (mocked or real from Wanchain testnet).

**EVM side (Solidity)**

* Receive proof (mocked or real) from Wanchain.
* Perform a simple swap on a test DEX (mock router).
* Send resulting tokens to the recipient.

**Cross-chain messaging**

* Use Wanchain testnet for the message layer (TSS proof).
* Payload format: CBOR + BLAKE2b hash, consistent across both chains.

***

### &#x20;Development Focus

| Deliverable                               | Notes                                        |
| ----------------------------------------- | -------------------------------------------- |
| Full UI prototype with all flows          | Figma interactive + responsive web           |
| Interactive web app on testnet (UI logic) | State machine, mock API, live explorer links |
| Minimal smart contract & relay            | Basic Plutus + Solidity integration          |
| End-to-end testnet swap demo              | Proof of concept with Wanchain relay         |

***

### &#x20;Success Indicators

**UI/UX**

* Users can complete the swap flow (mocked) without assistance.
* Timeline and explorer links always reflect the correct transaction state.
* Deposit verification appears instantly after quote request.

**Smart contract**

* At least one successful Cardano → EVM and reverse swap on testnet.
* Refund executes successfully when timeout occurs.

***

### &#x20;Next Steps

1. Finalize wireframes for V2.
2. Build the UI state machine to reflect swap stages.
3. Implement backend mock for deposit detection and relay events.
4. Deploy minimal Plutus and Solidity contracts on testnet.
5. Integrate UI with testnet contracts to run a full end-to-end demo.
