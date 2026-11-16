/**
 * Submit Credit Line Increase Request — coach load handler
 *
 * Paste into Custom HTML / coach view load event.
 * Ensures the CustomerInfo BO exists before controls bind.
 */
(function onLoadSubmitCreditLineIncreaseRequest() {
    if (tw.local.customerInfo === undefined || tw.local.customerInfo === null) {
        tw.local.customerInfo = {};
    }

    // Do not overwrite status if already set by a prior step.
    if (tw.local.customerInfo.status === undefined || tw.local.customerInfo.status === null) {
        tw.local.customerInfo.status = "";
    }
})();
