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

# Technologies

Coming soon...

### **Core Technologies Powering Bridgeless Swaps**

Our architecture is built on a **stack of complementary technologies**, each chosen for its ability to deliver **trustless execution, cross-chain interoperability, and cryptographic security**.

### **1. Cardano’s Extended UTxO (EUTxO) Model**

* **Deterministic Execution** – Every transaction outcome is predictable before it’s submitted, reducing failed trades and ensuring swap finality.
* **Native Multi-Asset Support** – Tokens on Cardano are first-class citizens (no ERC-20 contract overhead), allowing direct swap logic at the ledger level.
* **Smart Contracts with Plutus/Vasil Enhancements** – Our swap scripts leverage **Plutus V2** optimizations for smaller transaction sizes, lower fees, and improved validator logic.

### **2. Wanchain’s XFlows Cross-Chain Infrastructure**

* **Universal Messaging Layer** – XFlows provides an _on-chain to on-chain_ communication framework for heterogeneous blockchains.
* **Lock-Mint-Burn-Unlock Primitives** – Originally designed for wrapped assets, we extend these primitives to support **direct asset-for-asset swaps** without any wrapping or synthetic tokens.
* **Non-EVM Chain Support** – Through Wanchain’s modular connectors, we integrate both **EVM chains (Ethereum, BNB Chain, Polygon)** and **non-EVM chains (Cardano, Bitcoin, Polkadot, etc.)** seamlessly.

### **3. Zero-Knowledge Proof (ZKP) Settlement Layer**

* **Proof-of-Swap Validity** – Instead of trusting a bridge custodian, swaps are finalized only when **cryptographic proofs** validate both sides of the transaction.
* **Privacy Preservation** – ZKP integration ensures that sensitive transaction details (amount, counterparty) can remain private while still being verifiable.
* **zk-SNARKs + zk-STARKs Hybrid** – Optimized for different chain environments to balance proof size, generation time, and verification cost.

### **4. Cross-Chain State Verification**

* **Light Client Verification** – Instead of centralized relayers, we deploy **light clients** on each chain to verify the other chain’s block headers and transaction proofs.
* **SPV (Simplified Payment Verification)** – For UTXO-based chains like Bitcoin and Cardano, enabling lightweight yet trustless proof validation.

### **5. Off-Chain Coordination & Order Matching**

* **Decentralized Order Relay Network** – Peer-to-peer order broadcasting without central servers, using **libp2p** for secure communication.
* **Commit-Reveal Mechanism** – Prevents front-running by hiding trade details until both parties have locked their commitments.
* **MEV Resistance** – Orders are batched and hashed before settlement to neutralize miner/validator extraction risks.

### **6. Security & Audit Framework**

* **Formal Verification** – Smart contracts are verified using **Isabelle/HOL** and **Marlowe formal methods** for financial safety guarantees.
* **Multi-Signature Governance** – Key upgrade and protocol parameters require **M-of-N multisig** approval, reducing unilateral control risks.
* **Continuous Audit Hooks** – Real-time monitoring for anomaly detection and automated pause triggers on suspicious activity.
