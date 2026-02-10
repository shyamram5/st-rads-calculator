# ST-RADS Calculator

A clinical decision-support web app that guides radiologists through the **ACR Soft Tissue Reporting and Data System (ST-RADS) v2025** framework. Users answer a step-by-step wizard based on MRI findings; the app returns a deterministic ST-RADS category (0–6), risk level, management guidance, and differential diagnoses. The frontend is built with **React + Vite**, uses the **Base44** SDK for auth and backend, and relies on **Deno** serverless functions for Stripe payments and analytics.

## What is ST-RADS?

ST-RADS (Chhabra et al., *AJR* 2025) standardizes reporting and risk stratification for soft-tissue tumors and tumor-like lesions on MRI. The calculator implements the official flowcharts (Figures 1, 2A, 2B, 2C, 2D) so users can:

- Classify lesions as **Incomplete (0)**, **Negative (1)**, **Definitely Benign (2)**, **Probably Benign (3)**, **Suspicious (4)**, **Highly Suggestive of Malignancy (5)**, or **Known Tumor (6A/6B/6C)**
- Get **management recommendations** and **differential diagnoses**
- Optionally apply **ADC** and **ancillary feature** modifiers

## Features

- **Interactive wizard** — Step-by-step questions driven by exam adequacy, lesion presence, tissue type (lipomatous, cyst-like, indeterminate solid), and anatomic compartment. Steps and options are defined in `wizardSteps.jsx` and follow the published flowcharts.
- **Deterministic rule engine** — `stradsRuleEngine.jsx` encodes the full ST-RADS logic (lipomatous, cyst-like, intravascular, intraarticular, intraneural, cutaneous, deep, tendon, fascial, subungual). Supports optional ADC and ancillary-feature modifiers.
- **Structured result** — Category, risk, meaning, management, differentials, and optional ADC/ancillary notes; one-click copy for reports.
- **Education** — In-app education sidebar (`EducationSidebar.jsx`), category guide, glossary, and literature references.
- **Auth & usage** — Base44 auth; free tier (5 analyses), then Premium (Stripe subscription) for unlimited use.
- **Case examples** — Browsable case library and case review flow.

## Overview

| Layer | Technology | Entry / Key paths |
|-------|------------|-------------------|
| **Frontend** | Vite + React | `src/main.jsx` → `src/App.jsx` |
| **Routing** | React Router | `src/pages.config.js` (pages + Layout), `src/App.jsx` (routes) |
| **Auth** | Base44 SDK | `src/lib/AuthContext.jsx`, `src/api/base44Client.js` |
| **Calculator** | Wizard + rule engine | `src/pages/Calculator.jsx`, `src/components/calculator/` |
| **Serverless** | Deno | `functions/` (Stripe checkout, webhook, cancel, stats, delete account) |

## Requirements

- Node.js 16+ (or latest LTS)
- npm (or yarn / pnpm)
- Deno (for running the files in the [functions/](functions/) folder)

## Quick Start — Frontend

### 1. Install dependencies

```sh
npm install
```

### 2. Environment variables

Create a `.env` file at the project root. Vite exposes only variables prefixed with `VITE_` to the client.

```env
VITE_BASE44_APP_ID=your_app_id_here
VITE_BASE44_BACKEND_URL=https://api.base44.example
VITE_BASE44_TOKEN=your_optional_token
```

### 3. Run the dev server

```sh
npm run dev
```

