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

LastSeen.saveLastSeen = async function({ userId, conversationId, messageId }) {
  const lastMessage = await LastSeen.findOne({
    where: {
      userId,
      conversationId
    }
  });
  if (lastMessage) {
    return LastSeen.update({
      messageId
    }, {
      where: {
        userId,
        conversationId
      }
    });
  }
  return LastSeen.create({
    userId,
    conversationId,
    messageId
  });
};

module.exports = LastSeen;
