const express = require("express");
const router = express();
const {
  index,
  store,
  update,
  destroy,
  get_by_id,
  user_license,
} = require("../controllers/user.license.controller");

const { authorize, bodyParser } = require("../middleware/middleware.protects");

const {
  add_user_license,
  update_user_license,
} = require("../middleware/validations/user.licence.validation");

router.get("/", authorize(["admin"]), index);

router.get(
  "/my-licence",
  authorize(["admin", "user", "business"]),
  user_license
);

router.get("/:id", authorize(["admin", "business", "user"]), get_by_id);

router.post(
  "/",
  authorize(["admin", "user"]),
  bodyParser,
  add_user_license,
  store
);

router.put(
  "/:id",
  authorize(["admin", "business", "user"]),
  update_user_license,
  update
);

router.delete("/:id", authorize(["admin", "business", "user"]), destroy);

module.exports = router;
