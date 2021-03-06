import io from "socket.io-client";
import { SOCKET_SESSION } from "../constants";
import store from "../store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  setLastSeen
} from "../store/conversations";

const socket = io(window.location.origin, {
  autoConnect: false,
  upgrade: false
});

export const connect = (token) => {
  socket.offAny();
  socket.auth = { token };

  if (socket.disconnected) {
    socket.connect();
  }

  setListeners(socket);
};

export const isConnected = () => socket.connected;

export const reconnect = (sessionId, userId) => {
  socket.offAny();
  socket.auth = { sessionId };
  socket.userId = userId;

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

export const setRoom = (room) => {
  socket.room = room;
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
      store.dispatch(setNewMessage(data.message, data.sender, socket.room));
      if (socket.room === data.lastMessage.conversationId) {
        socket.emit("last-seen", {
          conversationId: data.lastMessage.conversationId,
          messageId: data.lastMessage.messageId,
          otherId: data.lastMessage.userId
        });
      }
    });

    socket.on("last-seen", (data) => {
      store.dispatch(setLastSeen(data));
    });

    socket.on("session", ({ sessionId, userId }) => {
      socket.auth = { sessionId };
      socket.userId = userId;
      localStorage.setItem(SOCKET_SESSION, sessionId);
      setOtherListeners(socket)
    });

    socket.on("disconnect", () => {
      localStorage.removeItem(SOCKET_SESSION);
    });

    socket.on("connect_error", () => {
      localStorage.removeItem(SOCKET_SESSION);
    });
  });
};

const setOtherListeners = (socket) => {
  socket.on(`messages-for-${socket.userId}`, (data) => {
    store.dispatch(setNewMessage(data.message, data.sender, socket.room));
  });
};
