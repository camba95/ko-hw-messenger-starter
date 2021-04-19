import io from "socket.io-client";
import { SOCKET_SESSION } from "../constants";
import store from "../store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
} from "../store/conversations";

const socket = io(window.location.origin, { autoConnect: false });

export const getSocket = () => socket;

export const connect = (token) => {
  const socket = getSocket();
  socket.auth = { token };
  socket.connect();

  setListeners(socket);
};

export const reconnect = (sessionId, userId) => {
  const socket = getSocket();
  socket.auth = { sessionId };
  socket.userId = userId;
  socket.connect();

  setListeners(socket);
};

export const disconnect = () => {
  const socket = getSocket();
  socket.auth = null;
  socket.userId = null;
  socket.disconnect();
};

export const emit = (event, payload) => {
  const socket = getSocket();
  socket.emit(event, payload);
};

const setListeners = (socket) => {
  socket.on("connect", () => {
    console.debug("Connected to server");

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
  });
};
