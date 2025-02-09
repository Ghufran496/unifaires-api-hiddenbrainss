const { flw: flutterwave, flwAxiosConfig } = require("../config/flutterwave");
const virtualAccountServices = require("../services/virtual.account.services");
const { JParser } = require("../core/core.utils");
const flutterwaveServices = require("../payment/flutterwave.services");
const axios = require("axios");

exports.get_virtual_account_balance = async (req, res, next) => {
  try {
    let userId, businessId, account;

    if (req.user) {
      ({ id: userId } = req.user);
      account = await virtualAccountServices.findBy({ userId });
    } else if (req.business) {
      ({ id: businessId } = req.business);
      account = await virtualAccountServices.findBy({ businessId });
    }

    // If account not found, create a new account
    if (!account) {
      try {
        const newAccount = await createNewVirtualAccount(
          req,
          userId,
          businessId
        );
        return res
          .status(201)
          .json(JParser("Account created", true, newAccount));
      } catch (error) {
        return res.status(500).json(
          JParser("Error creating new virtual account", false, {
            error: error.message,
          })
        );
      }
    }

    const meta = JSON.parse(account.meta);

    // Using axios configuration with dynamic URL path
    const { status, data, message } = await axios(
      flwAxiosConfig(`/virtual-account-numbers/${meta.orderRef}`)
    );

    if (status === "success") {
      return res.status(200).json(JParser("ok-response", true, data));
    } else {
      if (message === "NO ACCOUNT NUMBERS FOR THIS BATCHID") {
        // Generate a new account number for this account
        const newAccount = await createNewVirtualAccount(
          req,
          userId,
          businessId
        );
        if (newAccount) {
          return res.status(201).json(JParser("ok-response", true, newAccount));
        } else {
          return res
            .status(500)
            .json(
              JParser("Failed to create a new virtual account", false, null)
            );
        }
      }
      return res.status(400).json(JParser(message, false, data));
    }
  } catch (error) {
    next(error);
  }
};

// Function to create a new virtual account
const createNewVirtualAccount = async (req, userId, businessId) => {
  try {
    let email;
    if (req.user) {
      ({ email } = req.user);
    } else if (req.business) {
      ({ email } = req.business);
    }

    const data = {
      email,
      tx_ref: userId || businessId,
      is_permanent: true,
      bvn: req.body.bvn,
    };

    const create = await flutterwaveServices.createVirtualAccount(data);

    if (create) {
      const {
        account_number: accountNumber,
        bank_name: bankName,
        account_status: status,
        order_ref: orderRef,
      } = create.data;

      const storeAccount = await virtualAccountServices.store({
        body: {
          accountNumber,
          bankName,
          status,
          userId: req.user ? userId : null,
          businessId: req.business ? businessId : null,
          platform: "flutterwave",
          meta: JSON.stringify({ orderRef }),
        },
      });

      if (storeAccount) {
        return { storeAccount, create };
      }
    }
  } catch (error) {
    throw new Error("Error creating new virtual account: " + error.message);
  }
};
