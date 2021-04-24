const socketIO = require("socket.io");
const onlineUsers = require("../onlineUsers");
const { auth } = require("../middlewares/auth-sockets");
const cache = require("./cache");
const { LastSeen, Message, Conversation } = require("../db/models");

const config = (server) => {
  return socketIO(server);
};

const setListeners = (io) => {
  // set auth middleware
  io.use(auth());

  io.on("connection", (socket) => {
    socket.on("go-online", (id) => {
      if (!onlineUsers.includes(id)) {
        onlineUsers.push(id);
      }
      // send the user who just went online to everyone else who is already online
      socket.broadcast.emit("add-online-user", id);
    });

    socket.on("new-message", async ({ message, sender, lastMessage }) => {
      const { conversationId, userId } = message;

      const conversation = await Conversation.findByPk(conversationId);

      const otherUserId = userId === conversation.user1Id ? conversation.user2Id : conversation.user1Id;

      const data = await cache.get(`user-room-${otherUserId}`);

      if (data && data.room === `${conversationId}`) {
        socket.to(`room-${conversationId}`).to(userId).emit("new-message", {
          message,
          sender,
          lastMessage
        });
        return;
      }

      socket.broadcast.emit(`messages-for-${otherUserId}`, {
        message,
        sender,
        lastMessage
      });
    });

    socket.on("last-seen", async ({ userId, conversationId, messageId }) => {
      await LastSeen.saveLastSeen({
        userId: userId || socket.userId,
        conversationId,
        messageId
      });

      if (messageId) await Message.setReadStatus(userId, messageId);

      socket.to(`room-${conversationId}`).emit("last-seen", {
        messageId,
        userId,
        conversationId
      });
    });

    socket.on("logout", (id) => {
      if (onlineUsers.includes(id)) {
        userIndex = onlineUsers.indexOf(id);
        onlineUsers.splice(userIndex, 1);
        socket.broadcast.emit("remove-offline-user", id);
      }
    });

    socket.on("disconnect", async () => {
      if (onlineUsers.includes(socket.userId)) {
        userIndex = onlineUsers.indexOf(socket.userId);
        onlineUsers.splice(userIndex, 1);
      }
      const data = await cache.get(socket.sessionId);
      socket.broadcast.emit("remove-offline-user", data);
    });

    socket.on("enter-room", async ({ room }) => {
      const data = await cache.get(`user-room-${socket.userId}`);
      if (data) {
        socket.leave(`room-${data.room}`);
      }
      await cache.set(`user-room-${socket.userId}`, 'room', room);
      socket.join(`room-${room}`);
    });

    socket.emit("session", {
      sessionId: socket.sessionId,
      userId: socket.userId,
    });
  });
};


module.exports = {
  config,
  setListeners
};
