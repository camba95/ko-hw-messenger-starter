const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const authRouter = require("./auth");
const apiRouter = require("./api");
const healthRouter = require("./health");

router.use("/api", auth(), apiRouter);
router.use("/auth", authRouter);
router.use("/health", healthRouter);

module.exports = router;
