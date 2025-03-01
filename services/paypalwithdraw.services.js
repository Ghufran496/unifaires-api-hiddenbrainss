const fetch = require("node-fetch");
const TransactionDetails = require("../models/transaction.details");
const usersServices = require("../services/users.services");

const initiateWithdrawalService = async (amount, userId, paypalEmail) => {
  try {
    if (!amount || amount <= 0) {
      throw new Error(
        "Invalid withdrawal amount. Amount must be greater than zero."
      );
    }
    if (!userId) {
      throw new Error("User ID is required to process the withdrawal.");
    }
    if (!paypalEmail) {
      throw new Error("PayPal email is required to process the withdrawal.");
    }

    const paypalApiEndpoint =
      "https://api-m.sandbox.paypal.com/v1/payments/payouts";
    const accessToken = await generateSandboxAccessToken();
    if (!accessToken) {
      throw new Error("Failed to retrieve PayPal access token.");
    }

    const transactionEntry = {
      userId,
      transactionAmount: amount,
      transactionType: "withdrawfunds",
      paymentStatus: "pending",
      billingAddress: {
        streetAddress: "PayPal-Withdraw",
        city: "PayPal-Withdraw",
        stateProvince: "PayPal-Withdraw",
        postalCode: "PayPal-Withdraw",
        country: "PayPal-Withdraw",
      },
    };

    const requestBody = {
      sender_batch_header: {
        sender_batch_id: Math.random().toString(36).substring(9),
        email_subject: "Your withdrawal request",
        email_message: `You have requested a withdrawal of $${amount}.`,
      },
      items: [
        {
          recipient_type: "EMAIL",
          amount: {
            value: amount.toString(),
            currency: "USD",
          },
          receiver: paypalEmail,
          note: "Withdrawal from your web app wallet",
          sender_item_id: userId.toString(),
        },
      ],
    };

    const response = await fetch(paypalApiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "PayPal-Request-Id": Math.random().toString(36).substring(7),
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("PayPal API Error:", data);
      throw new Error(
        data.message ||
          `PayPal payout request failed with status ${response.status}`
      );
    }

    transactionEntry.transactionId =
      data.batch_header?.payout_batch_id || "N/A";
    transactionEntry.paymentStatus = "success";

    const CurrentUserBalance = await usersServices.getUserBalanceById(userId);
    if (
      CurrentUserBalance <= 0 ||
      parseFloat(amount) > parseFloat(CurrentUserBalance)
    ) {
      throw new Error("Insufficient funds to withdraw");
    }

    const total = parseFloat(CurrentUserBalance) - parseFloat(amount);

    const update = await usersServices.updateUserBalance(userId, total);
    if (!update) {
      console.error("Failed to update balance");
      return res.status(500).send("Failed to update balance");
    }

    await TransactionDetails.create(transactionEntry);
    return data;
  } catch (error) {
    await TransactionDetails.create({
      userId,
      transactionAmount: amount || 0,
      transactionType: "withdrawfunds",
      paymentStatus: "failed",
      billingAddress: {
        streetAddress: "PayPal-Withdraw",
        city: "PayPal-Withdraw",
        stateProvince: "PayPal-Withdraw",
        postalCode: "PayPal-Withdraw",
        country: "PayPal-Withdraw",
      },
      errorMessage: error.message,
    });
    throw new Error("Error processing PayPal withdrawal: " + error.message);
  }
};

// Function to generate a Sandbox Access Token (using Client ID and Secret)
async function generateSandboxAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const authString = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  ); // Base64 encode

  const tokenEndpoint = "https://api-m.sandbox.paypal.com/v1/oauth2/token";

  const tokenResponse = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${authString}`, // Basic Auth
    },
    body: "grant_type=client_credentials", // Grant type for client credentials flow
  });

  const tokenData = await tokenResponse.json();

  if (!tokenResponse.ok) {
    console.error("Error getting PayPal Sandbox Access Token:", tokenData);
    throw new Error("Failed to obtain PayPal Sandbox Access Token");
  }

  return tokenData.access_token; // Return the access token
}

/**
 * **verifyPaypalWebhookSignature Function (The code you are asking for)**
 *
 * Verifies the signature of a PayPal webhook request to ensure it's genuinely from PayPal.
 *
 * @param {Headers} headers - The headers of the incoming webhook request (req.headers).
 * @param {Buffer} rawBody - The raw body of the webhook request (req.rawBody).
 * @param {string} webhookSecret - Your PayPal Webhook Secret (from .env).
 * @returns {Promise<object|boolean>} - Returns false if verification fails, otherwise returns an object
 *                                     containing { verificationStatus: true, webhookEvent: parsedEventPayload }.
 */
async function verifyPaypalWebhookSignature(headers, rawBody, webhookSecret) {
  const paypalTransmissionId = headers["paypal-transmission-id"];
  const paypalTransmissionTime = headers["paypal-transmission-time"];
  const paypalCertUrl = headers["paypal-cert-url"];
  const paypalAuthAlgo = headers["paypal-auth-algo"];
  const paypalTransmissionSig = headers["paypal-transmission-sig"];
  const webhookId = process.env.PAYPAL_WEBHOOK_ID; //  Your Webhook ID from PayPal Dashboard (set in .env)

  if (
    !paypalTransmissionId ||
    !paypalTransmissionTime ||
    !paypalCertUrl ||
    !paypalAuthAlgo ||
    !paypalTransmissionSig ||
    !webhookId
  ) {
    console.error(
      "Missing required headers for PayPal webhook signature verification."
    );
    return false; // Verification failed due to missing headers
  }

  try {
    const certResponse = await fetch(paypalCertUrl); // Get certificate from PayPal
    if (!certResponse.ok) {
      console.error(
        `Failed to fetch PayPal certificate: ${certResponse.status} ${certResponse.statusText}`
      );
      return false; // Verification failed - cert fetch failed
    }
    const paypalCert = await certResponse.text(); // Get certificate content as text

    const verifier = crypto.createVerify(paypalAuthAlgo); // Create verifier with algorithm
    verifier.update(
      paypalTransmissionId +
        "|" +
        paypalTransmissionTime +
        "|" +
        webhookId +
        "|" +
        rawBody
    ); // Data to verify

    const isVerified = verifier.verify(
      paypalCert,
      paypalTransmissionSig,
      "base64"
    ); // Verify signature

    if (isVerified) {
      console.log("PayPal Webhook signature successfully verified.");

      const webhookEvent = JSON.parse(rawBody); // Parse JSON webhook event payload
      return { verificationStatus: true, webhookEvent: webhookEvent }; // Verification success
    } else {
      console.error(
        "PayPal Webhook signature verification failed (signature mismatch)."
      );
      return false; // Verification failed - signature mismatch
    }
  } catch (error) {
    console.error("Error during PayPal webhook signature verification:", error);
    return false; // Verification failed due to exception
  }
}

// --- Event Handlers (Example - Implement handlers for events you need to process) ---

async function handlePayoutBatchCompleted(event) {
  // ... (Implementation of handlePayoutBatchCompleted function - from previous response) ...
}

async function handlePayoutBatchDenied(event) {
  // ... (Implementation of handlePayoutBatchDenied function - from previous response) ...
}

// ... (Implement handlers for other relevant payout event types if needed) ...

module.exports = {
  initiateWithdrawalService,
  verifyPaypalWebhookSignature, // <--- Export the verification function
  handlePayoutBatchCompleted,
  handlePayoutBatchDenied,
};
