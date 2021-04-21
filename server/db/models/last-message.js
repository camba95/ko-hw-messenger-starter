const Sequelize = require("sequelize");
const db = require("../db");

const LastMessage = db.define("lastMessage", {
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

module.exports = LastMessage;
