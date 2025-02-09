const express = require("express");
const router = express();
const {
  group_chat_users,
  add_user_to_group,
  rename_group,
  remove_user_from_group,
  make_user_group_admin,
  remove_user_from_group_admin,
} = require("../controllers/group.chat.users.controller");

const { bodyParser, authorize } = require("../middleware/middleware.protects");
const {
  add_user_to_group_validation,
  make_user_group_admin_validation,
  remove_user_from_group_admin_validation,
  remove_user_from_group_validation,
  rename_group_validation,
} = require("../middleware/validations/group.chat.user.validation");

router.post(
  "/add-user-to-group",
  authorize(["admin", "business", "user"]),
  bodyParser,
  add_user_to_group_validation,
  add_user_to_group
);

router.post(
  "/make-user-group-admin",
  authorize(["admin", "business", "user"]),
  bodyParser,
  make_user_group_admin_validation,
  make_user_group_admin
);

router.post(
  "/remove-from-user-group-admin",
  authorize(["admin", "business", "user"]),
  bodyParser,
  remove_user_from_group_admin_validation,
  remove_user_from_group_admin
);

router.put(
  "/rename-group/:chatId",
  authorize(["admin", "business", "user"]),
  rename_group_validation,
  rename_group
);

router.delete(
  "/remove-user-from-group",
  authorize(["admin", "business", "user"]),
  remove_user_from_group_validation,
  remove_user_from_group
);

router.get(
  "/:chatId",
  authorize(["admin", "business", "user"]),
  group_chat_users
);

module.exports = router;
