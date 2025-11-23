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

# Roadmap

We still initial phase...

#### **Phase 1 – Prototype (Testnet)**

**Objective:** Deliver a fully functional prototype on public testnets to validate the Bridgeless Swap model.

* **Cardano Lock Script**
  * Develop Plutus V2 script for native ADA and multi-asset locking.
  * Implement time-lock refunds for failed swaps.
  * Test on Cardano local devnet and Preprod Testnet.
* **EVM Lock Contract**
  * Build Solidity contracts for Ethereum, BSC, and Polygon testnets.
  * Integrate event emissions for swap state tracking and proof requests.
* **Wanchain XFlows Integration**
  * Configure proof relay between Cardano ↔ EVM testnets.
  * Extend Lock-Mint-Burn-Unlock primitives for direct asset-for-asset swaps.
* **Liquidity Routing Simulation**
  * Implement off-chain router simulation for order matching and routing.
  * Connect to mock liquidity pools for functional testing.
* **Testnet Demonstration**
  * Execute successful swaps between Cardano Testnet and EVM Testnets.
  * Record latency, gas cost, and transaction success rate.

***

#### **Phase 2 – SDK & Developer Tools**

**Objective:** Build developer-friendly tools to integrate Bridgeless Swaps into dApps.

* **Unified SDK Development**
  * Create TypeScript SDK integrated with Plutus validator scripts for lock/verify/release.
  * Modular architecture to support future chain integrations.
* **CLI Utilities**
  * Provide CLI commands to initiate, monitor, and finalize swaps.
  * Local simulation mode for testing without mainnet.
* **Developer Documentation**
  * Detailed technical guides and API references.
  * Integration examples for Web3 frontends.
* **Initial Security Review**
  * Static analysis and fuzz testing for smart contracts.
  * Internal code audit before public release.

***

#### **Phase 3 – Mainnet Beta Launch**

**Objective:** Deploy Bridgeless Swaps on mainnet with core chain integrations and onboard liquidity.

* **Mainnet Deployments**
  * Deploy Plutus lock scripts on Cardano Mainnet.
  * Deploy EVM contracts on Ethereum, BSC, and Polygon.
* **Liquidity Provider Onboarding**
  * Launch incentive programs to attract early LPs.
  * Provide LP dashboard for pool management and yield tracking.
* **Swap Dashboard**
  * User interface for direct native asset swaps across chains.
  * Real-time analytics for prices, liquidity, and settlement times.
* **Security & Monitoring**
  * Real-time anomaly detection for cross-chain transactions.
  * Bug bounty program to crowdsource security testing.

***

#### **Phase 4 – Scaling & Ecosystem Expansion**

**Objective:** Expand chain support, optimize performance, and integrate deeply into the DeFi ecosystem.

* **Multi-Chain Expansion**
  * Add support for non-EVM chains such as Bitcoin, Polkadot, Solana, and Cosmos.
  * Use light clients and proof relay to maintain trustless bridgeless design.
* **Performance Optimization**
  * Reduce settlement latency with parallel proof verification.
  * Optimize gas and network fees through batch settlement and Layer-2 rollups (e.g., Arbitrum, zkSync).
* **Ecosystem Partnerships**
  * Collaborate with DEXs, lending protocols, and yield aggregators for native integration.
  * Integrate into leading Web3 wallets (MetaMask, OKX, Eternl) for in-wallet swaps.
* **Institutional-Grade Features**
  * Introduce OTC cross-chain swaps for high-volume trades.
  * Provide APIs for CEXs to enable native cross-chain deposits and withdrawals.
* **Developer Growth Program**
  * Launch grants for projects building on Bridgeless Swap.
  * Organize hackathons to foster ecosystem innovation.

