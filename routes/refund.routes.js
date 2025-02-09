const express = require("express");

const router = express();
const {
  index,
  store,
  update,
  destroy,
  get_by_id,
  get_user_refunds,
} = require("../controllers/refund.controller");

// validation
const {
  add_refund,
  update_refund,
} = require("../middleware/validations/refund.validation");

// authorization

const { authorize, bodyParser } = require("../middleware/middleware.protects");

router.get("/", index);

router.get("/user", get_user_refunds);

router.get("/:id", get_by_id);

router.post("/", authorize(["admin", "user"]), bodyParser, add_refund, store);

router.put("/:id", authorize(["admin"]), update_refund, update);

router.delete("/:id", authorize(["admin"]), destroy);

module.exports = router;
