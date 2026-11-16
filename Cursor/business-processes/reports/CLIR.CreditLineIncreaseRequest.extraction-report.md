# CreditLineIncreaseRequest — Process Extraction Report

**Source:** `IBM_BAW_PDD_Credit_Line_Increase.docx`, Sections 1–5 (Executive Summary, BO Schemas, Process Architecture, Operational Specs, Deployment)
**Context:** CLIR
**Extracted:** 2026-10-04

## Processes identified

| Process | Modeled? | Notes |
|---|---|---|
| Automated Credit Line Increase Request (CLIR) | Yes | Single end-to-end BPD in `CreditLineIncreaseRequest.zip` |
| Deployment automation | Supporting artifact | `business-processes/deployment/deploy-clir-snapshot.ps1` (not a BPD) |

## Extraction decisions

| Document said | Modeling decision |
|---|---|
| ASCII diagram showed only LOW_RISK / HIGH_RISK | Added **AUTO_REJECT** branch from Rule Logic 1 (`creditScore < 650`) |
| Core Banking only on LOW_RISK path in ASCII | Underwriter **Approved** also calls **Update Credit Limit** (same service task merge) so sanctioned limits reach Core Banking |
| Underwriter Approved/Rejected both merge to Audit | Kept shared **Dispatch Audit Log**, then **Final Outcome?** gateway to named end events |
| SLA timer 24h → Manager Escalation Notification Email | Non-interrupting timer boundary on Underwriter task → **Manager Escalation Notify** → End Escalated |
| Step 2 “Server Script / Decision Service Flow” | Modeled as `serviceTask` **Risk Assessment Engine**; logic in `scripts/RiskAssessmentEngine.js` |
| Step 3 OpenAPI REST | Modeled as `serviceTask` **Update Credit Limit** + `integrations/core-banking-limits-update.openapi.yaml` |
| No error handling specified for REST | Added interrupting **error boundary** on Update Credit Limit → audit → Integration-Error end |
| BO fields only as listed | Added `status` / `assessedDate` / `processedDate` for lifecycle and audit completeness |

## Assumptions

- Underwriter approval updates Core Banking via the same REST call as auto-approval (`Update Credit Limit`).
- Escalation path ends at **Escalated** without forcing Core Banking update; underwriter task may still complete afterward (non-interrupting timer).
- `ApprovalDecision.status` extended with `ESCALATED` and `INTEGRATION_ERROR` for gateway routing (beyond PDD’s APPROVED / REJECTED / PENDING_UNDERWRITER).
- Customer/Agent is one human role covering CSR and self-service portal initiator.
- Team binding `Underwriter_Group` must be assigned in Process Designer after import.

## Out of scope / deferred

- Live TWX snapshot export/import against a real BAW server (needs credentials + running Process Center).
- Coach view pixel design (CSHS generated on import; customize controls/validation in WebPD).
- Production Core Banking URL/credentials and environment-specific EPVs.
