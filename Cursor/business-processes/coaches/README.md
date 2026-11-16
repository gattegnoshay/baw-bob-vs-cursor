# CLIR Coaches (CSHS) — Install Guide

Client-Side Human Service coach artifacts for the **Credit Line Increase Request** process.

## Coach View UI components (start here)

Reusable Coach View components with full HTML/CSS + BAW lifecycle handlers live in:

**`coach-views/`**

| Component | Preview |
|---|---|
| `CLIR_CustomerInfoForm` | open `coach-views/CLIR_CustomerInfoForm/preview.html` |
| `CLIR_UnderwriterReviewForm` | open `coach-views/CLIR_UnderwriterReviewForm/preview.html` |

See `coach-views/README.md` for WebPD Coach View creation steps.

## What this environment supports

| Capability | Status |
|---|---|
| BPMN import → auto-generated CSHS shells | Yes (`generate-baw-bpmn`) |
| Coach View UI components (HTML/CSS/handlers) | **Yes (`coach-views/`)** |
| Coach field specs + validation JS | Yes (per-task folders) |
| `create-baw-coach` / `create-baw-widget` skills | **Not installed** (referenced only) |
| Binary `.twx` with System Data control UUIDs | **Not generated** (needs live Process Center export) |

Recommended path: import the process BPMN, create the two Coach Views from `coach-views/`, then drop them onto the generated CSHS coaches.

## Files

```
business-processes/coaches/
├── README.md                          ← this file
├── CLIR.coaches.manifest.json         ← index of both coaches
├── CLIR.coach-tests.json              ← manual coach test assertions
├── cshs/
│   ├── SubmitCreditLineIncreaseRequest.cshs.json
│   └── UnderwriterManualReview.cshs.json
├── submit-credit-line-increase-request/
│   ├── coach.spec.json
│   ├── validate.js                    ← PDD validations
│   ├── on-load.js
│   ├── before-complete.js             ← status = SUBMITTED
│   ├── layout.html                    ← optional Custom HTML
│   └── coach.css
└── underwriter-manual-review/
    ├── coach.spec.json
    ├── validate.js
    ├── on-load.js                     ← prefills processedBy
    ├── before-complete.js
    ├── layout.html
    └── coach.css
```

## Install into BAW WebPD

### Prerequisites

1. Business Objects imported: `CustomerInfo`, `RiskAssessment`, `ApprovalDecision`.
2. Process **Credit Line Increase Request** imported (BPMN zip) so CSHS shells exist for the two user tasks.
3. Process variables mapped: `customerInfo`, `riskAssessment`, `approvalDecision`.

### Coach 1 — Submit Credit Line Increase Request

1. Open Process App **CLIR** → Client-Side Human Service for **Submit Credit Line Increase Request**.
2. Open the generated Coach.
3. Add / bind stock controls from `submit-credit-line-increase-request/coach.spec.json`:

   | Control | Binding |
   |---|---|
   | Text | `tw.local.customerInfo.customerID` |
   | Text | `tw.local.customerInfo.fullName` |
   | Integer | `tw.local.customerInfo.creditScore` |
   | Decimal | `tw.local.customerInfo.annualIncome` |
   | Decimal | `tw.local.customerInfo.currentLimit` |
   | Decimal | `tw.local.customerInfo.requestedIncrease` |

4. Add a **Custom HTML** (or Script) coach view for lifecycle scripts:
   - **load** → paste `on-load.js`
   - **validate** → paste `validate.js`
   - Submit / OK click (after validate passes) → paste `before-complete.js`
5. Wire the primary button to the **OK** boundary event; only fire OK when `validate.js` returns `""`.
6. Optional: use `layout.html` + `coach.css` instead of individual stock controls.

**Validations (PDD):**

- `annualIncome > 0`
- `requestedIncrease > currentLimit`
- Plus BO guard: `creditScore` in `300..850`
- On success: `customerInfo.status = "SUBMITTED"`

### Coach 2 — Underwriter Manual Review

1. Open the CSHS for **Underwriter Manual Review**.
2. Ensure the human service receives `customerInfo`, `riskAssessment`, and `approvalDecision`.
3. Build three sections from `underwriter-manual-review/coach.spec.json`:
   - **Customer Information** — Output Text, all `customerInfo.*` fields, read-only
   - **Risk Assessment** — Output Text, all `riskAssessment.*` fields, read-only
   - **Underwriter Decision** — editable:
     - Single Select → `approvalDecision.status` (`APPROVED` / `REJECTED`)
     - Decimal → `approvalDecision.approvedAmount`
     - Text Area → `approvalDecision.approverComments`
     - Text → `approvalDecision.processedBy`
4. Paste scripts:
   - **load** → `on-load.js` (prefills `processedBy` from `tw.system.user`)
   - **validate** → `validate.js`
   - Complete Review → `before-complete.js` (stamps `processedDate`, sets `customerInfo.status = "IN_REVIEW"`)
5. Confirm team assignment on the BPD activity is **Underwriter_Group** (SLA timer stays on the BPD boundary).

## Quick validation smoke tests

Use cases in `CLIR.coach-tests.json`, or manually:

1. Submit with `annualIncome = 0` → blocked.
2. Submit with `requestedIncrease = currentLimit` → blocked.
3. Submit valid data → completes; `status = SUBMITTED`.
4. Underwriter with blank decision → blocked.
5. Underwriter `APPROVED` without amount → blocked.
6. Underwriter `REJECTED` with comments + processedBy → completes.

## Limitations

- These artifacts are **paste-ready**, not a drop-in `.twx` coach package. IBM does not publish a public schema for inventing stock-control UUIDs offline.
- Custom HTML `data-binding` attributes are documentation aids; WebPD Custom HTML views still need their bindings/script wiring configured in the designer.
- `tw.system.user.id` / `userName` availability depends on runtime authentication context (may be empty in coach preview).
- Do **not** re-import the full BPMN zip solely for coaches — that can duplicate the process. Edit the existing generated CSHS instead.
- Risk-engine rules (`creditScore < 650`, exposure ratios) remain server-side in `Risk Assessment Engine`; coaches only enforce submission/underwriter UI rules from the PDD.
