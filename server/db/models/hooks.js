const Conversation = require("./conversation");
const Message = require("./message");

const createHooks = () => {
  Message.addHook('afterCreate', 'notifyUsers', async (message) => {
    await Conversation.update({
      updatedAt: Date.now()
    }, {
      where: {
        id: message.conversationId
      }
    });
  });
};

module.exports = createHooks;

