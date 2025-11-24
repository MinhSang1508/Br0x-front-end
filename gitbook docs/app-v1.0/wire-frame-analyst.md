# Wire-frame analyst

> All wireframes assume a `route_type` field in the quote object and a consistent `swapId`/`orderId` schema. Endpoints referenced are suggestions only.

***

### 1. Landing / Home

**Purpose**: Explain concept, fast CTA to Start Swap, quick stats (TVL, chains supported), trust badges (audits)

**Desktop layout**: Hero (left: heading + CTAs, right: animated diagram of bridgeless flow), below: 3 feature cards (Fast Path, Secure Path, Cardano-first), below: live stats strip.

**Primary CTAs**: \[Start a Swap] (primary) — scrolls to SwapPage, \[View Docs]

**States & Microcopy**:

* Hero headline: "Trustless Bridgeless Swaps — Cardano to the World"
* Subhead: "No wallet connection required for deposits. Fast for small amounts — secure for large settlements."

**API**: none. Static.

**Figma notes**: hero illustration should use layered shapes to animate message flow; export hero as 1440x720 PNG and vector.

***

### 2. Swap Selection Page (SwapPage)

**Purpose**: Choose swap type: Direct (Fast) or Quote (Secure), and quick selection of chain pair.

**Layout (desktop)**

* Left: Mode card toggles — two large cards: "Direct / Fast" and "Quote / Secure"
* Right: Quick pair picker with presets (ADA ↔ ETH, ADA ↔ USDC (Ethereum), ADA ↔ BNB)

**Components**:

* Mode cards show expected ETA, typical fee range, and recommended threshold.
* Quick pair: dropdowns for From chain / To chain, Token pickers with search and balance badges.
* Button: \[Create Direct Swap] or \[Get Quote]

**States**: empty selection, invalid pair (show tooltip), network not supported (show disabled with reason).

**APIs/Calls**: No immediate backend call until the user proceeds.

**Accessibility**: Card toggles are accessible by keyboard — role=button. Screen-reader-friendly microcopy.

***

### 3. Direct Swap — SimpleSwapPage (Fast Path)

**Purpose**: Fast, low-friction swap flow for small amounts. User fills in a simple form and hits Swap. Emphasize speed & fees.

**Desktop layout**

* Left column: Swap Card (From / To selector, amount input, estimated receive, rate, slippage dropdown \[0.5% default], route\_type chip: FAST)
* Right column: Liquidity & price impact micro-insights + live price chart small (sparklines)
* Footer of card: \[Swap Now] (primary) + small text: "No wallet connection required for quote; if sending from a non-custodial wallet, paste destination address on the next step."

**Interactions**

* On click \[Swap Now] → POST `/fast-swap` returns `{orderId, estTime, status: pending}` → navigate to `StatusPage` with orderId
* While awaiting the result, `StatusPage` polls `/status/{orderId}`.

**States**

* Idle: show input & estimate
* Loading: button shows spinner; disable inputs
* Error: toast with actionable message (e.g., "Insufficient liquidity — try a lower amount")
* Completed: show success modal with Tx details, Explorer links

**Developer Notes**

* Client should validate amounts using on-chain liquidity thresholds
* Rate fetch: call `/quote/estimate` for estimate only (GET)

**Figma export assets**: token icons, button states, and small chart thumbnail.

***

### 4. Quote Swap — IndirectSwapPage (Secure Path start)

**Purpose**: Complex quote flow where backend returns a deposit address and swap terms. Suited for higher-value swaps.

**Layout**

* Top: Quote summary card (pair, amountIn, expectedOut, fee breakdown, route\_type=SECURE)
* Middle: Deposit instruction panel with large deposit address block (copy button) and QR code for mobile.
* Right: Timeline preview (steps: Quote created → Deposit detected → Cross-chain relay → Destination swap → Completed) with ETA estimates.

**Interactions**

* `Get Quote` → POST `/quote` → backend returns `{quoteId, depositAddress, amountInExact, expiry, rate, feeBreakdown}`
* Display deposit address and `expiry countdown` (e.g., 15:00)
* If user chooses, they can `Copy deposit info` or `Share link` (deep link containing swapId)

**States**

* Waiting for deposit (DepositPending): show `How to deposit` overlay and explorers
* Underpaid: show red notice with short instructions
* Expired: show CTA `Regenerate quote` or contact support

**Security**

