const { verifyToken } = require("../utils/token");
const { COOKIE_NAME, CSRF_HEADER } = require("../constants");
const { User } = require("../db/models");

const verifyCsrfToken = (csrfCookie, csrfHeader) => {
  if (!csrfCookie || !csrfHeader) throw new Error("CSRF token invalid.");
  if (csrfCookie !== csrfHeader) throw new Error("CSRF token invalid.");
};

const auth = () => {
  return async (req, res, next) => {
    try {
      const authCookie = req.cookies[COOKIE_NAME];

      if (!authCookie) {
        console.debug("No auth cookie");
        return res.status(401).send();
      }

      const decoded = verifyToken(authCookie);

      if (!decoded) {
        console.debug("Invalid token");
        return res.status(401).send();
      }

      const user = await User.findByPk(decoded.id);

      if (!user) {
        console.debug("User not found");
        return res.status(401).send();
      }

      const authHeader = req.header(CSRF_HEADER);
      verifyCsrfToken(decoded.csrfToken, authHeader);

      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).send();
    }
  };
};

module.exports = { auth };
