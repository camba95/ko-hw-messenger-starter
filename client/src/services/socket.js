import io from "socket.io-client";
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

export const disconnect = () => {
  const socket = getSocket();
  socket.auth = null;
  socket.disconnect();
};

export const emit = (event, payload) => {
  const socket = getSocket();
  socket.emit(event, payload);
};

const setListeners = (socket) => {
  socket.on("connect", () => {
    console.log("connected to server");

    socket.on("add-online-user", (id) => {
      store.dispatch(addOnlineUser(id));
    });

    socket.on("remove-offline-user", (id) => {
      store.dispatch(removeOfflineUser(id));
    });
    socket.on("new-message", (data) => {
      store.dispatch(setNewMessage(data.message, data.sender));
    });
  });
};
