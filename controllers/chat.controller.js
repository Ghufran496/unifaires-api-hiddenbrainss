const { useAsync } = require("../core");
const { JParser } = require("../core/core.utils");
const businessServices = require("../services/business.services");
const chatServices = require("../services/chat.services");
const usersServices = require("../services/users.services");
const groupChatUserServices = require("../services/group.chat.user.services");

exports.index = useAsync(async (req, res, next) => {
  try {
    const limit = req.query.limit ? +req.query.limit : 20;
    const offset = req.query.page ? +req.query.page : 0;

    let { count, rows } = await chatServices.all(req, offset, limit);

    if (rows) {
      return res.status(200).send(
        JParser("ok-response", true, {
          chats: rows,
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
    const { receiverId, receiverType } = req.body;

    req.body["senderType"] = req.user ? "user" : "business";
    req.body["senderId"] = req.user ? req.user.id : req.business.id;

    // check if the receiver exist
    const isReceiver = await (receiverType === "user"
      ? usersServices.findOne(receiverId)
      : businessServices.findOne(receiverId));

    if (!isReceiver) {
      return res
        .status(404)
        .json(JParser("receiverType not found", false, null));
    }
    // Check if chat exists
    const chat = await chatServices.findChat(req);
    if (chat) {
      return res.status(200).json(JParser("ok-response", true, chat));
    }

    if (req.body.receiverId === req.body.senderId) {
      return res
        .status(400)
        .json(JParser("you can't create a chat with your self", false, null));
    }

    // Create new chat
    const create = await chatServices.store(req);
    if (create) {
      const newChat = await chatServices.findOne(create.id);
      return res.status(201).json(JParser("ok-response", true, newChat));
    }
  } catch (error) {
    next(error);
  }
});

exports.create_group_chat = useAsync(async (req, res, next) => {
  try {
    const data = {
      body: {
        ...req.body,
        isGroupChat: true,
      },
    };

    const createChat = await chatServices.store(data);

    if (createChat) {
      // add the creator as the group admin and group member
      const data = {
        isGroupAdmin: true,
        isGroupInitiator: true,
        chatId: createChat.id,
      };

      if (req.user) {
        data["userId"] = req.user.id;
      }

      if (req.business) {
        data["businessId"] = req.business.id;
      }

      const createGroupChatUser = await groupChatUserServices.store({
        body: { ...data },
      });

      if (createGroupChatUser) {
        const find = await chatServices.findOne(createChat.id);

        return res.status(201).json(JParser("ok-response", true, find));
      }
    }
  } catch (error) {
    next(error);
  }
});

exports.my_chats = useAsync(async (req, res, next) => {
  try {
    const find = await chatServices.findUserOrBusinessChat(req);

    if (find) {
      return res.status(200).json(JParser("ok-response", true, find));
    } else {
      return res.status(404).json(JParser("not found", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await chatServices.findOne(id);

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

    const find = await chatServices.findOne(id);

    if (find) {
      const update = await chatServices.update(id, req);

      if (update) {
        const find = await chatServices.findOne(id);

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

    const find = await chatServices.findOne(id);

    if (find) {
      const destroy = await chatServices.destroy(id);

      if (destroy)
        return res.status(204).json(JParser("ok-response", true, find));
    } else {
      return res.status(404).json(JParser("not found", false, null));
    }
  } catch (error) {
    next(error);
  }
});
