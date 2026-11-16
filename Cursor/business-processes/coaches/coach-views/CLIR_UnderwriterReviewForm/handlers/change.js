/**
 * CLIR Underwriter Review Form — Coach View change handler
 */
(function () {
  var root = this.context.element;
  var binding = this.context.binding;
  var data = (binding && binding.get) ? (binding.get("value") || {}) : {};

  function read(name) {
    var input = root.querySelector('[data-field="' + name + '"]');
    return input ? input.value : "";
  }

  data.status = String(read("status") || "").toUpperCase();
  var amount = read("approvedAmount");
  data.approvedAmount = amount === "" ? null : Number(amount);
  data.approverComments = String(read("approverComments") || "").replace(/^\s+|\s+$/g, "");
  data.processedBy = String(read("processedBy") || "").replace(/^\s+|\s+$/g, "");

  if (binding && binding.set) {
    binding.set("value", data);
  }
}).call(this);
