const express = require("express");
const router = express.Router();

const {
  add_user,
  update_user,
  update_username_validation,
} = require("../middleware/validations/user.validation");
const {
  index,
  store,
  update,
  destroy,
  get_by_id,
  get_user_role,
  get_user_by_role,
  my_profile,
  user_profile,
  update_username,
  getSwitchUserDatas,
  update_balance_by_email,
  update_balance
} = require("../controllers/users.controller");

const { bodyParser, authorize } = require("../middleware/middleware.protects");

router.get("/", authorize(["admin"]), index);

router.get("/profile/:username", user_profile);

router.put(
  "/profile/username",
  authorize(["admin", "user"]),
  update_username_validation,
  update_username
);

router.put("/send-balance-by-email", update_balance_by_email);

router.put("/update-balance-by-id", update_balance);

router.get("/role", authorize(["admin", "business", "user"]), get_user_role);

router.post("/", bodyParser, add_user, store);

router.put(
  "/:id",
  authorize(["admin", "user", "business"]),
  update_user,
  update
);

router.delete("/:id", authorize(["admin"]), destroy);

router.get("/users_by_role", authorize(["admin"]), get_user_by_role);

router.get("/my-profile", authorize(["admin", "user"]), my_profile);

router.get(
  "/switch-user-datas",
  authorize(["user", "business"]),
  getSwitchUserDatas
);

router.get("/:id", authorize(["admin", "user", "business"]), get_by_id);

module.exports = router;
