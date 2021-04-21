import * as socket from "../../services/socket";
import {
  gotConversations,
  addConversation,
  setNewMessage,
  setSearchedUsers,
} from "../conversations";
import { setActiveChat } from "../activeConversation";
import { gotUser, setFetchingStatus } from "../user";
import * as api from "../../services/api";
import { CSRF_HEADER, SOCKET_SESSION } from "../../constants";

// USER THUNK CREATORS

export const fetchUser = () => async (dispatch) => {
  dispatch(setFetchingStatus(true));
  try {
    const { data } = await api.getCurrentUser();
    dispatch(gotUser(data));
    if (data.id) {
      socket.emit("go-online", data.id);
    }
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setFetchingStatus(false));
  }
};

const onAuthSuccess = async (data, dispatch) => {
  localStorage.setItem(CSRF_HEADER, data.csrfToken);
  dispatch(gotUser(data));
  socket.connect(data.csrfToken);
  socket.emit("go-online", data.id);
};

export const register = (credentials) => async (dispatch) => {
  try {
    const { data } = await api.register(credentials);
    if (data.success) {
      return await onAuthSuccess(data, dispatch);
    }
    dispatch(gotUser({ error: "Server Error" }));
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const login = (credentials) => async (dispatch) => {
  try {
    const { data } = await api.login(credentials);
    if (data.success) {
      return await onAuthSuccess(data, dispatch);
    }
    dispatch(gotUser({ error: "Server Error" }));
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const logout = (id) => async (dispatch) => {
  try {
    await api.logout();
  } catch (error) {
    console.error(error);
  } finally {
    localStorage.removeItem(CSRF_HEADER);
    localStorage.removeItem(SOCKET_SESSION);
    dispatch(gotUser({}));
    socket.emit("logout", id);
    socket.disconnect();
  }
};

// CONVERSATIONS THUNK CREATORS

export const fetchConversations = () => async (dispatch) => {
  try {
    const { data } = await api.fetchConversations();
    dispatch(gotConversations(data));
  } catch (error) {
    console.error(error);
  }
};

const saveMessage = async (body) => {
  const { data } = await api.saveMessages(body);
  return data;
};

const sendMessage = (data, body) => {
  socket.emit("new-message", {
    message: data.message,
    lastMessage: data.lastMessage,
    sender: data.sender,
  });
};

// message format to send: {recipientId, text, conversationId}
// conversationId will be set to null if its a brand new conversation
export const postMessage = (body) => async (dispatch) => {
  try {
    const data = await saveMessage(body);

    if (!body.conversationId) {
      dispatch(addConversation(body.recipientId, data.message));
    } else {
      dispatch(setNewMessage(data.message));
    }

    sendMessage(data, body);
  } catch (error) {
    console.error(error);
  }
};

export const searchUsers = (searchTerm) => async (dispatch) => {
  try {
    const { data } = await api.searchUsers(searchTerm);
    dispatch(setSearchedUsers(data));
  } catch (error) {
    console.error(error);
  }
};

export const selectChat = (username, data, conversationId) => async (dispatch) => {
  socket.emit("switch-room", { room: conversationId });
  socket.emit("last-seen", data);
  dispatch(setActiveChat({ username, conversationId }));
};

// SOCKETS THUNK CREATORS

export const connectSocket = (userId) => async () => {
  try {
    let sessionId = localStorage.getItem(SOCKET_SESSION);
    if (sessionId) {
      socket.reconnect(sessionId, userId);
    } else {
      const { data } = await api.authSocket();
      socket.connect(data.csrfToken);
    }
    socket.emit("go-online", userId);
  } catch (error) {
    console.error(error);
  }
};
