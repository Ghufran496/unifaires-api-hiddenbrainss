const express = require("express");
const router = express.Router();

const chat = require("../routes/chat.routes");
const chatmessages = require("../routes/chat.messages.routes");
const chatgroupusers = require("../routes/group.chat.users.routes");

router.use("/chat", chat);
router.use("/chat-message", chatmessages);
router.use("/chat-group-users", chatgroupusers);

module.exports = router;
