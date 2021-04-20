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
LastSeen.belongsTo(User);
LastSeen.belongsTo(Conversation);
Conversation.hasMany(LastSeen);

module.exports = {
  User,
  Conversation,
  Message,
  LastSeen
};
