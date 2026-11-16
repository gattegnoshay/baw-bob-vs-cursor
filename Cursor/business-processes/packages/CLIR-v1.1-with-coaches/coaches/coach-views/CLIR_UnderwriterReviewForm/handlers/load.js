/**
 * CLIR Underwriter Review Form — Coach View load handler
 */
(function () {
  var root = this.context.element;
  var binding = this.context.binding;
  var self = this;

  function getBound() {
    var value = binding && binding.get ? binding.get("value") : null;
    if (value === undefined || value === null) {
      value = {};
      if (binding && binding.set) {
        binding.set("value", value);
      }
    }
    return value;
  }

  var decision = getBound();
  if (!decision.status || decision.status === "PENDING_UNDERWRITER") {
    decision.status = "";
  }
  if (!decision.processedBy) {
    try {
      if (typeof tw !== "undefined" && tw.system && tw.system.user) {
        decision.processedBy = tw.system.user.id || tw.system.user.userName || "";
      }
    } catch (ignore) {}
  }
  if (binding && binding.set) {
    binding.set("value", decision);
  }

  var fields = root.querySelectorAll("[data-field]");
  for (var i = 0; i < fields.length; i++) {
    (function (input) {
      input.addEventListener("change", function () {
        if (typeof self.change === "function") {
          self.change();
        }
      });
      input.addEventListener("input", function () {
        if (typeof self.change === "function") {
          self.change();
        }
      });
    })(fields[i]);
  }

  var completeBtn = root.querySelector('[data-action="complete"]');
  if (completeBtn) {
    completeBtn.addEventListener("click", function () {
      var message = "";
      if (typeof self.validate === "function") {
        message = self.validate() || "";
      }
      var banner = root.querySelector('[data-role="errors"]');
      if (message) {
        if (banner) {
          banner.hidden = false;
          banner.textContent = message;
        }
        return;
      }
      var current = getBound();
      current.processedDate = new Date();
      if (binding && binding.set) {
        binding.set("value", current);
      }
      if (banner) {
        banner.hidden = true;
        banner.textContent = "";
      }
    });
  }
}).call(this);
