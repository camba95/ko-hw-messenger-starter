const router = require("express").Router();

router.get("/ping", (_, res) => res.json({ success: true }));

module.exports = router;
