// socket.js

const { Server } = require("socket.io");
const { OnlineUsers, ChatsNotifications } = require("../models");
const { Op } = require("sequelize");

const getReceiverInfo = (chat, senderId) => {
  if (chat.senderId === senderId) {
    return {
      receiverId: chat.receiverId,
      receiverType: chat.receiverType,
    };
  } else {
    return {
      receiverId: chat.senderId,
      receiverType: chat.senderType,
    };
  }
};

const initSocketIO = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", async (socket) => {
    socket.on("addNewUser", async ({ userId, businessId }) => {
      // Assign userId or businessId to the socket

      if (userId) {
        const existingUser = await OnlineUsers.findOne({
          where: { userId },
        });

        if (existingUser) {
          await existingUser.update({ socketId: socket.id });
        } else {
          await OnlineUsers.create({
            socketId: socket.id,
            userId,
          });
        }
      }

      if (businessId) {
        const existingBusiness = await OnlineUsers.findOne({
          where: { businessId },
        });

        if (existingBusiness) {
          await existingBusiness.update({ socketId: socket.id });
        } else {
          await OnlineUsers.create({
            socketId: socket.id,
            businessId,
          });
        }
      }

      await OnlineUsers.findAll({
        where: { socketId: { [Op.not]: null } },
      }).then((res) => {
        socket.emit("getOnlineUsers", res);
      });
    });

    // send message to connected users
    // send message
    socket.on("sendChat", async (payload) => {
      // get the socket IO OF THE RECEIVER

      const { senderId, chat } = payload;

      const receiver = getReceiverInfo(chat, senderId);

      try {
        const query = { [`${receiver.receiverType}Id`]: receiver.receiverId };

        const user = await OnlineUsers.findOne({ where: query });

        // save notification
        const notification = await ChatsNotifications.findOne({
          where: {
            chatId: chat.id,
            receiverId: query.userId ? query.userId : query.businessId,
            receiverType: receiver.receiverType,
          },
        });

        if (notification) {
          await notification.update({ count: notification.count + 1 });
        } else {
          await ChatsNotifications.create({
            chatId: chat.id,
            receiverId: query.userId ? query.userId : query.businessId,
            receiverType: receiver.receiverType,
            count: 1,
          });
        }

        if (user && user.socketId) {
          const { chat, ...result } = payload;

          // sending message
          socket.to(user.socketId).emit("receiveMessage", result);

          // Emit notification event
          socket.to(user.socketId).emit("notification", {
            chatId: chat.id,
            count: notification ? notification.count + 1 : 1,
            receiverId: query.userId ? query.userId : query.businessId,
          });
        }
      } catch (error) {
        console.error("Error fetching the receiver's socket ID:", error);
      }
    });

    socket.on("notificationRead", async ({ chatId, receiverId }) => {
      const notification = await ChatsNotifications.findOne({
        where: {
          chatId,
          receiverId,
        },
      });

      if (notification) {
        await notification.update({ count: 0 });
      }
    });
  });

  io.on("disconnect", async () => {
    await OnlineUsers.update(
      { socketId: null },
      { where: { socketId: socket.id } }
    );
  });

  return io;
};

module.exports = initSocketIO;
