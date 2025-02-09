const express = require("express");
const router = express();
const {
  get_virtual_account_balance,
} = require("../controllers/virtual.account.controller");
const { authorize } = require("../middleware/middleware.protects");

router.get(
  "/balance",
  authorize(["admin", "user", "business"]),
  get_virtual_account_balance
);

module.exports = router;
