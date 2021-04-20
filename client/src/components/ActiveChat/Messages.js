import React from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const renderMessage = (conversation, userId) => {
  const { messages, otherUser, lastSeens } = conversation;
  return messages.map((message) => {
    const time = moment(message.createdAt).format("h:mm");
    const lastSeen = lastSeens && lastSeens.messageId && message.id === lastSeens.messageId;
    return message.senderId === userId ? (
      <SenderBubble
        key={message.id}
        text={message.text}
        time={time}
        lastSeen={lastSeen}
      />
    ) : (
      <OtherUserBubble
        key={message.id}
        text={message.text}
        time={time}
        otherUser={otherUser}
      />
    );
  })
}

const Messages = (props) => {
  const { conversation, userId } = props;
  return (
    <Box>
      {renderMessage(conversation, userId)}
    </Box>
  );
};

export default Messages;
