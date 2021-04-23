const { v4: uuid } = require('uuid');
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

      if (!token) {
        console.debug('Token not provided');
        return next(new Error("Unathorized connection"));
      }

      const data = await cache.get(token);

      if (data && data.id) {
        const user = await User.findByPk(data.id);

        if (!user) {
          console.debug('User not found');
          return next(new Error("Unathorized connection"));
        }

        await cache.del(token);

        const sessionId = uuid();
        await cache.set(sessionId, "id", data.id);

        socket.sessionId = sessionId;
        socket.userId = user.id;
        return next();
      }

      console.debug('Token not found');
      next(new Error("Unathorized connection"));
    } catch (error) {
      console.error(error);
      next(new Error("Unathorized connection"));
    }
  };
};

module.exports = { auth };
