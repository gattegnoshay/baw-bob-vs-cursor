/**
 * Underwriter Manual Review — coach load handler
 *
 * Paste into Custom HTML / coach view load event.
 * Prefills processedBy from the signed-in underwriter when empty.
 */
(function onLoadUnderwriterManualReview() {
    if (tw.local.approvalDecision === undefined || tw.local.approvalDecision === null) {
        tw.local.approvalDecision = {};
    }

    if (tw.local.approvalDecision.status === undefined
            || tw.local.approvalDecision.status === null
            || tw.local.approvalDecision.status === "PENDING_UNDERWRITER") {
        // Leave blank so the underwriter must choose APPROVED or REJECTED.
        tw.local.approvalDecision.status = "";
    }

    var processedBy = tw.local.approvalDecision.processedBy;
    var hasProcessedBy = processedBy !== undefined && processedBy !== null
        && String(processedBy).replace(/^\s+|\s+$/g, "") !== "";

    if (!hasProcessedBy) {
        try {
            if (tw.system && tw.system.user) {
                tw.local.approvalDecision.processedBy =
                    tw.system.user.id || tw.system.user.userName || "";
            }
        } catch (ignore) {
            // User context unavailable in some preview modes.
        }
    }
})();
