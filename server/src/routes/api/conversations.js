const router = require("express").Router();
const {
  User,
  Conversation,
  Message,
  LastSeen,
  LastMessage
} = require("../../db/models");
const { Op } = require("sequelize");
const onlineUsers = require("../../onlineUsers");

const fetchConversations = async (userId) => {
  return Conversation.findAll({
    where: {
      [Op.or]: {
        user1Id: userId,
        user2Id: userId,
      },
    },
    attributes: ["id"],
    order: [[Message, "createdAt", "ASC"]],
    include: [
      { model: Message, order: ["createdAt", "ASC"] },
      {
        model: LastSeen,
        where: {
          userId: {
            [Op.not]: userId,
          }
        },
        attributes: ["messageId"],
        required: false
      },
      {
        model: LastMessage,
        where: {
          userId: {
            [Op.not]: userId,
          }
        },
        attributes: ["messageId"],
        required: false
      },
      {
        model: User,
        as: "user1",
        where: {
          id: {
            [Op.not]: userId,
          },
        },
        attributes: ["id", "username", "photoUrl"],
        required: false,
      },
      {
        model: User,
        as: "user2",
        where: {
          id: {
            [Op.not]: userId,
          },
        },
        attributes: ["id", "username", "photoUrl"],
        required: false,
      },
    ],
  });
};

const setOtherUser = (convoJSON) => {
  if (convoJSON.user1) {
    convoJSON.otherUser = convoJSON.user1;
    delete convoJSON.user1;
  }
  if (convoJSON.user2) {
    convoJSON.otherUser = convoJSON.user2;
    delete convoJSON.user2;
  }
};

const setUserStatus = (convoJSON) => {
  if (onlineUsers.includes(convoJSON.otherUser.id)) {
    convoJSON.otherUser.online = true;
    return;
  }
  convoJSON.otherUser.online = false;
};

const populateConversation = async (userId, convoJSON) => {
  // set a property "otherUser" so that frontend will have easier access
  setOtherUser(convoJSON);
  // set property for online status of the other user
  setUserStatus(convoJSON)
  // set last message seen by other user
  convoJSON.lastSeens = convoJSON.lastSeens[0];
  // set other user's last message
  convoJSON.lastOtherUserMessage = convoJSON.lastMessages[0];
  delete convoJSON.lastMessages;
  // count unread messages
  convoJSON.unreadMessages = await Message.countUnread(userId, convoJSON.id);
  // set properties for notification count and latest message preview
  convoJSON.latestMessageText = convoJSON.messages[convoJSON.messages.length - 1];
};

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
// TODO: for scalability, implement lazy loading
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const data = await fetchConversations(userId);

    const conversations = await Promise.all(
      data.map(async (convo) => {
        const convoJSON = convo.dataValues
        populateConversation(userId, convoJSON);
        return convoJSON;
      })
    );

    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
