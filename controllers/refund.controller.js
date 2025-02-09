const { useAsync } = require("../core");
const { JParser } = require("../core/core.utils");
const { REFUNDABLE_DAYS } = require("../data");
const { calculatePagination } = require("../helpers/paginate.helper");
const dayjs = require("dayjs");

const refundServices = require("../services/refund.services");
const transactionsServices = require("../services/transactions.services");
const stripe = require("../config/stripe");

exports.index = useAsync(async (req, res, next) => {
  try {
    // get all refunds in pagination

    const { limit, offset, page } = calculatePagination(req);

    const { rows, count } = await refundServices.all(req, offset, limit);

    return res.status(200).send(
      JParser("ok-response", true, {
        refunds: rows,
        currentPage: page,
        limit,
        count,
        pages: Math.ceil(count / limit),
      })
    );
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    const now = dayjs();

    const { transactionId } = req.body;

    // get the refunds transaction id
    const isTransaction = await transactionsServices.findOne(transactionId);

    // validate the existence of the transaction
    if (!isTransaction) {
      return res
        .status(404)
        .json(JParser("transaction does not exist", false, null));
    }

    if (isTransaction.paidFor === "course") {
      // verify if the transaction is valid for refund

      const createdAt = dayjs(isTransaction.createdAt);

      const daysDifference = now.diff(createdAt, "day");

      // check if grace day has passed
      if (daysDifference > REFUNDABLE_DAYS) {
        transactionsServices;
        return res
          .status(400)
          .json(JParser("transaction not valid for refund", false, null));
      }

      const { paymentId } = isTransaction;

      const refund = await stripe.refunds.create({
        charge: paymentId,
      });

      if (refund.status === "succeeded") {
        // change the transaction to refunded

        const update = await transactionsServices.update(isTransaction.id, {
          body: {
            isRefunded: true,
            isRefundable: false,
          },
        });

        if (update) {
          // store the refunded

          const store = await refundServices.store({
            body: {
              transactionId: isTransaction.id,
              refundId: refund.id,
              platform: "stripe",
              amount: refund.amount,
              status: refund.status,
            },
          });

          if (store) {
            return res.status(200).json(JParser("ok-response", true, store));
          }
        }
      }
    }
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await refundServices.findOne(id);

    if (!find) {
      return res.status(400).json(JParser("refund not foudn", false, null));
    }

    return res.status(200).json(JParser("ok-response", true, find));
  } catch (error) {
    next(error);
  }
});

exports.get_user_refunds = useAsync(async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const { limit, offset, page } = calculatePagination(req);

    let { count, rows } = await refundServices.userRefund(
      req,
      offset,
      limit,
      userId
    );

    return res.status(200).send(
      JParser("ok-response", true, {
        refunds: rows,
        currentPage: page,
        limit,
        count,
        pages: Math.ceil(count / limit),
      })
    );
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});
