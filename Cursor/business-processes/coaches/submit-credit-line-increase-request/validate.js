/**
 * Submit Credit Line Increase Request — client-side validation
 *
 * Install (WebPD / Workflow Designer):
 * 1. Open CSHS "Submit Credit Line Increase Request".
 * 2. Add a Custom HTML coach view (or open an existing Script view).
 * 3. Paste this into the view's validate event handler (or call from the
 *    Submit button before firing the OK boundary event).
 *
 * Contract: return "" when valid; return a non-empty error string when invalid.
 * Also populates tw.local._coachValidationMessages (String list) when present.
 *
 * PDD / process rules:
 *  - annualIncome > 0
 *  - requestedIncrease > currentLimit
 * BO constraint:
 *  - creditScore between 300 and 850
 */
(function validateSubmitCreditLineIncreaseRequest() {
    var errors = [];
    var info = tw.local.customerInfo;

    if (info === undefined || info === null) {
        return "Customer information is missing. Refresh the task and try again.";
    }

    function isBlank(value) {
        return value === undefined || value === null || String(value).replace(/^\s+|\s+$/g, "") === "";
    }

    function toNumber(value) {
        if (value === undefined || value === null || value === "") {
            return NaN;
        }
        return Number(value);
    }

    if (isBlank(info.customerID)) {
        errors.push("Customer ID is required.");
    }
    if (isBlank(info.fullName)) {
        errors.push("Full name is required.");
    }

    var creditScore = toNumber(info.creditScore);
    if (isNaN(creditScore)) {
        errors.push("Credit score is required.");
    } else if (creditScore < 300 || creditScore > 850) {
        errors.push("Credit score must be between 300 and 850.");
    }

    var annualIncome = toNumber(info.annualIncome);
    if (isNaN(annualIncome)) {
        errors.push("Annual income is required.");
    } else if (!(annualIncome > 0)) {
        errors.push("Annual income must be greater than 0.");
    }

    var currentLimit = toNumber(info.currentLimit);
    if (isNaN(currentLimit)) {
        errors.push("Current credit limit is required.");
    }

    var requestedIncrease = toNumber(info.requestedIncrease);
    if (isNaN(requestedIncrease)) {
        errors.push("Requested credit limit is required.");
    } else if (!isNaN(currentLimit) && !(requestedIncrease > currentLimit)) {
        errors.push("Requested credit limit must be greater than the current credit limit.");
    }

    try {
        tw.local._coachValidationMessages = errors;
    } catch (ignore) {
        // Optional diagnostic variable may not exist in the CSHS.
    }

    return errors.join(" ");
})();
