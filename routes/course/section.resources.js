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
  add_resource,
  update_resource,
} = require("../../middleware/validations/section.resource.validation");

const {
  bodyParser,
  authorize,
} = require("../../middleware/middleware.protects");

router.get("/", authorize(["business", "admin"]), index);
router.get("/:id", authorize(["business", "admin"]), get_by_id);
router.post(
  "/",
  bodyParser,
  authorize(["business", "admin"]),
  add_resource,
  store
);
router.put("/:id", authorize(["business", "admin"]), update_resource, update);
router.delete("/:id", authorize(["business", "admin"]), destroy);

module.exports = router;