* The deposit address displayed is unique-per-quote (a derived address / ephemeral contract). The producer must show a signature hash to bind the deposit to the quote (a short 12-word preimage display or QR payload).

**Developer Hooks**

* Polling `/status/{quoteId}` for deposit confirmations
* Backend must return required `minConfirmations` per chain (e.g., Cardano: 15) and `requiredDepositAmount` (exact amount) to avoid rounding issues.

***

### 5. Deposit Page (Cardano-specific UTXO instructions)

**Purpose**: Show exact deposit instructions for Cardano users (datum format, exact ADA amount including decimal policy, and special memo/metadata field). Also show offline/cold-wallet flow.

**Desktop layout**

* Left: Large deposit block: Amount, Address, Copy button, QR
* Middle: Step-by-step instructions
  1. Open wallet (Eternl, Lace, Yoroi) or cold storage
  2. Paste deposit address and amount exactly
  3. Confirm transaction. Wait for X confirmations
* Right: support panel with `Contact support` and `Developer guide` link

**Advanced**

* Provide a downloadable `.json` file that contains a Payment URI or CIP-30 compatible payload; user may import into wallet.

**Edge-cases**

* If user pays wrong amount: show `Underpaid` / `Overpaid` flows and auto refund options (policy) with wallet-claim flow.

***

### 6. Status Page (Unified for Fast & Secure)

**Purpose**: Real-time status of swap with full chain-level telemetry and actions (copy tx, open explorer, request refund, retry).

**Top area: Swap summary**

* Pair, amountIn/out, route type badge, swapId, start time, user-provided recipient

**Central: Progress timeline**

* 4–6 steps depending on route. Each step expands to show raw events: tx hash, confirmations, block height, storeman signatures (if secure), relayer id (if fast). Include `copy` per event and `View on explorer`.

**Right/side panel**

* Action buttons: `Request Refund`, `Retry`, `Contact Support (with swapId)`, `Export receipt (JSON)`

**Polling & Websockets**

* Poll `/status/{swapId}` every 2s for pending, 15s for waiting states; optionally upgrade to WebSocket for real-time events.

**Failure modes**

* If cross-chain stuck > configured timeout: show `Escalate` button and generate support ticket with logs.

***

### 7. Transaction History

**Purpose**: Searchable table of past swaps with bulk export and filters.

**Columns**: Date, Pair, AmountIn, AmountOut, RouteType, Status, Actions (View / Retry / Refund)

**Filters**: Date range, status, route type, chain, min/max value

**Row actions**: click row to open `StatusPage`. Support server-side CSV export for large histories.

***

### 8. Liquidity Page

**Purpose**: Manage pools, add/remove liquidity. Supports both EVM and Cardano native pools.

**Layout**

* Pool cards: TVL, APR, your share
* On click Pool -> modal to add/remove liquidity

**EVM flow**

* Connect wallet → check allowance → approve → addLiquidity (onchain) → record tx

**Cardano flow**

* Build tx with datum → prompt wallet signing → submit

**Developer notes**

* For Cardano LP tokens, generate a burn path for withdrawal and map UTXO consumption patterns in UI.

***

### 9. Developer Panel

**Purpose**: Debugging and testing. Export/import swap objects, toggle mocks, admin config.

**Features**

* Swap JSON export/import
* Toggle `MOCK_MODE`
* Change `SECURE_THRESHOLD`
* Resend webhook/replay events

**Security**

* Admin actions require additional authentication (2FA token or admin key)

***

### 10. Settings

**Purpose**: User preferences: theme, language, fiat currency, notifications, wallet management

**Features**

* Manage connected wallets (list + remove)
* Set default destination chain address template
* Set default slippage & expiry

***

### 11. Error & Edge-case screens

* **Underpaid**: show missing amount, next steps
* **Expired quote**: regenerate, show rationale
* **Network congestion**: advise to wait or use secure route (if amount high)

***

### Interaction & API surface (developer-focused)

#### Core endpoints (suggested)

* `POST /quote` → body {fromChain, toChain, tokenIn, amountIn, recipient, preferredRoute?} → returns `{quoteId, depositAddress, amountExact, rate, expiry, route_type, minConfirmations}`
* `POST /fast-swap` → body {fromChain,toChain,tokenIn,amountIn,recipient} → returns `{orderId, status, estTime}`
* `GET /status/{id}` → returns \`{id, status, events:\[{step, chain, txHash, confirmations, meta}
