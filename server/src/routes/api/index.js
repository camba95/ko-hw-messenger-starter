const router = require("express").Router();
const messagesApi = require("./messages");
const conversationsApi = require("./conversations");
const usersApi = require("./users");
const socketsApi = require("./sockets");

router.use("/messages", messagesApi);
router.use("/conversations", conversationsApi);
router.use("/users", usersApi);
router.use("/sockets", socketsApi);

router.use((_, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

module.exports = router;
