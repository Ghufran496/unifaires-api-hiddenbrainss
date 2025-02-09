const express = require("express");
const router = express();
const {
  index,
  store,
  update,
  destroy,
  get_by_id,
} = require("../controllers/tax.controller");

const { authorize, bodyParser } = require("../middleware/middleware.protects");

const {
  add_tax,
  update_tax,
} = require("../middleware/validations/tax.validation");

router.get("/", index);

router.get("/:id", get_by_id);

router.post("/", authorize(["admin"]), bodyParser, add_tax, store);

router.put("/:id", authorize(["admin"]), update_tax, update);

router.delete("/:id", authorize(["admin"]), destroy);

module.exports = router;
