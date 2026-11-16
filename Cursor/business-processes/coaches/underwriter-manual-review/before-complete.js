/**
 * Underwriter Manual Review — before OK / complete
 *
 * Paste after validate.js succeeds on Complete Review.
 * Normalizes status and stamps processedDate.
 */
(function beforeCompleteUnderwriterManualReview() {
    if (tw.local.approvalDecision === undefined || tw.local.approvalDecision === null) {
        tw.local.approvalDecision = {};
    }

    if (tw.local.approvalDecision.status) {
        tw.local.approvalDecision.status =
            String(tw.local.approvalDecision.status).toUpperCase();
    }

    try {
        tw.local.approvalDecision.processedDate = new Date();
    } catch (ignore) {
        // Date assignment may be coerced by BAW DateTime binding.
    }

    if (tw.local.customerInfo) {
        tw.local.customerInfo.status = "IN_REVIEW";
    }
})();
