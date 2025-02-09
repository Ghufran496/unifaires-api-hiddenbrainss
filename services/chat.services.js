const { Op } = require("sequelize");
const {
  Chats,
  GroupChatUsers,
  ChatMessages,
  User,
  Business,
  ChatsNotifications,
} = require("../models");
class ChatsServices {
  async all(req, offset, limit) {
    let filterValue = {};

    for (let key in req.query) {
      if (key !== "offset" && key !== "limit") {
        if (!!Chats.getAttributes()[key]) {
          filterValue[key] = {
            [Op.like]: `%${req.query[key]}%`,
          };
        }
      }
    }
    return await Chats.findAndCountAll({
      distinct: true,
      where: { ...filterValue },
      include: [
        { model: GroupChatUsers },
        {
          model: ChatMessages,
        },
        { model: User, as: "userSender" },
        { model: User, as: "userReceiver" },
        { model: Business, as: "businessSender" },
        { model: Business, as: "businessReceiver" },
      ],
    });
  }

  async findOne(id) {
    return await Chats.findOne({
      where: { id },
      include: [
        { model: GroupChatUsers },
        {
          model: ChatMessages,
        },
        { model: User, as: "userSender" },
        { model: User, as: "userReceiver" },
        { model: Business, as: "businessSender" },
        { model: Business, as: "businessReceiver" },
      ],
    });
  }

  async findBy(by) {
    return await Chats.findOne({
      where: by,
      include: [
        { model: GroupChatUsers },
        {
          model: ChatMessages,
        },
        { model: User, as: "userSender" },
        { model: User, as: "userReceiver" },
        { model: Business, as: "businessSender" },
        { model: Business, as: "businessReceiver" },
      ],
    });
  }

  async findChat(req) {
    const { receiverId, senderId, senderType, receiverType } = req.body;

    return await Chats.findOne({
      where: {
        [Op.or]: [
          { receiverId, senderId },
          { receiverId: senderId, senderId: receiverId },
        ],
        senderType,
        receiverType,
      },
      include: [
        { model: GroupChatUsers },
        {
          model: ChatMessages,
        },
        { model: User, as: "userSender" },
        { model: User, as: "userReceiver" },
        { model: Business, as: "businessSender" },
        { model: Business, as: "businessReceiver" },
      ],
    });
  }

  async store(req) {
    return await Chats.create(req.body);
  }

  async update(id, req) {
    return await Chats.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await Chats.destroy({ where: { id } });
  }

  async findUserOrBusinessChat(req) {
    const { user, business } = req;
    const userId = user ? user.id : null;
    const businessId = business ? business.id : null;

    let chats = [];
    if (userId) {
      chats = await Chats.findAll({
        where: {
          [Op.or]: [
            { senderId: userId },
            { receiverId: userId },
            { "$groupchatusers.userId$": userId },
          ],
          [Op.not]: [{ senderId: userId, receiverId: userId }],
        },

        include: [
          { model: GroupChatUsers },
          {
            model: ChatMessages,
          },
          { model: User, as: "userSender" },
          { model: User, as: "userReceiver" },
          { model: Business, as: "businessSender" },
          { model: Business, as: "businessReceiver" },
          {
            model: ChatsNotifications,
          },
        ],
      });
    }
    if (businessId) {
      chats = await Chats.findAll({
        where: {
          [Op.or]: [
            { senderId: businessId },
            { receiverId: businessId },
            { "$groupchatusers.businessId$": businessId },
          ],
          [Op.not]: [{ senderId: businessId, receiverId: businessId }],
        },
        include: [
          { model: GroupChatUsers },
          {
            model: ChatMessages,
          },
          { model: User, as: "userSender" },
          { model: User, as: "userReceiver" },
          { model: Business, as: "businessSender" },
          { model: Business, as: "businessReceiver" },
          { model: ChatsNotifications },
        ],
      });
    }

    return chats;
  }
}

module.exports = new ChatsServices();
