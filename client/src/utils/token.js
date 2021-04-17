import axios from "axios";

export const setHeader = (key, value) => {
  axios.defaults.headers.common[key] = value;
};

export const clearHeader = (key) => {
  delete axios.defaults.headers.common[key]
};
