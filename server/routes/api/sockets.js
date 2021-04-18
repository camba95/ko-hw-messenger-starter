const router = require("express").Router();
const cache = require("../../services/cache");
const { v4: uuid } = require('uuid');

router.post("/", async (req, res, next) => {
  try {
    const csrfToken = uuid();

    await cache.set(csrfToken, "userId", req.user.id);
    await cache.expire(csrfToken, 30);

    res.json({ success: true, csrfToken });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
