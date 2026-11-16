/**
 * CLIR Customer Info Form — Coach View validate handler
 * Paste into Behavior > Event Handlers > validate
 * Returns "" when valid; otherwise an error string (BAW convention).
 */
(function () {
  var root = this.context.element;
  var binding = this.context.binding;
  var data = (binding && binding.get) ? (binding.get("value") || {}) : {};
  var errors = [];

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

  mark("customerID", blank(data.customerID));
  mark("fullName", blank(data.fullName));
  mark("creditScore", data.creditScore === undefined || data.creditScore === null || isNaN(Number(data.creditScore)));
  mark("annualIncome", data.annualIncome === undefined || data.annualIncome === null || isNaN(Number(data.annualIncome)));
  mark("currentLimit", data.currentLimit === undefined || data.currentLimit === null || isNaN(Number(data.currentLimit)));
  mark("requestedIncrease", data.requestedIncrease === undefined || data.requestedIncrease === null || isNaN(Number(data.requestedIncrease)));

  if (blank(data.customerID)) {
    errors.push("Customer ID is required.");
  }
  if (blank(data.fullName)) {
    errors.push("Full name is required.");
  }

  var score = Number(data.creditScore);
  if (isNaN(score)) {
    errors.push("Credit score is required.");
  } else if (score < 300 || score > 850) {
    errors.push("Credit score must be between 300 and 850.");
    mark("creditScore", true);
  }

  var income = Number(data.annualIncome);
  if (isNaN(income)) {
    errors.push("Annual income is required.");
  } else if (!(income > 0)) {
    errors.push("Annual income must be greater than 0.");
    mark("annualIncome", true);
  }

  var current = Number(data.currentLimit);
  if (isNaN(current)) {
    errors.push("Current credit limit is required.");
  }

  var requested = Number(data.requestedIncrease);
  if (isNaN(requested)) {
    errors.push("Requested credit limit is required.");
  } else if (!isNaN(current) && !(requested > current)) {
    errors.push("Requested credit limit must be greater than the current credit limit.");
    mark("requestedIncrease", true);
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
