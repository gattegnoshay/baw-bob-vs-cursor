/**
 * Underwriter Manual Review — client-side validation
 *
 * Install: paste into coach view validate handler (or Complete Review button
 * pre-check) on CSHS "Underwriter Manual Review".
 *
 * Returns "" when valid; otherwise a space-joined error string.
 *
 * PDD Step 4 outputs:
 *  - ApprovalDecision.status in {APPROVED, REJECTED}
 *  - approvedAmount, approverComments, processedBy
 */
(function validateUnderwriterManualReview() {
    var errors = [];
    var decision = tw.local.approvalDecision;
    var customer = tw.local.customerInfo;

    if (decision === undefined || decision === null) {
        return "Approval decision data is missing. Refresh the task and try again.";
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

    var status = isBlank(decision.status) ? "" : String(decision.status).toUpperCase();
    if (status !== "APPROVED" && status !== "REJECTED") {
        errors.push("Decision must be APPROVED or REJECTED.");
    } else {
        decision.status = status;
    }

    if (isBlank(decision.approverComments)) {
        errors.push("Approver comments are required.");
    }

    if (isBlank(decision.processedBy)) {
        errors.push("Processed By is required.");
    }

    if (status === "APPROVED") {
        var approvedAmount = toNumber(decision.approvedAmount);
        var currentLimit = customer && customer.currentLimit !== undefined
            ? toNumber(customer.currentLimit)
            : NaN;

        if (isNaN(approvedAmount)) {
            errors.push("Approved amount is required when the decision is APPROVED.");
        } else if (!isNaN(currentLimit) && !(approvedAmount > currentLimit)) {
            errors.push("Approved amount must be greater than the current credit limit.");
        }
    }

    try {
        tw.local._coachValidationMessages = errors;
    } catch (ignore) {
        // Optional diagnostic variable may not exist in the CSHS.
    }

    return errors.join(" ");
})();
