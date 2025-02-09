const express = require("express");
const router = express.Router();
const {
  index,
  store,
  update,
  destroy,
  get_by_id,
} = require("../controllers/languages.controller");

const {
  add_language,
  update_langugage,
} = require("../middleware/validations/languages.validation");

const {
  userBodyGuard,

  bodyParser,
  authorize,
} = require("../middleware/middleware.protects");

router.get("/", index);

router.post("/", bodyParser, authorize(["admin"]), add_language, store);

router.put("/:id", authorize(["admin"]), update_langugage, update);

router.delete("/:id", authorize(["admin"]), destroy);

router.get("/:id", get_by_id);

module.exports = router;
