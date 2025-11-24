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

# Problem

### **Current state:**

Cross-chain swaps today mostly rely on bridges or centralized relayers → high fees, custody risk, fragmented liquidity, and complex UX.

**Goal:**\
Enable **non-custodial bridgeless swaps** (no wrapped tokens, no intermediaries) between Cardano (eUTxO) and EVM chains, while keeping UX simple and secure.

***

### Key Technical Challenges

1. **Interoperability:** eUTxO ↔ account-based (deposit-by-address, event detection, CBOR ↔ ABI payloads).
2. **Finality & proof:** Different confirmation rules, must verify Wanchain TSS proofs.
3. **Atomicity:** Ensure both swap legs succeed or refund, no custodian.
4. **Liquidity routing:** Multiple DEX/aggregator integrations (mock in POC).
5. **Plutus complexity:** Datum/redeemer encoding, refund logic, external triggers.

***

### Key UX Challenges

1. **Wallet-less flow:** Direct deposits without signing — must prevent phishing via deposit address verification.
2. **Error prevention:** Wrong chain/token/memo — need preflight checks & warnings.
3. **Status tracking:** Clear timeline + explorer links + ETA.
4. **Refund clarity:** Conditions, trigger, and timing visible.
5. **Cost visibility:** Show fees & best route (Hydra vs Wanchain) for micro-swaps.

***

### Risks

* Relayer/validator compromise (forged proof).
* User error → loss of funds.
* MEV/slippage on destination chain.
* Privacy leaks from deposit addresses.
* Legal/AML compliance for partners.

***

### Constraints & Assumptions

* Wanchain available on testnet with TSS proof relay.
* Cardano CIP-30 wallets & Plutus v2 usable.
* Phase 1 = testnet POC, no production governance.

***

### Success Criteria (Testnet POC)

* 90% of retail users complete swap without dev help.
* Refund works in timeout cases.
* Micro-swap fee ≤ 2% (via Hydra batch).
* UI shows full trace (source tx, proof, dest tx).
* Verified end-to-end Cardano → EVM swap.

***

### Immediate Actions

* Finalize canonical message schema (CBOR + BLAKE2b-256).
* Define deposit address verification UX (signed QR, proof).
* Mock liquidity router for POC.
* Conduct quick user interviews (5–10 testers).
* Design timeline & refund flow in UI.
