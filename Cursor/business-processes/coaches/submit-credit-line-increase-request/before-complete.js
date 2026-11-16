/**
 * Submit Credit Line Increase Request — before OK / complete
 *
 * Paste into the Submit button click handler AFTER validate.js succeeds,
 * or into a client-side script step immediately after the coach in the CSHS.
 *
 * Sets lifecycle status per process documentation.
 */
(function beforeCompleteSubmitCreditLineIncreaseRequest() {
    if (tw.local.customerInfo === undefined || tw.local.customerInfo === null) {
        tw.local.customerInfo = {};
    }
    tw.local.customerInfo.status = "SUBMITTED";
})();
