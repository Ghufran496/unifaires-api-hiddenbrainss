const express = require("express");
const router = express();
const {
  index,
  store,
  update,
  destroy,
  get_by_id,
} = require("../../controllers/course/test.controller");

const {
  add_test,
  update_test,
} = require("../../middleware/validations/test.validation");

const {
  bodyParser,
  authorize,
} = require("../../middleware/middleware.protects");

router.get("/", authorize(["admin"]), index);

router.get("/:id", get_by_id);

router.post("/", bodyParser, authorize(["business", "admin"]), add_test, store);

router.put("/:id", authorize(["business", "admin"]), update_test, update);

router.delete("/:id", authorize(["business", "admin"]), destroy);

module.exports = router;
