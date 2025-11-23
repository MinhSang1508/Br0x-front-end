---
icon: hand-wave
layout:
  width: default
  title:
    visible: true
  description:
    visible: false
  tableOfContents:
    visible: true
  outline:
    visible: true
  pagination:
    visible: true
  metadata:
    visible: true
---

# Hello world

####

We present a novel protocol for bridgeless cross-chain asset swaps between Cardano and heterogeneous blockchain networks, eliminating the need for custodial bridges or wrapped assets.

Our architecture leverages Wanchain's cross-chain messaging layer as a trust-minimized relay, combined with Cardano native scripts and off-chain swap routers to enable atomic swaps.

The system introduces **Lock-Proof Relay Contracts**, **Cross-Chain Liquidity Routers**, and **Proof-Aware Settlement Modules** to achieve secure, low-latency, and composable interoperability.

We detail the protocol's cryptographic primitives, data flow, and security assumptions, and we propose an implementation roadmap suitable for mainnet deployment.
