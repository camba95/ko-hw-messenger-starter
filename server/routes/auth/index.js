const router = require("express").Router();
const { User } = require("../../db/models");
const { generateToken } = require("../../utils/token");
const { getCookieSettings } = require("../../utils/cookies");
const { COOKIE_NAME } = require("../../constants");
const cache = require("../../services/cache");

router.post("/register", async (req, res, next) => {
  try {
    // expects {username, email, password} in req.body
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res
        .status(400)
        .json({ error: "Username, password, and email required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const user = await User.create(req.body);

    const payload = { id: user.dataValues.id };
    const { token, csrfToken } = generateToken(payload);
    const { cookieName, settings } = getCookieSettings();

    await cache.set(csrfToken, "userId", user.dataValues.id);
    await cache.expire(csrfToken, 30);

    res.cookie(cookieName, token, settings);

    res.json({
      success: true,
      csrfToken,
      ...user.dataValues
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(401).json({ error: "User already exists" });
    } else if (error.name === "SequelizeValidationError") {
      return res.status(401).json({ error: "Validation error" });
    } else next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    // expects username and password in req.body
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: "Username and password required" });

    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      console.log({ error: `No user found for username: ${username}` });
      return res.status(401).json({ error: "Wrong username and/or password" });
    }
    if (!user.correctPassword(password)) {
      console.log({ error: "Wrong username and/or password" });
      return res.status(401).json({ error: "Wrong username and/or password" });
    }

    const payload = { id: user.dataValues.id };
    const { token, csrfToken } = generateToken(payload);
    const { cookieName, settings } = getCookieSettings();

    await cache.set(csrfToken, "userId", user.dataValues.id);
    await cache.expire(csrfToken, 30);

    res.cookie(cookieName, token, settings);

    res.json({
      success: true,
      csrfToken,
      ...user.dataValues
    });

  } catch (error) {
    next(error);
  }
});

router.delete("/logout", (req, res) => {
  req.res.clearCookie(COOKIE_NAME);
  res.sendStatus(204);
});

module.exports = router;
