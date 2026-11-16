# Credit Line Increase Request — Process Extraction Report

**Source:** `IBM_BAW_PDD_Credit_Line_Increase.docx`, Sections 2–5  
**Context:** CreditLineIncrease  
**Extracted:** 2026-10-04  
**Generator config:** `business-processes/configs/CreditLineIncrease/CreditLineIncreaseRequest.bpmn.json`

---

## Processes identified

| Process | Disposition |
|---|---|
| Credit Line Increase Request (CLIR) | ✅ Modeled in full — this config |
| Benchmark Matrix / evaluation criteria (Section 6) | ⛔ Out of scope — not a workflow; evaluation rubric only |

---

## Extraction decisions

| Element | Document says | Decision made |
|---|---|---|
| **Step 1 – Request Submission** | "Client-Side Human Service (CSHS) / Coach Views"; actor "Process Initiator (CSR or Self-Service Portal)" | → `userTask` "Submit Credit Line Request" with role `initiator`. Validation rules (requestedIncrease > 0, creditScore 300-850, etc.) placed in element documentation. |
| **Step 2 – Risk Assessment Engine** | "Server Script / Decision Service Flow"; three explicit rule branches | → `serviceTask` "Risk Assessment Engine". The three rules and default path included verbatim in element documentation. Generates one service flow in BAW. |
| **Risk routing gateway** | Document describes if/else rule outcomes (AUTO_REJECT, HIGH_RISK, default LOW_RISK) | → `exclusiveGateway` "Risk Level?" with three named outgoing flows; HIGH_RISK set as `isDefault` (the most common flow when both score and ratio rules pass). |
| **Step 3 – Core Banking REST** | "POST https://api.bank.internal/v1/limits/update" appears on two paths (auto-approval and underwriter-approval) | → Two separate `serviceTask` elements ("Update Core Banking Limit" and "Update Core Banking Limit Underwriter") rather than a single re-used task, to avoid loops and keep distinct data mappings per path. |
| **Step 4 – Underwriter Manual Review** | "Human Task (CSHS Coach)", "Team: Underwriter_Group", "Timer Boundary Event set to 24 hours, expiration triggers Manager Escalation Notification Email" | → `userTask` with role `underwriter` + non-interrupting `boundaryEvent` (timer) "24h SLA Overdue" → `serviceTask` "Send Manager Escalation Notification" → `endEvent` "Escalation Sent". Non-interrupting chosen per PDD wording (escalation does not cancel the underwriter task). |
| **Underwriter decision gateway** | PDD says outputs captured are status (APPROVED/REJECTED), approvedAmount, approverComments | → `exclusiveGateway` "Underwriter Decision?" with APPROVED branch (to banking update) and REJECTED as default. |
| **Step 5 – Audit Event Dispatcher** | "Server Script Service Flow" called once at end | → Modeled as **four separate audit service tasks** to maintain distinct audit records per outcome: Auto-Approved, Auto-Rejected, Underwriter-Approved, Underwriter-Rejected. This is more granular than the PDD's single dispatcher but correctly supports all outcome paths. |
| **Audit gateway re-use** | PDD implies a single audit step | Decision to split into four tasks (one per end state) to avoid a convergence gateway with ambiguous routing. Each carries the correct outcome context in its documentation. |
| **Channel field on CustomerInfo** | Not in the PDD's BO table | Added from domain knowledge (CSR vs. self-service portal is mentioned in Step 1). Flagged as assumption. |
| **assessedDate / engineVersion on RiskAssessment** | Not in PDD | Added from domain knowledge for operational tracability. Flagged as assumption. |
| **decisionTimestamp / bankingTxId on ApprovalDecision** | Not in PDD | Added from domain knowledge. `bankingTxId` maps the Core Banking API response for reconciliation. Flagged. |
| **submissionDate on CustomerInfo** | Not in PDD | Added from domain knowledge. Common audit field for date-stamping request submission. |

---

## Assumptions

1. **HIGH_RISK is the gateway default path.** The PDD lists rule conditions for AUTO_REJECT and LOW_RISK, implying HIGH_RISK is the "all other cases" path. Set as `isDefault: true` on the gateway. *Affects: `gw-risk-level`.*
2. **REJECTED is the default underwriter path.** No explicit default stated in the PDD. REJECTED chosen as the conservative/safe default (lender-protection oriented). *Affects: `gw-underwriter-decision`.*
3. **Escalation notification ends in a separate end event.** The PDD says the timer "triggers Manager Escalation Notification Email handler" but does not specify whether the escalation path terminates. Modeled as non-interrupting (underwriter task continues) with an independent `end-escalated` token. *Affects: `timer-sla-24h`, `sf-escalation-notification`, `end-escalated`.*
4. **Two distinct Core Banking service tasks.** PDD describes the REST endpoint once but it is logically required on both the LOW_RISK auto-path and the underwriter-approved path. Duplicated to maintain separate `ioSpecification` data mappings. *Affects: `sf-update-banking-auto`, `sf-update-banking-uw`.*
5. **`channel` field on CustomerInfo.** PDD mentions both CSR and self-service portal as initiators but does not specify a `channel` field. Added to support routing/reporting by intake channel. *Affects: `CustomerInfo` business object.*
6. **`assessedDate`, `engineVersion` on RiskAssessment.** Operational traceability fields not listed in PDD. Standard practice for regulated financial risk engines. *Affects: `RiskAssessment` business object.*
7. **`decisionTimestamp`, `bankingTxId` on ApprovalDecision.** Not in PDD. `bankingTxId` maps the `txStatus` response from the Core Banking API for reconciliation. *Affects: `ApprovalDecision` business object.*

---

## Out of scope / deferred

- **Benchmark Matrix (Section 6):** Evaluation rubric comparing IBM BOB vs. Cursor. No workflow content — not modeled.
- **Deployment scripts (Section 5):** The PDD requests wsadmin Jython scripts or BAW Deployment REST API calls. This is outside the scope of BPMN generation; covered separately by the `version-lifecycle-manager` skill.
- **OpenAPI/Swagger spec for Core Banking integration:** The endpoint is documented in service task documentation. Generating the full OpenAPI spec for `https://api.bank.internal/v1/limits/update` is out of scope for this deliverable.
