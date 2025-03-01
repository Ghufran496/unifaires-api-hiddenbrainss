const { useAsync } = require("../core");
const { JParser } = require("../core").utils;
const paypalServices = require("../services/paypalwithdraw.services"); // Import PayPal services


// Initiate PayPal Withdrawal
exports.initiateWithdrawal = useAsync(async (req, res, next) => {
    try {
        const { amount, userId, paypalEmail } = req.body; // Expecting amount, userId, and paypalEmail from frontend

        if (!amount || !userId || !paypalEmail) {
            return res.status(400).json(JParser("Missing required parameters (amount, userId, paypalEmail)", false));
        }

        console.log("Initiating PayPal withdrawal for user: ", userId,amount,paypalEmail);
        // Call service to initiate PayPal withdrawal
        const payoutResponse = await paypalServices.initiateWithdrawalService(
            amount,
            userId,
            paypalEmail
        );

        return res
            .status(200)
            .json(JParser("PayPal withdrawal initiated successfully", true, payoutResponse)); // Return PayPal's response
    } catch (error) {
        next(error);
    }
});

// Optional: Controller to get PayPal Client ID (if needed for frontend connection)
exports.getPayPalClientId = useAsync(async (req, res, next) => {
    try {
        const clientId = process.env.PAYPAL_CLIENT_ID; // Make sure you have this in your .env
        return res
            .status(200)
            .json(JParser("PayPal Client ID retrieved", true, { clientId }));
    } catch (error) {
        next(error);
    }
});


// controllers/paypal.webhook.controller.js
// const paypalWebhookServices = require("../services/paypal.webhook.service"); // Import webhook services

exports.handlePaypalWebhook = async (req, res) => {
    let event;

    // 1. **Verify PayPal Webhook Signature:**
    try {
        const paypalSignatureVerificationResult = await paypalServices.verifyPaypalWebhookSignature(
            req.headers,
            req.rawBody,
            process.env.PAYPAL_WEBHOOK_SECRET
        );

        if (!paypalSignatureVerificationResult) {
            console.error("PayPal Webhook signature verification failed.");
            return res.status(400).send("Webhook signature verification failed");
        }
        event = paypalSignatureVerificationResult.webhookEvent;
        console.log("PayPal Webhook signature verified successfully.");

    } catch (err) {
        console.error("PayPal Webhook signature verification error:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }


    // 2. Log Event
    console.log("Received PayPal webhook event:", event.event_type);


    // 3. Process Event Based on event.event_type
    try {
        switch (event.event_type) {
            case "PAYOUTSBATCH.PAYMENT.COMPLETED":
                await paypalServices.handlePayoutBatchCompleted(event);
                break;

            case "PAYOUTSBATCH.PAYMENT.DENIED":
                await paypalServices.handlePayoutBatchDenied(event);
                break;

            // ... Handle other relevant payout event types ...

            default:
                console.log(`Unhandled PayPal webhook event type: ${event.event_type}`);
                break;
        }

        return res.status(200).send("PayPal Webhook processed successfully");

    } catch (error) {
        console.error("Error processing PayPal webhook event:", error);
        return res.status(500).send("Internal Server Error during PayPal webhook processing");
    }
};