const express = require("express");
const router = express();

const {
  index,
  store,
  update,
  destroy,
  get_by_id,
} = require("../controllers/course.progress.controller");

const {
  update_progress,
  add_progress,
} = require("../middleware/validations/course.progress.validation");

const { authorize, bodyParser } = require("../middleware/middleware.protects");

router.get("/", authorize(["admin", "user", "business"]), index);

router.get("/:id", authorize(["admin", "user", "business"]), get_by_id);

router.post(
  "/",
  authorize(["admin", "user", "business"]),
  bodyParser,
  add_progress,
  store
);

router.put(
  "/:id",
  authorize(["admin", "user", "business"]),
  bodyParser,
  update_progress,
  update
);

router.delete("/:id", authorize(["admin", "user", "business"]), destroy);

module.exports = router;
