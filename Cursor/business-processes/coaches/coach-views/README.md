# CLIR Coach View Components

Reusable **Coach View** UI components for the Credit Line Increase Request process.

## Components

| Component | Binding | Used by |
|---|---|---|
| `CLIR_CustomerInfoForm` | `CustomerInfo` | Submit Credit Line Increase Request CSHS |
| `CLIR_UnderwriterReviewForm` | `ApprovalDecision` (+ config: `customerInfo`, `riskAssessment`) | Underwriter Manual Review CSHS |

Each component includes:

- `content.html` — UI markup
- `styles.css` — component styles (no inline `style=` attributes)
- `handlers/load.js|view.js|change.js|validate.js` — BAW Coach View lifecycle
- `coach-view.definition.json` — binding/config metadata
- `preview.html` — interactive browser preview (mock BAW context)

## Preview now

Open in a browser:

- `CLIR_CustomerInfoForm/preview.html`
- `CLIR_UnderwriterReviewForm/preview.html`

## Install into BAW WebPD (Coach View)

For each component:

1. In Process App **CLIR**, create **Coach View** → name it exactly as in the definition JSON.
2. **Variables**
   - Data binding type = component binding (`CustomerInfo` or `ApprovalDecision`)
   - Add config options from `coach-view.definition.json`
3. **Layout** → add a **Custom HTML** item (or Inline HTML content depending on your BAW version) and paste `content.html`
4. **CSS** tab → paste `styles.css`
5. **Behavior → Event Handlers**
   - `load` → `handlers/load.js`
   - `view` → `handlers/view.js`
   - `change` → `handlers/change.js`
   - `validate` → `handlers/validate.js`
6. Open the generated CSHS coach for the human task and **drop the Coach View** onto the coach layout:
   - Submit coach → bind to `tw.local.customerInfo`
   - Underwriter coach → bind to `tw.local.approvalDecision`, config-bind `customerInfo` / `riskAssessment`
7. Wire the component’s primary button (or a stock Button) to the CSHS **OK** boundary event after validate returns `""`.

## Why not a binary .twx?

BAW Coach Views reference System Data / Coaches toolkit control UUIDs that are environment-specific. This package ships the full UI component source that WebPD consumes. After you create the Coach Views once, export a snapshot `.twx` from your server if you need a binary redistribute.
