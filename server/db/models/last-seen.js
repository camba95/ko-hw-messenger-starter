const Sequelize = require("sequelize");
const db = require("../db");

const LastSeen = db.define("lastSeen", {
  userId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  conversationId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  messageId: {
    type: Sequelize.INTEGER
  }
});

module.exports = LastSeen;
