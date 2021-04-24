const { v4: uuid } = require("uuid");
const { User } = require("../db/models");
const cache = require("../services/cache");

const auth = () => {
  return async (socket, next) => {
    try {
      const sessionId = socket.handshake.auth.sessionId;

      if (sessionId) {
        const data = await cache.get(sessionId);
        if (data && data.id) {
          socket.sessionId = sessionId;
          socket.userId = data.id;
          return next();
        }
      }

      const token = socket.handshake.auth.token;

      if (!token) throw new Error("Token not provided");

      const data = await cache.get(token);

      if (!data || !data.id) throw new Error("Token not found");

      const user = await User.findByPk(data.id);

      if (!user) throw new Error("User not found");

      await cache.del(token);

      const newSessionId = uuid();
      await cache.set(newSessionId, "id", data.id);

      socket.sessionId = newSessionId;
      socket.userId = user.id;
      next();
    } catch (error) {
      console.error(error);
      next(new Error("Unathorized connection"));
    }
  };
};

module.exports = { auth };
