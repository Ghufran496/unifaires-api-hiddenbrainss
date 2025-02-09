const express = require("express");
const router = express();

const { bodyParser, authorize } = require("../middleware/middleware.protects");

const {
  get_help_chat,

  update,
  destroy,
  get_by_id,
  create_user_chat,
  create_agent_chat,
  get_ticket_chat,
} = require("../controllers/help.chats.controller");

const {
  add_help_chat,
} = require("../middleware/validations/help.chat.validation");

router.get("/ticket-chat/:ticketId", get_ticket_chat);

router.get("/:id", get_by_id);

router.post("/create-user-chat", bodyParser, add_help_chat, create_user_chat);

router.post(
  "/create-agent-chat",
  authorize(["admin"]),
  bodyParser,
  add_help_chat,
  create_agent_chat
);

router.put("/:id", update);

router.delete("/:id", destroy);

module.exports = router;
