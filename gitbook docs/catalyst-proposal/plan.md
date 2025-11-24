# Plan

### **Milestone 1 – Research & UI/UX Design** (Month 1)

**Output**

* Comprehensive research document covering market needs, competitor analysis, and blockchain integration feasibility.
* Wireframes and interactive UI mockups for all major screens (swap flow, wallet connect, history, settings) in light/dark mode.
* User flow diagrams for key interactions (connect wallet, initiate swap, track swap status).
* Preliminary frontend architecture and API interaction plan.

**Acceptance Criteria**

* All primary workflows are visually mapped in Figma wireframes.
* Minimum of two design review cycles with stakeholder feedback implemented.
* Frontend architecture plan approved by technical lead.
* Documentation includes component list, state management strategy, and API data flow.

**Proof of Completion**

* Figma prototype with clickable navigation across all planned screens.
* PDF export of UI/UX package including style guide and color themes.
* Research & architecture document stored in shared repository.
* Signed stakeholder approval in project log.

***

### **Milestone 2 – Interactive Prototype Development** (Months 2–3)

**Output**

* Clickable, interactive prototype with responsive layout and all UI components functional with mock data.
* Frontend framework set up (e.g., React + Tailwind) with routing, state management, and placeholder API hooks.
* Integrated wallet connection (testnet mode).
* Sample swap simulation with static data.

**Acceptance Criteria**

* All screens from Milestone 1 implemented in responsive, interactive format.
* Wallet connect and disconnect flows work in testnet.
* Component library implemented per style guide.
* Prototype passes internal QA checklist for usability and navigation.

**Proof of Completion**

* Deployed prototype to staging server (Netlify/Vercel) with public link.
* Source code pushed to Git repository with documentation on setup.
* QA report signed off by product manager.
* Demo session recording stored in documentation folder.

***

### **Milestone 3 – Core Swap Logic & Testnet Integration** (Month 4)

**Output**

* Implementation of blockchain interaction layer with swap smart contract integration.
* Real testnet swap execution between two supported chains.
* Transaction history retrieval from blockchain explorer API.
* Error handling, swap status updates, and retry mechanisms.

**Acceptance Criteria**

* Swaps can be initiated and confirmed on testnet from connected wallet.
* Transaction details match blockchain explorer records.
* Swap status (pending, completed, failed) updates in real time.
* System passes functional QA on at least 20 simulated swaps.

**Proof of Completion**

* Testnet deployment URL demonstrating live swaps.
* GitHub repo with code changes and commit history.
* QA log of test cases with pass/fail results.
* Recorded testnet swap session stored in documentation folder.

***

### **Milestone 4 – Cross-Chain Bridge & Liquidity Routing** (Months 5–6)

**Output**

* Cross-chain bridge integration for target EVM and Cardano-compatible networks.
* Liquidity routing module to find optimal path for swaps.
* Integration with proof relay system (e.g., Wanchain XFlows) for transaction verification.
* Admin tools for managing supported tokens and liquidity sources.

**Acceptance Criteria**

* Successful cross-chain swaps executed between at least two networks in testnet.
* Routing engine selects best liquidity path in under 3 seconds.
* Proof relay verification passes for all test transactions.
* Admin panel updates reflect instantly in swap UI.

**Proof of Completion**

* Public testnet demo of cross-chain swap with routing visualisation.
* Bridge and routing code reviewed and merged into main branch.
* Verification logs from proof relay stored in repository.
* Admin tool walkthrough video recorded.

***

### **Milestone 5 – Final Release & Documentation** (Month 7–8)

**Output**

* Final UI polish, accessibility improvements, and bug fixes.
* Complete user onboarding flow with guide/tooltips.
* Public documentation site with API references and user manual.
* Release build deployed to production environment.

**Acceptance Criteria**

* All known high/medium priority bugs closed.
* User onboarding tested with at least 5 non-technical testers.
* Documentation site passes content review for completeness and clarity.
* Production deployment verified and operational.

**Proof of Completion**

* Production URL with full functionality live.
* GitHub release tag & changelog for v1.0.
* PDF export of full documentation.
* Final project sign-off form signed by stakeholders.
