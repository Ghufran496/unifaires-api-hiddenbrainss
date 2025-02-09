const express = require("express");
const router = express();
const {
  index,
  store,
  update,
  destroy,
  get_by_id,
  user_language,
} = require("../controllers/user.language.controller");

const { authorize, bodyParser } = require("../middleware/middleware.protects");

const {
  add_language,
  update_language,
} = require("../middleware/validations/user.language.validation");

router.get("/", authorize(["admin"]), index);
router.get(
  "/my-language",
  authorize(["admin", "user", "business"]),
  user_language
);

router.get("/:id", authorize(["admin", "business", "user"]), get_by_id);

router.post(
  "/",
  authorize(["admin", "business", "user"]),
  bodyParser,
  add_language,
  store
);

router.put(
  "/:id",
  authorize(["admin", "business", "user"]),
  update_language,
  update
);

router.delete("/:id", authorize(["admin", "business", "user"]), destroy);

module.exports = router;
