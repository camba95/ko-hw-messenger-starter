import React, { Component } from "react";
import { connect } from "react-redux";
import { Box, Chip } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { selectChat } from "../../store/utils/thunkCreators";
import { createConversation } from "../../services/api";

const styles = {
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "grab",
    },
  },
};

class Chat extends Component {
  handleClick = async (conversation) => {
    const { userId } = this.props;
    const otherId = conversation.otherUser.id
    let conversationId = conversation.id;
    if (!conversationId) {
      const { data } = await createConversation({ otherId });
      conversationId = data.id;
    }
    const username = conversation.otherUser.username;
    const lastMessage = conversation.lastOtherUserMessage || {};
    const data = {
      userId,
      otherId,
      conversationId: conversationId,
      messageId: lastMessage.messageId
    };
    await this.props.selectChat(username, data, conversationId);
  };

  render() {
    const { classes, conversation } = this.props;
    const otherUser = conversation.otherUser;
    return (
      <Box
        onClick={() => this.handleClick(conversation)}
        className={classes.root}
      >
        <BadgeAvatar
          photoUrl={otherUser.photoUrl}
          username={otherUser.username}
          online={otherUser.online}
          sidebar={true}
        />
        <ChatContent conversation={conversation} />
        {!!conversation.unreadMessages && (
          <Box mr={1}>
            <Chip color="primary" size="small" label={conversation.unreadMessages} />
          </Box>
        )}
      </Box>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    selectChat: (username, data, id) => {
      dispatch(selectChat(username, data, id));
    },
  };
};

export default connect(null, mapDispatchToProps)(withStyles(styles)(Chat));
