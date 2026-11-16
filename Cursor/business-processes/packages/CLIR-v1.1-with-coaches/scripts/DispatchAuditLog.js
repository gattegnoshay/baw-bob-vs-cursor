/**
 * CLIR — Dispatch Audit Log (BAW Server Script)
 * Paste into the "Dispatch Audit Log" service flow after BPMN import.
 */
(function () {
  var customer = tw.local.customerInfo;
  var risk = tw.local.riskAssessment;
  var decision = tw.local.approvalDecision;

  var payload = {
    timestamp: new Date().toISOString(),
    processInstanceId: (typeof tw.system !== "undefined" && tw.system.process)
      ? String(tw.system.process.instanceId)
      : null,
    customerID: customer != null ? customer.customerID : null,
    riskLevel: risk != null ? risk.riskLevel : null,
    riskReason: risk != null ? risk.riskReason : null,
    decisionStatus: decision != null ? decision.status : null,
    approvedAmount: decision != null ? decision.approvedAmount : null,
    processedBy: decision != null ? decision.processedBy : null
  };

  var auditJson = JSON.stringify(payload);
  log.info("CLIR_AUDIT " + auditJson);

  // Optional: assign to a process variable if you add tw.local.auditPayload (String)
  // tw.local.auditPayload = auditJson;

  if (customer != null && customer.status !== "ESCALATED") {
    customer.status = "COMPLETED";
  }
})();