Open the URL printed by Vite (e.g. http://localhost:5173).

## Build & Preview

```sh
npm run build
npm run preview
```

## Source Code Structure

### Frontend (`src/`)

| Path | Purpose |
|------|--------|
| `main.jsx` | App entry; mounts root with React 18. |
| `App.jsx` | Root shell: `AuthProvider`, `QueryClientProvider`, `Router`, `NavigationTracker`, `AuthenticatedApp` (routes + auth handling), `Toaster`, `VisualEditAgent`. |
| `Layout.jsx` | Shared layout (nav, etc.) wrapping page content. |
| `pages.config.js` | Page registry and `mainPage`; imports all pages and `Layout`. |

**Pages** (`src/pages/`): `Home`, `Calculator`, `CaseExamples`, `CaseReview`, `About`, `Account`, `Billing`, `Premium`, `PaymentSuccess`, `PaymentCancel`, `Support`.

**Calculator** (`src/components/calculator/`):

- `wizardSteps.jsx` — Builds the step list and questions from `caseData` (exam adequacy → known tumor → lesion → tissue type → compartment-specific questions → optional ADC/ancillary).
- `stradsRuleEngine.jsx` — Pure ST-RADS logic: `calculateSTRADS(caseData)`, `applyADCModifier`, `applyAncillaryModifier`; implements Figures 1, 2A–2D and category metadata.
- `WizardStep.jsx` — Renders one step (title, description, questions).
- `ResultPanel.jsx` — Displays category, reasoning, differentials, management; copy report.
- `EducationSidebar.jsx`, `CategoryGuide.jsx`, `GlossaryPanel.jsx`, `LiteratureReferences.jsx` — Education content.

**API & data** (`src/api/`): `base44Client.js` (Base44 client from `app-params`), `entities.js`, `integrations.js`.

**App state & lib** (`src/lib/`): `AuthContext.jsx`, `app-params.js`, `NavigationTracker.jsx`, `PageNotFound.jsx`, `query-client.js`, `utils.js`, `VisualEditAgent.jsx`.

**UI** (`src/components/ui/`) — shadcn-style components (e.g. button, card, dialog, form, tabs, toast). Other shared components: `User.jsx`, `UserNotRegisteredError.jsx`, `PremiumUpgrade.jsx`, `StructuredReport.jsx`, `FeedbackSection.jsx`, etc.

### Serverless functions (`functions/`)

Deno-based HTTP handlers for auth-aware backend work:

| File | Purpose |
|------|--------|
| `createCheckoutSession.ts` | Creates a Stripe Checkout session for Premium subscription; redirects to success/cancel URLs. |
| `stripeWebhook.ts` | Handles Stripe webhooks (e.g. subscription lifecycle, payment events). |
| `cancelSubscription.ts` | Cancels the current user’s subscription. |
| `getStats.ts` | Returns user-facing analytics/usage stats. |
| `deleteAccount.ts` | Deletes or anonymizes user account data. |

**Running functions locally (Deno):**

```sh
export STRIPE_API_KEY=sk_test_xxx
export STRIPE_WEBHOOK_SECRET=whsec_xxx
export VITE_BASE44_BACKEND_URL=https://api.base44.example

deno run --allow-net --allow-env --allow-read functions/createCheckoutSession.ts
deno run --allow-net --allow-env --allow-read functions/getStats.ts
deno run --allow-net --allow-env --allow-read functions/stripeWebhook.ts
# etc.
```

Each function typically starts an HTTP server; see the file for port and request shape.

## Key config files

- `vite.config.js` — Vite and aliases (e.g. `@/`).
- `tailwind.config.js` / PostCSS — Tailwind CSS.
- `components.json` — shadcn component config.
- `package.json` — Scripts: `dev`, `build`, `preview`, `lint`, `typecheck`.

## Troubleshooting

- **Base44** — Confirm `VITE_BASE44_*` in `src/lib/app-params.js` and that `src/api/base44Client.js` uses the same config. Ensure backend URL and credentials are correct.
- **Stripe** — Set `STRIPE_API_KEY` and `STRIPE_WEBHOOK_SECRET` when running payment-related functions.
- **Deno** — Use `--allow-net`, `--allow-env`, and `--allow-read` as needed.
- **Full flow** — Run the Vite dev server and the required Deno functions in separate terminals to test auth, calculator, and payments end-to-end.

## License

See the project repository for license information.
