const flw = require("../config/flutterwave");

// create virtual account
class FlutterwaveServices {
  async createVirtualAccount(data) {
    try {
      return await flw.VirtualAcct.create(data);
    } catch (error) {
      this.handleError(error, "Failed to create virtual account");
    }
  }

  async getVirtualAccount(orderRef) {
    try {
      return await flw.VirtualAcct.fetch({
        order_ref: orderRef,
      });
    } catch (error) {
      this.handleError(error, "Failed to fetch virtual account");
    }
  }

  async getBillers(by) {
    try {
      return await flw.Bills.fetch_bills_Cat(by);
    } catch (error) {
      this.handleError(error, "Failed to fetch billers from Flutterwave");
    }
  }

  async validateBill(payload) {
    try {
      return await flw.Bills.validate(payload);
    } catch (error) {
      this.handleError(error, "Failed to validate bill");
    }
  }

  async updateVirtualAccount(data) {
    try {
      return await flw.VirtualAcct.update(data);
    } catch (error) {
      this.handleError(error, "Failed to update virtual account");
    }
  }

  async deleteVirtualAccount(orderRef) {
    try {
      return await flw.VirtualAcct.delete({
        order_ref: orderRef,
      });
    } catch (error) {
      this.handleError(error, "Failed to delete virtual account");
    }
  }

  async getAllVirtualAccounts() {
    try {
      return await flw.VirtualAcct.list();
    } catch (error) {
      this.handleError(error, "Failed to get all virtual accounts");
    }
  }

  async fundVirtualAccount(data) {
    try {
      return await flw.VirtualAcct.fund(data);
    } catch (error) {
      this.handleError(error, "Failed to fund virtual account");
    }
  }

  async getBalance(accountId) {
    try {
      return await flw.VirtualAcct.balance({
        account_id: accountId,
      });
    } catch (error) {
      this.handleError(error, "Failed to get balance");
    }
  }

  async chargeAccount(data) {
    try {
      return await flw.Charge.account(data);
    } catch (error) {
      this.handleError(error, "Failed to charge account");
    }
  }

  async chargeCard(data) {
    try {
      return await flw.Charge.card(data);
    } catch (error) {
      this.handleError(error, "Failed to charge card");
    }
  }

  handleError(error, customMessage) {
    if (error.response && error.response.data) {
      const { status, message } = error.response.data;
      const customError = new Error(message);
      customError.status = status === "error" ? 400 : 500;
      throw customError;
    } else {
      // Handle unexpected errors
      const customError = new Error(customMessage);
      customError.status = 500;
      throw customError;
    }
  }
}

module.exports = new FlutterwaveServices();
