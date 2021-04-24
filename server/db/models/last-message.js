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

LastMessage.saveLastMessage = async function({ userId, conversationId, messageId }) {
  const lastMessage = await LastMessage.findOne({
    where: {
      userId,
      conversationId
    }
  });
  if (lastMessage) {
    await LastMessage.update({
      messageId
    }, {
      where: {
        userId,
        conversationId
      },
      returning: true
    });
    return await LastMessage.findOne({
      where: {
        userId,
        conversationId
      }
    });
  }
  return LastMessage.create({
    userId,
    conversationId,
    messageId
  });
};

module.exports = LastMessage;
