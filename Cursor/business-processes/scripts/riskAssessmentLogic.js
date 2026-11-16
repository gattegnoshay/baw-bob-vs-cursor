/**
 * Pure risk-rule logic extracted from PDD Step 2 for offline validation.
 * Mirrors RiskAssessmentEngine.js without BAW tw.local dependencies.
 */
function assessRisk(customer) {
  var creditScore = customer.creditScore;
  var annualIncome = customer.annualIncome;
  var currentLimit = customer.currentLimit;
  var requestedIncrease = customer.requestedIncrease;

  if (creditScore < 650) {
    return {
      riskLevel: "AUTO_REJECT",
      autoApproved: false,
      riskReason: "Credit score below minimum threshold",
      decisionStatus: "REJECTED",
      approvedAmount: currentLimit
    };
  }
  if (currentLimit > annualIncome * 0.5) {
    return {
      riskLevel: "HIGH_RISK",
      autoApproved: false,
      riskReason: "High exposure ratio",
      decisionStatus: "PENDING_UNDERWRITER",
      approvedAmount: null
    };
  }
  if (requestedIncrease > (annualIncome + currentLimit) * 0.3) {
    return {
      riskLevel: "HIGH_RISK",
      autoApproved: false,
      riskReason: "Requested increase exceeds 30% financial capacity",
      decisionStatus: "PENDING_UNDERWRITER",
      approvedAmount: null
    };
  }
  return {
    riskLevel: "LOW_RISK",
    autoApproved: true,
    riskReason: "Passed automated risk checks",
    decisionStatus: "APPROVED",
    approvedAmount: requestedIncrease
  };
}

module.exports = { assessRisk };
