/**
 * CLIR Customer Info Form — Coach View change handler
 * Paste into Behavior > Event Handlers > change
 * Writes DOM field values back into the CustomerInfo binding.
 */
(function () {
  var root = this.context.element;
  var binding = this.context.binding;
  var data = (binding && binding.get) ? (binding.get("value") || {}) : {};

  function readString(name) {
    var input = root.querySelector('[data-field="' + name + '"]');
    return input ? String(input.value || "").replace(/^\s+|\s+$/g, "") : "";
  }

  function readNumber(name, asInt) {
    var input = root.querySelector('[data-field="' + name + '"]');
    if (!input || input.value === "") {
      return null;
    }
    return asInt ? parseInt(input.value, 10) : Number(input.value);
  }

  data.customerID = readString("customerID");
  data.fullName = readString("fullName");
  data.creditScore = readNumber("creditScore", true);
  data.annualIncome = readNumber("annualIncome", false);
  data.currentLimit = readNumber("currentLimit", false);
  data.requestedIncrease = readNumber("requestedIncrease", false);

  if (binding && binding.set) {
    binding.set("value", data);
  }
}).call(this);
