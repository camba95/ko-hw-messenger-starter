export const addMessageToStore = (state, payload) => {
  const { message, sender, currentConversation } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
      unreadMessages: 1
    };
    newConvo.latestMessageText = message;
    newConvo.lastOtherUserMessage = { messageId: message.id };
    return [newConvo, ...state];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      const convoCopy = { ...convo };
      convoCopy.messages.push(message);
      convoCopy.latestMessageText = message;
      convoCopy.lastOtherUserMessage = { messageId: message.id };
      if (convoCopy.id !== currentConversation) {
        convoCopy.unreadMessages = (convoCopy.unreadMessages || 0) + 1
      }

      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const newConvo = { ...convo };
      newConvo.id = message.conversationId;
      newConvo.messages.push(message);
      newConvo.latestMessageText = message;
      return newConvo;
    } else {
      return convo;
    }
  });
};

export const setLastSeenInConversation = (state, payload) => {
  const { conversationId, messageId } = payload;
  return state.map((current) => {
    if (current.id === conversationId) {
      current.lastSeens = { messageId };
      return { ...current };
    }
    return current;
  });
};

export const clearUnreadInConversation = (state, conversationId) => {
  return state.map((current) => {
    if (current.id === conversationId) {
      current.unreadMessages = 0;
      return { ...current };
    }
    return current;
  });
};
