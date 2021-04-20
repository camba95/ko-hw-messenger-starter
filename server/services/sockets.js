const socketIO = require("socket.io");
const onlineUsers = require("../onlineUsers");
const { auth } = require("../middlewares/auth-sockets");
const cache = require("./cache");

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

    socket.on("new-message", (data) => {
      socket.broadcast.emit("new-message", {
        message: data.message,
        sender: data.sender,
      });
    });

    socket.on("new-message", (data) => {
      console.info(onlineUsers);
      socket.broadcast.emit("new-message", {
        message: data.message,
        sender: data.sender,
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
      await cache.del(socket.sessionId);
      socket.broadcast.emit("remove-offline-user", data);
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