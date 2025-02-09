const express = require("express");
const router = express();
const {
  index,
  store,
  update,
  destroy,
  get_by_id,
} = require("../controllers/lecture.article.controller");

const { authorize, bodyParser } = require("../middleware/middleware.protects");
const {
  add_lecture_article,
  update_lecture_article,
} = require("../middleware/validations/lecture.article.validation");

router.get("/", authorize(["admin"]), index);

router.get("/:id", authorize(["admin", "user", "business"]), get_by_id);

router.post(
  "/",
  authorize(["admin", "user", "business"]),
  bodyParser,
  add_lecture_article,
  store
);

router.put(
  "/:id",
  authorize(["admin", "user", "business"]),
  bodyParser,
  update_lecture_article,
  update
);

router.delete("/:id", authorize(["admin", "user", "business"]), destroy);

module.exports = router;
