const { useAsync } = require("../core");
const { JParser } = require("../core/core.utils");
const chatMessagesServices = require("../services/chat.messages.services");
const chatServices = require("../services/chat.services");

exports.chat_messages = useAsync(async (req, res, next) => {
  try {
    // get the last 40 of this chats
    const limit = req.query.limit ? +req.query.limit : 40;
    const offset = req.query.page ? +req.query.page : 0;

    let { count, rows } = await chatMessagesServices.getChatMessages(
      req,
      offset,
      limit
    );

    if (rows) {
      return res.status(200).send(
        JParser("ok-response", true, {
          messages: rows,
          currentPage: offset + 1,
          limit,
          count,
          pages: Math.ceil(count / limit),
        })
      );
    }
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    // validate the chat first
    const { chatId } = req.body;

    const isChat = await chatServices.findOne(chatId);

    if (!isChat) {
      return res.status(404).json(JParser("chat not found", false, null));
    }

    // check if the sender is part of this chat

    const { senderId, receiverId } = isChat;

    if (req.user) {
      if (req.user.id !== senderId && req.user.id !== receiverId) {
        return res
          .status(403)
          .json(JParser("you don't belong to this chat", false, null));
      }

      req.body.senderId = req.user.id;
    } else if (req.business) {
      if (req.business.id !== senderId && req.business.id !== receiverId) {
        return res
          .status(403)
          .json(JParser("you don't belong to this chat", false, null));
      }

      req.body.senderId = req.business.id;
    }

    // store the chat

    const create = await chatMessagesServices.store(req);

    const find = await chatMessagesServices.findOne(create.id);

    return res.status(201).json(JParser("ok-response", true, find));
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await chatMessagesServices.findOne(id);

    if (find) {
      return res.status(200).json(JParser("ok-response", true, find));
    } else {
      return res.status(404).json(JParser("not found", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await chatMessagesServices.findOne(id);

    if (find) {
      const update = await chatMessagesServices.update(id, req);

      if (update) {
        const find = await chatMessagesServices.findOne(id);
        return res.status(200).json(JParser("ok-response", true, find));
      }
    } else {
      return res.status(404).json(JParser("not found", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await chatMessagesServices.findOne(id);

    if (find) {
      const destroy = await chatMessagesServices.destroy(id);

      if (destroy) {
        return res.status(204).json(JParser("ok-response", true, null));
      }
    } else {
      return res.status(404).json(JParser("not found", false, null));
    }
  } catch (error) {
    next(error);
  }
});
