const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const LastSeen = require("./last-seen");
const LastMessage = require("./last-message");

// associations

User.hasMany(Conversation);
Conversation.belongsTo(User, { as: "user1" });
Conversation.belongsTo(User, { as: "user2" });
Message.belongsTo(Conversation);
Conversation.hasMany(Message);

// Last Seen
LastSeen.belongsTo(User);
LastSeen.belongsTo(Conversation);
Conversation.hasMany(LastSeen);

// Last Message
LastMessage.belongsTo(User);
LastMessage.belongsTo(Conversation);
Conversation.hasMany(LastMessage);
User.hasMany(LastMessage);

module.exports = {
  User,
  Conversation,
  Message,
  LastSeen,
  LastMessage
};
