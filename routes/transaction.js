const express = require("express");
const router = express();

const {
  index,
  store,
  update,
  destroy,
  get_by_id,
  user,
  charges,
  subscription,
  user_subscription,
  user_charges,
  paid_for_attributes_filter,
} = require("../controllers/transactions.controller");

const {
  add_transaction,
  update_transaction,
  filter_transaction,
} = require("../middleware/validations/transaction.validation");

const { authorize, bodyParser } = require("../middleware/middleware.protects");

router.get("/", authorize(["admin"]), filter_transaction, index);

router.get("/charges", authorize(["admin"]), charges);

router.get("/subscription", authorize(["admin"]), subscription);

router.get(
  "/paid-for-attributes",
  authorize(["admin", "user", "business"]),
  paid_for_attributes_filter
);
router.get(
  "/user-subscription",
  authorize(["admin", "user", "business"]),
  user_subscription
);

router.get("/user", authorize(["admin", "business", "user"]), user);

router.get("/:id", authorize(["admin", "business"]), get_by_id);

router.post(
  "/",
  authorize(["admin", "user", "business"]),
  bodyParser,
  add_transaction,
  store
);

router.put(
  "/:id",
  authorize(["admin", "user", "business"]),
  update_transaction,
  update
);

router.delete("/:id", authorize(["user", "admin", "business"]), destroy);

module.exports = router;
