const express = require("express");

const router = express();

const {
  index,
  store,
  update,
  destroy,
  get_by_id,
} = require("../../controllers/course/lecture.controller");

const {
  add_lecture,
  update_lecture,
} = require("../../middleware/validations/lecture.validation");

const {
  bodyParser,
  authorize,
} = require("../../middleware/middleware.protects");

router.get("/", authorize(["admin"]), index);

router.get("/:id", get_by_id);

router.post(
  "/",
  bodyParser,
  authorize(["business", "admin", "user"]),
  add_lecture,
  store
);

router.put("/:id", authorize(["business", "admin", "user"]), update_lecture, update);

router.delete("/:id", authorize(["business", "admin", "user"]), destroy);

// content routes
module.exports = router;
