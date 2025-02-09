const express = require("express");
const router = express();

const {
  index,
  store,
  update,
  destroy,
  get_by_id,
  user_social,
} = require("../controllers/admin.social.controller");

const { authorize, bodyParser } = require("../middleware/middleware.protects");

const {
  add_social,
  update_social,
} = require("../middleware/validations/social.validation");

router.get("/", index);

router.get(
  "/my-socials",
  authorize(["admin", "user", "business"]),
  user_social
);

router.get("/:id", authorize(["admin", "business", "user"]), get_by_id);

router.post(
  "/",
  authorize(["admin", "business", "user"]),
  bodyParser,
  add_social,
  store
);

router.put(
  "/:id",
  authorize(["admin", "business", "user"]),
  update_social,
  update
);

router.delete("/:id", authorize(["admin", "business", "user"]), destroy);

module.exports = router;
