const { useAsync } = require("../core");
const { JParser } = require("../core").utils;

const transactionServices = require("../services/associate.transaction.services");

exports.index = useAsync(async (req, res, next) => {
  try {
    const all = await transactionServices.all();

    if (all) {
      return res
        .status(200)
        .json(JParser("associate transaction fetch successfully", true, all));
    }
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    // check if transaction id already exist
    const { paymentId } = req.body;
    const isTransaction = await transactionServices.findBy({ paymentId });

    if (!isTransaction) {
      // store

      if (req.user) {
        const { roleId, id } = req.user;

        req.body.userId = id;
        req.body.roleId = roleId;
      } else if (req.business) {
        const { roleId, id } = req.business;

        req.body.businessId = id;
        req.body.roleId = roleId;
      }

      const create = await transactionServices.store(req);

      if (create) {
        return res
          .status(201)
          .json(
            JParser("associate transaction saved successfully", true, create)
          );
      }
    } else {
      return res
        .status(400)
        .json(
          JParser("transaction with same payment id already exist", false, null)
        );
    }
  } catch (error) {
    next(error);
  }
});

exports.get_by_business = useAsync(async (req, res, next) => {
  try {
    const { id: businessId } = req.business;

    const transactions = await transactionServices.findAllBy({ businessId });

    return res
      .status(200)
      .json(
        JParser("associate transaction fetch successfully", true, transactions)
      );
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const price = await transactionServices.findOne(id);

    if (price) {
      return res
        .status(200)
        .json(JParser("associate transaction fetch successfully", true, price));
    } else {
      return res
        .status(404)
        .json(JParser("associate transaction not found", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const price = await transactionServices.findOne(id);

    if (price) {
      const update = await transactionServices.update(id, req);

      if (update) {
        const price = await transactionServices.findOne(id);

        return res
          .status(200)
          .json(
            JParser("associate transaction updated successfully", true, price)
          );
      }
    } else {
      return res
        .status(404)
        .json(JParser("associate transaction not found", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const price = await transactionServices.findOne(id);

    if (price) {
      const destroy = await transactionServices.destroy(id);

      if (destroy) {
        return res
          .status(204)
          .json(
            JParser("associate transaction deleted successfully", true, null)
          );
      }
    } else {
      return res
        .status(404)
        .json(JParser("associate transaction not found", false, null));
    }
  } catch (error) {
    next(error);
  }
});
