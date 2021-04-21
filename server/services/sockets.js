const socketIO = require("socket.io");
const onlineUsers = require("../onlineUsers");
const { auth } = require("../middlewares/auth-sockets");
const cache = require("./cache");
const { LastSeen, LastMessage } = require("../db/models");

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

    socket.on("new-message", ({ message, sender, lastMessage }) => {
      const { conversationId } = lastMessage;
      socket.to(conversationId).emit("new-message", {
        message,
        sender,
        lastMessage
      });
    });

    socket.on("last-seen", async ({ userId, otherId, conversationId, messageId }) => {
      await LastSeen.saveLastSeen({
        userId: userId || socket.userId,
        conversationId,
        messageId
      });

      if (!otherId) return;

      const lastMessage = await LastMessage.findOne({
        where: {
          userId: otherId,
          conversationId
        }
      });

      if (!lastMessage || lastMessage.messageId === messageId) {
        socket.to(otherId).emit("last-seen", {
          messageId,
          userId,
          conversationId
        });
      }
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
      await cache.del(socket.sessionId);
      socket.broadcast.emit("remove-offline-user", data);
    });

    socket.on("switch-room", ({ room }) => {
      if (socket.room) {
        socket.leave(socket.room, () => {
          socket.join(room, () => {
            socket.room = room;
          });
        });
        return;
      }
      socket.join(room, () => {
        socket.room = room;
      });
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
