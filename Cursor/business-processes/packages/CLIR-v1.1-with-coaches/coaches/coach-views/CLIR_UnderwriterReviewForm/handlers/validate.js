/**
 * CLIR Underwriter Review Form — Coach View validate handler
 */
(function () {
  var root = this.context.element;
  var binding = this.context.binding;
  var options = this.context.options || {};
  var data = (binding && binding.get) ? (binding.get("value") || {}) : {};
  var errors = [];

  function customer() {
    try {
      if (options.customerInfo && options.customerInfo.get) {
        return options.customerInfo.get("value") || {};
      }
    } catch (ignore) {}
    return {};
  }

  function mark(name, invalid) {
    var input = root.querySelector('[data-field="' + name + '"]');
    if (!input) {
      return;
    }
    if (invalid) {
      input.className = (input.className || "").replace(/\bis-invalid\b/g, "") + " is-invalid";
    } else {
      input.className = (input.className || "").replace(/\bis-invalid\b/g, "").replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "");
    }
  }

  function blank(v) {
    return v === undefined || v === null || String(v).replace(/^\s+|\s+$/g, "") === "";
  }

  var status = String(data.status || "").toUpperCase();
  mark("status", status !== "APPROVED" && status !== "REJECTED");
  mark("approverComments", blank(data.approverComments));
  mark("processedBy", blank(data.processedBy));
  mark("approvedAmount", false);

  if (status !== "APPROVED" && status !== "REJECTED") {
    errors.push("Decision must be APPROVED or REJECTED.");
  }
  if (blank(data.approverComments)) {
    errors.push("Approver comments are required.");
  }
  if (blank(data.processedBy)) {
    errors.push("Processed By is required.");
  }

  if (status === "APPROVED") {
    var approvedAmount = Number(data.approvedAmount);
    var currentLimit = Number(customer().currentLimit);
    if (isNaN(approvedAmount)) {
      errors.push("Approved amount is required when the decision is APPROVED.");
      mark("approvedAmount", true);
    } else if (!isNaN(currentLimit) && !(approvedAmount > currentLimit)) {
      errors.push("Approved amount must be greater than the current credit limit.");
      mark("approvedAmount", true);
    }
  }

  var message = errors.join(" ");
  var banner = root.querySelector('[data-role="errors"]');
  if (banner) {
    if (message) {
      banner.hidden = false;
      banner.textContent = message;
    } else {
      banner.hidden = true;
      banner.textContent = "";
    }
  }
  return message;
}).call(this);
