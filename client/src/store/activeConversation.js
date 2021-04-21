const SET_ACTIVE_CHAT = "SET_ACTIVE_CHAT";

export const setActiveChat = ({ username, conversationId }) => {
  return {
    type: SET_ACTIVE_CHAT,
    payload: {
      username,
      conversationId
    }
  };
};

const reducer = (state = {}, action) => {
  switch (action.type) {
    case SET_ACTIVE_CHAT: {
      return { ...action.payload };
    }
    default:
      return state;
  }
};

export default reducer;
