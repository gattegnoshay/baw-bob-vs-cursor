# CLIR v1.1 — Credit Line Increase Request (with Coach Views)

Unified deploy package: process + business objects + Coach View UI components.

## Package contents

| Path | What it is |
|---|---|
| `bpmn/CreditLineIncreaseRequest.zip` | **Import this first** into BAW |
| `business-objects/*.json` | Optional WebPD BO OpenAPI import |
| `coaches/coach-views/CLIR_CustomerInfoForm` | Submit UI Coach View |
| `coaches/coach-views/CLIR_UnderwriterReviewForm` | Underwriter UI Coach View |
| `coaches/cshs/*.cshs.json` | CSHS ↔ Coach View bindings |
| `configs/CLIR.workflow-coaches.manifest.json` | Task → Coach View map |
| `scripts/` | Risk Assessment + Audit server scripts |
| `integrations/` | Core Banking OpenAPI |
| `deployment/` | Snapshot activate PowerShell |

## Workflow ↔ Coach mapping

| Human task | Coach View | Binding |
|---|---|---|
| Submit Credit Line Increase Request | **CLIR Customer Info Form** | `tw.local.customerInfo` |
| Underwriter Manual Review | **CLIR Underwriter Review Form** | `tw.local.approvalDecision` (+ customer/risk config) |

## Install sequence

### 1. Import the process

1. Workflow Center → **Import Process App** (or WebPD File → Import)
2. Select `bpmn/CreditLineIncreaseRequest.zip`
3. Confirm process app acronym **CLIR** and snapshot **1.1**

BAW creates the BPD, service-flow shells, and default CSHS shells for both user tasks.

### 2. Create the Coach Views (UI components)

For each folder under `coaches/coach-views/`:

1. In CLIR → **New Coach View**
2. Name it exactly:
   - `CLIR Customer Info Form`
   - `CLIR Underwriter Review Form`
3. Set **data binding** type from `coach-view.definition.json`
4. Add config options listed in that file
5. Paste:
   - Layout / Custom HTML ← `content.html`
   - CSS ← `styles.css`
   - Event handlers ← `handlers/load.js`, `view.js`, `change.js`, `validate.js`

Preview locally first if needed: open each component’s `preview.html`.

### 3. Wire coaches into the CSHS shells

1. Open CSHS **Submit Credit Line Increase Request**
2. Clear the default coach layout (or keep a Button for OK)
3. Drop **CLIR Customer Info Form** onto the coach
4. Bind it to `tw.local.customerInfo`
5. Wire Submit / OK boundary event after validate returns empty

Then:

1. Open CSHS **Underwriter Manual Review**
2. Drop **CLIR Underwriter Review Form**
3. Bind to `tw.local.approvalDecision`
4. Config-bind:
   - `customerInfo` → `tw.local.customerInfo`
   - `riskAssessment` → `tw.local.riskAssessment`
5. Wire Complete / OK boundary event

See also `coaches/cshs/*.cshs.json` for the intended structure.

### 4. Finish automation

1. Paste `scripts/RiskAssessmentEngine.js` into **Risk Assessment Engine** service flow
2. Paste `scripts/DispatchAuditLog.js` into **Dispatch Audit Log**
3. Import/bind Core Banking from `integrations/core-banking-limits-update.openapi.yaml`
4. Set underwriter timer to **PT24H**, assign **Underwriter_Group**
5. Finalize gateway conditions; run BAW validation

### 5. Optional BO re-import

If you prefer WebPD OpenAPI BOs over the XSD-in-zip path:

**Data → Import business objects** → `business-objects/clir-credit-line-increase-business-objects.json`

## Preview without BAW

- `coaches/coach-views/CLIR_CustomerInfoForm/preview.html`
- `coaches/coach-views/CLIR_UnderwriterReviewForm/preview.html`
