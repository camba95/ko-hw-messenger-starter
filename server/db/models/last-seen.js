const Sequelize = require("sequelize");
const db = require("../db");

const LastSeen = db.define("lastSeen", {
  messageId: {
    type: Sequelize.INTEGER
  }
});

module.exports = LastSeen;
