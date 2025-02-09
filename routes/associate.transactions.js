const express = require("express");
const router = express();

const {
  index,
  store,
  update,
  destroy,
  get_by_id,
  get_by_business,
} = require("../controllers/associate.transaction.controller");

const {
  add_transaction,
  update_transaction,
} = require("../middleware/validations/associate.transaction.validation");

const { authorize, bodyParser } = require("../middleware/middleware.protects");

router.get("/", authorize(["admin", "business"]), index);

router.get("/business", authorize(["business"]), get_by_business);

router.get("/:id", authorize(["admin", "business"]), get_by_id);

router.post(
  "/",
  authorize(["admin", "business"]),
  bodyParser,
  add_transaction,
  store
);

router.put("/:id", authorize(["admin"]), update_transaction, update);

router.delete("/:id", authorize(["admin"]), destroy);

module.exports = router;
