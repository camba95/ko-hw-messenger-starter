const { verifyToken } = require("../utils/token");
const { User } = require("../db/models");

const auth = () => {
  return async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        console.debug('Token not provided');
        return next(new Error("Unathorized connection"));
      }

      const decoded = verifyToken(token);

      if (!decoded) {
        console.debug('Invalid token');
        return next(new Error("Unathorized connection"));
      }

      const user = await User.findOne({
        where: { id: decoded.id },
      });

      if (!user) {
        console.debug('User not found');
        return next(new Error("Unathorized connection"));
      }

      socket.userId = user.id;
      next();
    } catch (error) {
      console.error(error);
      next(new Error("Unathorized connection"));
    }
  };
};

module.exports = { auth };
