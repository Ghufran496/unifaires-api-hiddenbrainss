const express = require("express");
const router = express();
const {
  index,
  store,
  update,
  destroy,
  get_by_id,
  create_group_chat,
  my_chats,
} = require("../controllers/chat.controller");

const { authorize, bodyParser } = require("../middleware/middleware.protects");

const {
  add_chat,
  update_chat,
  add_group_chat,
} = require("../middleware/validations/chat.validation");

router.get("/", authorize(["admin"]), index);

router.get("/my-chats", authorize(["user", "admin", "business"]), my_chats);

router.get("/:id", authorize(["user", "admin", "business"]), get_by_id);

router.post(
  "/direct",
  authorize(["user", "admin", "business"]),
  bodyParser,
  add_chat,
  store
);

router.post(
  "/group-chat",
  authorize(["user", "admin", "business"]),
  bodyParser,
  add_group_chat,
  create_group_chat
);

router.put(
  "/:id",
  authorize(["user", "admin", "business"]),
  bodyParser,
  update_chat,
  update
);

router.delete(
  "/:id",
  authorize(["user", "admin", "business"]),

  destroy
);

module.exports = router;
