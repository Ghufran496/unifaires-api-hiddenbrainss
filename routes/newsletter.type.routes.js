const express = require("express");
const router = express();
const {
  index,
  store,
  update,
  destroy,
  get_by_id,
} = require("../controllers/newsletter.type.controller");
const { authorize } = require("../middleware/middleware.protects");
const {
  add_newletter_type,
  update_newletter_type,
} = require("../middleware/validations/newsletter.type.validation");

router.get("/", authorize(["admin"]), index);

router.get("/:id", authorize(["admin"]), get_by_id);

router.post("/", authorize(["admin"]), add_newletter_type, store);

router.put("/:id", authorize(["admin"]), update_newletter_type, update);

router.delete("/:id", authorize(["admin"]), destroy);

module.exports = router;
