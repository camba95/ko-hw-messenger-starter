const Sequelize = require("sequelize");
const db = require("../db");

const { Op } = Sequelize;

const Message = db.define("message", {
  text: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  senderId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  isRead: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});

Message.setReadStatus = async (userId, messageId) => {
  const message = await Message.findByPk(messageId);
  await Message.update({
    isRead: true
  }, {
    where: {
      createdAt: {
        [Op.lte]: message.createdAt
      },
      conversationId: message.conversationId,
      senderId: {
        [Op.not]: userId
      }
    }
  })
};

Message.countUnread = async (userId, conversationId) => {
  return await Message.count({
    where: {
      conversationId: conversationId,
      senderId: {
        [Op.not]: userId
      },
      isRead: false
    }
  })
};

module.exports = Message;
