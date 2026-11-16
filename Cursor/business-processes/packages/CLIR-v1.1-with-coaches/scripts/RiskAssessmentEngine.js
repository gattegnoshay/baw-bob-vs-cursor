/**
 * CLIR — Risk Assessment Engine (BAW Server Script)
 * Paste into the "Risk Assessment Engine" service flow after BPMN import.
 *
 * Inputs:  tw.local.customerInfo
 * Outputs: tw.local.riskAssessment, tw.local.approvalDecision
 */
(function () {
  var customer = tw.local.customerInfo;
  var risk = tw.local.riskAssessment;
  var decision = tw.local.approvalDecision;

  if (risk == null) {
    risk = new tw.object.RiskAssessment();
    tw.local.riskAssessment = risk;
  }
  if (decision == null) {
    decision = new tw.object.ApprovalDecision();
    tw.local.approvalDecision = decision;
  }

  var creditScore = customer.creditScore;
  var annualIncome = customer.annualIncome;
  var currentLimit = customer.currentLimit;
  var requestedIncrease = customer.requestedIncrease;

  risk.assessedDate = new Date();
  risk.status = "COMPLETE";
  decision.processedDate = new Date();
  decision.processedBy = "SYSTEM_RISK_ENGINE";
  customer.status = "IN_REVIEW";

  // Rule 1 — credit score below minimum
  if (creditScore < 650) {
    risk.riskLevel = "AUTO_REJECT";
    risk.autoApproved = false;
    risk.riskReason = "Credit score below minimum threshold";
    decision.status = "REJECTED";
    decision.approvedAmount = currentLimit;
    decision.approverComments = risk.riskReason;
    return;
  }

  // Rule 2 — high exposure ratio
  if (currentLimit > annualIncome * 0.5) {
    risk.riskLevel = "HIGH_RISK";
    risk.autoApproved = false;
    risk.riskReason = "High exposure ratio";
    decision.status = "PENDING_UNDERWRITER";
    decision.approvedAmount = null;
    decision.approverComments = risk.riskReason;
    return;
  }

  // Rule 3 — requested increase exceeds 30% financial capacity
  if (requestedIncrease > (annualIncome + currentLimit) * 0.3) {
    risk.riskLevel = "HIGH_RISK";
    risk.autoApproved = false;
    risk.riskReason = "Requested increase exceeds 30% financial capacity";
    decision.status = "PENDING_UNDERWRITER";
    decision.approvedAmount = null;
    decision.approverComments = risk.riskReason;
    return;
  }

  // Default — low risk auto-approve
  risk.riskLevel = "LOW_RISK";
  risk.autoApproved = true;
  risk.riskReason = "Passed automated risk checks";
  decision.status = "APPROVED";
  decision.approvedAmount = requestedIncrease;
  decision.approverComments = risk.riskReason;
})();
