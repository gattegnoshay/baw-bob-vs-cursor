/**
 * CLIR Customer Info Form — Coach View load handler
 * Paste into Behavior > Event Handlers > load
 */
(function () {
  var root = this.context.element;
  var binding = this.context.binding;
  var options = this.context.options || {};
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

  function optionValue(name, fallback) {
    try {
      if (options[name] && options[name].get) {
        var v = options[name].get("value");
        return v === undefined || v === null ? fallback : v;
      }
    } catch (ignore) {}
    return fallback;
  }

  var data = getBound();
  if (!data.status) {
    data.status = "";
  }

  var titleNode = root.querySelector('[data-role="title"]');
  if (titleNode) {
    titleNode.textContent = optionValue("title", "Credit Line Increase Request");
  }

  var cancelBtn = root.querySelector('[data-role="cancel"]');
  if (cancelBtn && optionValue("showCancelButton", true) === false) {
    cancelBtn.hidden = true;
  }

  // Keep DOM in sync when the user edits fields.
  var fields = root.querySelectorAll("[data-field]");
  for (var i = 0; i < fields.length; i++) {
    (function (input) {
      input.addEventListener("input", function () {
        if (typeof self.change === "function") {
          self.change();
        } else if (self.context && typeof self.context.triggerChange === "function") {
          self.context.triggerChange();
        } else {
          // Fallback when handlers are pasted as separate snippets.
          var current = getBound();
          var key = input.getAttribute("data-field");
          var raw = input.value;
          if (key === "creditScore") {
            current[key] = raw === "" ? null : parseInt(raw, 10);
          } else if (key === "annualIncome" || key === "currentLimit" || key === "requestedIncrease") {
            current[key] = raw === "" ? null : Number(raw);
          } else {
            current[key] = raw;
          }
          if (binding && binding.set) {
            binding.set("value", current);
          }
        }
      });
    })(fields[i]);
  }

  var submitBtn = root.querySelector('[data-action="submit"]');
  if (submitBtn) {
    submitBtn.addEventListener("click", function () {
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
      if (banner) {
        banner.hidden = true;
        banner.textContent = "";
      }
      var current = getBound();
      current.status = "SUBMITTED";
      if (binding && binding.set) {
        binding.set("value", current);
      }
      // In CSHS, wire this button to the OK boundary event after validate passes.
      if (typeof page !== "undefined" && page.ui && typeof page.ui.get === "function") {
        try {
          // Optional: fire a named boundary event control if present.
        } catch (ignore) {}
      }
    });
  }
}).call(this);
