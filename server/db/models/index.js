const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const LastSeen = require("./last-seen");

// associations

User.hasMany(Conversation);
Conversation.belongsTo(User, { as: "user1" });
Conversation.belongsTo(User, { as: "user2" });
Message.belongsTo(Conversation);
Conversation.hasMany(Message);
LastSeen.belongsTo(Conversation, { as: "conversation" });
LastSeen.belongsTo(User, { as: "user" });

module.exports = {
  User,
  Conversation,
  Message,
  LastSeen
};
