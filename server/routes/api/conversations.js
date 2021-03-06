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
    order: [["updatedAt", "DESC"]],
    include: [
      {
        model: Message,
        separate: true,
        order: [["createdAt", "ASC"]]
      },
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

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
// TODO: for scalability, implement lazy loading
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await fetchConversations(userId);

    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i];
      const convoJSON = convo.toJSON();

      // set a property "otherUser" so that frontend will have easier access
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1;
        delete convoJSON.user1;
      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;
        delete convoJSON.user2;
      }

      // set property for online status of the other user
      if (onlineUsers.includes(convoJSON.otherUser.id)) {
        convoJSON.otherUser.online = true;
      } else {
        convoJSON.otherUser.online = false;
      }

      convoJSON.lastSeens = convoJSON.lastSeens[0];
      convoJSON.lastOtherUserMessage = convoJSON.lastMessages[0];
      delete convoJSON.lastMessages;

      convoJSON.unreadMessages = await Message.countUnread(userId, convoJSON.id);

      // set properties for notification count and latest message preview
      convoJSON.latestMessageText = convoJSON.messages[convoJSON.messages.length - 1];
      conversations[i] = convoJSON;
    }

    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { otherId } = req.body;

    const newConvo = await Conversation.create({
      user1Id: userId,
      user2Id: otherId
    });

    res.json({ ...newConvo.dataValues });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
