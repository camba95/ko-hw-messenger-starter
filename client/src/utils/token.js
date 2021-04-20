import axios from "axios";
import { CSRF_HEADER } from "../constants";

axios.interceptors.request.use(async function(config) {
  const token = await localStorage.getItem(CSRF_HEADER);
  config.headers[CSRF_HEADER] = token;

  return config;
});

export const setCSRFToken = async (token) => {
  await localStorage.setItem(CSRF_HEADER, token);
};

export const clearCSRFToken = async () => {
  await localStorage.clear(CSRF_HEADER);
};
