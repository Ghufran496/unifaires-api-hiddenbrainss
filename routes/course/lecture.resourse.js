const express = require("express");
const router = express();

const {
  index,
  store,
  update,
  destroy,
  get_by_id,
} = require("../../controllers/course/lecture.resource.controller");

const {
  add_resource_content,
  update_resource_content,
} = require("../../middleware/validations/lecture.resource.validation");

const {
  bodyParser,
  authorize,
} = require("../../middleware/middleware.protects");

router.get("/", index);

router.get("/:id", authorize(["admin", "business"]), get_by_id);

router.post(
  "/",
  bodyParser,
  authorize(["admin", "business"]),
  add_resource_content,
  store
);

router.put(
  "/:id",
  authorize(["admin", "business"]),
  update_resource_content,
  update
);

router.delete("/:id", authorize(["admin", "business"]), destroy);

module.exports = router;
