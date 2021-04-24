const router = require("express").Router();
const cache = require("../../services/cache");
const { v4: uuid } = require("uuid");

router.get("/", async (req, res, next) => {
  try {
    const csrfToken = uuid();

    await cache.set(csrfToken, "id", req.user.id);
    await cache.expire(csrfToken, 30);

    res.json({ success: true, csrfToken });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
