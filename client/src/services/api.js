import axios from "axios";
import { CSRF_HEADER } from "../constants";

const getHeaders = () => {
  const token = localStorage.getItem(CSRF_HEADER);
  if (token) {
    return {
      [CSRF_HEADER]: token
    };
  }
}

export const register = async (credentials) => {
  return axios.post("/auth/register", credentials);
};

export const login = async (credentials) => {
  return axios.post("/auth/login", credentials);
};

export const logout = async () => {
  return axios.delete("/auth/logout");
};

export const getCurrentUser = async () => {
  const headers = getHeaders();
  return axios.get("/api/users/current", { headers });
};

export const fetchConversations = async () => {
  const headers = getHeaders();
  return axios.get("/api/conversations", { headers });
};

export const createConversation = async (data) => {
  const headers = getHeaders();
  return axios.post("/api/conversations", data, { headers });
};

export const saveMessages = async (data) => {
  const headers = getHeaders();
  return axios.post("/api/messages", data, { headers });
};

export const searchUsers = async (searchTerm) => {
  const headers = getHeaders();
  return axios.get(`/api/users/${searchTerm}`, { headers });
};

export const authSocket = async () => {
  const headers = getHeaders();
  return axios.get("/api/sockets", { headers });
};
