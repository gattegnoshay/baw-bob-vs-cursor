/**
 * CLIR Underwriter Review Form — Coach View view handler
 */
(function () {
  var root = this.context.element;
  var binding = this.context.binding;
  var options = this.context.options || {};

  function opt(name) {
    try {
      if (options[name] && options[name].get) {
        return options[name].get("value") || {};
      }
    } catch (ignore) {}
    return {};
  }

  function text(selector, value) {
    var node = root.querySelector(selector);
    if (!node) {
      return;
    }
    if (value === undefined || value === null || value === "") {
      node.textContent = "—";
    } else if (typeof value === "boolean") {
      node.textContent = value ? "Yes" : "No";
    } else {
      node.textContent = String(value);
    }
  }

  var customer = opt("customerInfo");
  var risk = opt("riskAssessment");
  var decision = (binding && binding.get) ? (binding.get("value") || {}) : {};

  text('[data-display="customer.customerID"]', customer.customerID);
  text('[data-display="customer.fullName"]', customer.fullName);
  text('[data-display="customer.creditScore"]', customer.creditScore);
  text('[data-display="customer.annualIncome"]', customer.annualIncome);
  text('[data-display="customer.currentLimit"]', customer.currentLimit);
  text('[data-display="customer.requestedIncrease"]', customer.requestedIncrease);

  text('[data-display="risk.riskLevel"]', risk.riskLevel || "HIGH_RISK");
  text('[data-display="risk.autoApproved"]', risk.autoApproved);
  text('[data-display="risk.assessedDate"]', risk.assessedDate);
  text('[data-display="risk.riskReason"]', risk.riskReason);

  function setField(name, value) {
    var input = root.querySelector('[data-field="' + name + '"]');
    if (!input) {
      return;
    }
    input.value = value === undefined || value === null ? "" : String(value);
  }

  setField("status", decision.status);
  setField("approvedAmount", decision.approvedAmount);
  setField("approverComments", decision.approverComments);
  setField("processedBy", decision.processedBy);
}).call(this);
