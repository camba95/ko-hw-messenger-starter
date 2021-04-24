const { COOKIE_NAME } = require("../constants");
const { isDevelopment } = require("./enviroment");

const isDev = isDevelopment();
const COOKIE_SETTINGS = {
  httpOnly: true,
  domain: isDev ? undefined : process.env.DOMAIN,
  secure: !isDev,
  sameSite: isDev ? undefined : "None"
};

const getCookieSettings = () => {
  const settings = { ...COOKIE_SETTINGS };
  return { cookieName: COOKIE_NAME, settings };
};

module.exports = {
  getCookieSettings
};
