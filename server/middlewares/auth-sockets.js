const { User } = require("../db/models");
const cache = require("../services/cache");

const auth = () => {
  return async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        console.debug('Token not provided');
        return next(new Error("Unathorized connection"));
      }

      const data = await cache.get(token);

      if (data && data.id) {
        const user = await User.findOne({
          where: { id: data.id },
        });

        if (!user) {
          console.debug('User not found');
          return next(new Error("Unathorized connection"));
        }

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
