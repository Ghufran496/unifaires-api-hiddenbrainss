const { useAsync } = require("../core");
const { JParser } = require("../core/core.utils");

const groupChatUsersServices = require("../services/group.chat.user.services");
const chatServices = require("../services/chat.services");

// Helper functions
const validateChat = async (chatId, res) => {
  const isChat = await chatServices.findOne(chatId);
  if (!isChat) {
    res.status(404).json(JParser("chat not found", false, null));
    return false;
  }
  return true;
};

const checkAdmin = async (id, type, res) => {
  const isAdmin = await groupChatUsersServices.findOne({
    [`${type}Id`]: id,
    isGroupAdmin: true,
  });
  if (!isAdmin) {
    res
      .status(403)
      .json(JParser("Only Admin can perform this action", false, null));
    return false;
  }
  return true;
};

const checkExistence = async (identifiers, res, message) => {
  const userExist = await groupChatUsersServices.findBy(identifiers);
  if (!userExist) {
    res.status(404).json(JParser(message, false, null));
    return false;
  }
  return userExist;
};

exports.group_chat_users = useAsync(async (req, res, next) => {
  try {
    // get chat users

    const { chatId } = req.params;

    const isChat = await chatServices.findOne(chatId);

    if (!isChat) {
      return res.status(404).json(JParser("invalid chat ", false, null));
    }

    let { rows } = await groupChatUsersServices.getChatUsers(req);
    if (rows) {
      return res
        .status(200)
        .send(JParser("ok-response", true, { users: rows }));
    }
  } catch (error) {
    next(error);
  }
});

exports.add_user_to_group = useAsync(async (req, res, next) => {
  try {
    const { chatId, userId, businessId } = req.body;

    if (!(await validateChat(chatId, res))) return;

    const id = req.user?.id || req.business?.id;
    const type = req.user ? "user" : "business";

    if (!(await checkAdmin(id, type, res))) return;

    const identifiers = userId ? { userId, chatId } : { businessId, chatId };

    if (
      await checkExistence(
        identifiers,
        res,
        `${type} already exist on this group`
      )
    )
      return;

    const create = await groupChatUsersServices.store({ body: identifiers });

    return res.status(200).json(JParser("ok-response", true, create));
  } catch (error) {
    next(error);
  }
});

exports.make_user_group_admin = useAsync(async (req, res, next) => {
  try {
    const { chatId, userId, businessId } = req.body;

    if (!(await validateChat(chatId, res))) return;

    const id = req.user?.id || req.business?.id;
    const type = req.user ? "user" : "business";

    if (!(await checkAdmin(id, type, res))) return;

    const identifiers = userId ? { userId, chatId } : { businessId, chatId };

    // get the chat record from group

    const userGroup = await groupChatUsersServices.findBy({ ...identifiers });

    if (!userGroup) {
      return res
        .status(404)
        .json(JParser("user not in this group", false, null));
    }
    const update = await groupChatUsersServices.update(userGroup.id, {
      body: { ...identifiers, isGroupAdmin: true },
    });

    if (update) {
      const find = await groupChatUsersServices.findOne(userGroup.id);

      return res.status(200).json(JParser("ok-response", true, find));
    }
  } catch (error) {
    next(error);
  }
});

exports.remove_user_from_group_admin = useAsync(async (req, res, next) => {
  try {
    const { chatId, userId, businessId } = req.body;

    if (!(await validateChat(chatId, res))) return;

    const id = req.user?.id || req.business?.id;
    const type = req.user ? "user" : "business";

    if (!(await checkAdmin(id, type, res))) return;

    const identifiers = userId ? { userId, chatId } : { businessId, chatId };

    // get the chat record from group

    const userGroup = await groupChatUsersServices.findBy({ ...identifiers });

    if (!userGroup) {
      return res
        .status(404)
        .json(JParser("user not in this group", false, null));
    }

    // check if user is the group initializa

    if (userGroup.isGroupInitiator) {
      return res
        .status(400)
        .json(JParser("you can't remove the group creator", false, null));
    }

    const update = await groupChatUsersServices.update(userGroup.id, {
      body: { ...identifiers, isGroupAdmin: false },
    });

    if (update) {
      const find = await groupChatUsersServices.findOne(userGroup.id);

      return res.status(200).json(JParser("ok-response", true, find));
    }
  } catch (error) {
    next(error);
  }
});

exports.remove_user_from_group = useAsync(async (req, res, next) => {
  try {
    const { chatId, userId, businessId } = req.body;

    if (!(await validateChat(chatId, res))) return;

    const id = req.user?.id || req.business?.id;
    const type = req.user ? "user" : "business";

    if (!(await checkAdmin(id, type, res))) return;

    const identifiers = userId ? { userId, chatId } : { businessId, chatId };

    const groupUser = await checkExistence(
      identifiers,
      res,
      `${type} does not exist`
    );
    if (!groupUser) return;

    const destroy = await groupChatUsersServices.destroy(groupUser.id);
    if (destroy)
      return res.status(204).json(JParser("ok-response", true, null));
  } catch (error) {
    next(error);
  }
});

exports.rename_group = useAsync(async (req, res, next) => {
  try {
    const { name } = req.body;
    const { chatId } = req.params;

    if (!(await validateChat(chatId, res))) return;

    const id = req.user?.id || req.business?.id;
    const type = req.user ? "user" : "business";

    if (!(await checkAdmin(id, type, res))) return;

    const update = await groupChatUsersServices.update(chatId, {
      body: { name },
    });

    if (update) {
      const find = await chatServices.findOne(chatId);
      return res.status(200).json(JParser("ok-response", true, find));
    }
  } catch (error) {
    next(error);
  }
});
