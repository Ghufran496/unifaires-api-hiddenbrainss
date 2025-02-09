const express = require("express");
const router = express();
const {
  index,
  store,
  update,
  destroy,
  get_by_id,
  chat_messages,
} = require("../controllers/chat.messages.controller");

const { authorize, bodyParser } = require("../middleware/middleware.protects");

const {
  add_chat_messages,
  update_chat_messages,
} = require("../middleware/validations/chat.message.validation");

router.get("/chat/:id", authorize(["admin"]), chat_messages);

router.get("/:id", authorize(["user", "admin", "business"]), get_by_id);

router.post(
  "/",
  authorize(["user", "admin", "business"]),
  bodyParser,
  add_chat_messages,
  store
);

router.put(
  "/:id",
  authorize(["user", "admin", "business"]),
  bodyParser,
  update_chat_messages,
  update
);

router.delete(
  "/:id",
  authorize(["user", "admin", "business"]),

  destroy
);

module.exports = router;
