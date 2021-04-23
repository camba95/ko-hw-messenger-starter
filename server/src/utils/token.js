const jwt = require("jsonwebtoken");
const { v4: uuid } = require('uuid');

const generateToken = (payload) => {
  const csrfToken = uuid();
  const token = jwt.sign(
    { csrfToken, ...payload },
    process.env.SESSION_SECRET,
    { expiresIn: 86400 }
  );

  return { csrfToken, token };
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.SESSION_SECRET);
  } catch (error) {
    console.error(error);
    return null;
  }
};

module.exports = { generateToken, verifyToken };
