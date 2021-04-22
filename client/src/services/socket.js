import io from "socket.io-client";
import { SOCKET_SESSION } from "../constants";
import store from "../store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
} from "../store/conversations";
import { connectSocket } from "../store/utils/thunkCreators";

const socket = io(window.location.origin, { autoConnect: false });

export const connect = (token) => {
  socket.offAny();
  socket.auth = { token };
  socket.connect();

  setListeners(socket);
};

export const reconnect = (sessionId, userId) => {
  socket.offAny();
  socket.auth = { sessionId };
  socket.userId = userId;
  socket.connect();

  setListeners(socket);
};

export const disconnect = () => {
  socket.offAny();
  socket.auth = null;
  socket.userId = null;

  socket.disconnect();
};

export const emit = (event, payload) => {
  socket.emit(event, payload);
};

const setListeners = (socket) => {
  socket.on("connect", () => {
    console.debug("Connected to server");

    if (socket.auth.sessionId) {
      return store.dispatch(connectSocket());
    }

    socket.on("add-online-user", (data) => {
      store.dispatch(addOnlineUser(data));
    });

    socket.on("remove-offline-user", (data) => {
      store.dispatch(removeOfflineUser(data));
    });

    socket.on("new-message", (data) => {
      store.dispatch(setNewMessage(data.message, data.sender));
    });

    socket.on("session", ({ sessionId, userId }) => {
      socket.auth = { sessionId };
      socket.userId = userId;
      localStorage.setItem(SOCKET_SESSION, sessionId);
    });

    socket.on("disconnect", (err) => {
      localStorage.removeItem(SOCKET_SESSION);
    });

    socket.on("connect_error", (err) => {
      localStorage.removeItem(SOCKET_SESSION);
    });
  });
};
