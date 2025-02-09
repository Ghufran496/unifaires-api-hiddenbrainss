const express = require("express");

const router = express();

const {
  index,
  store,
  update,
  destroy,
  get_by_id,
  send_token,
} = require("../controllers/verify.controller.js");

const { add_token } = require("../middleware/validations/verify.validation.js");

const { bodyParser } = require("../middleware/middleware.protects.js");

router.get("/", index);

router.get("/:id", get_by_id);

router.post("/", bodyParser, store);

router.put("/:id", update);

router.delete("/:id", destroy);

router.post("/token", add_token, send_token);

module.exports = router;
