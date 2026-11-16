/**
 * CLIR Customer Info Form — Coach View view handler
 * Paste into Behavior > Event Handlers > view
 * Pushes bound CustomerInfo values into the HTML inputs.
 */
(function () {
  var root = this.context.element;
  var binding = this.context.binding;
  var data = (binding && binding.get) ? (binding.get("value") || {}) : {};

  function setField(name, value) {
    var input = root.querySelector('[data-field="' + name + '"]');
    if (!input) {
      return;
    }
    input.value = value === undefined || value === null ? "" : String(value);
  }

  setField("customerID", data.customerID);
  setField("fullName", data.fullName);
  setField("creditScore", data.creditScore);
  setField("annualIncome", data.annualIncome);
  setField("currentLimit", data.currentLimit);
  setField("requestedIncrease", data.requestedIncrease);
}).call(this);
