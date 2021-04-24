module.exports = {
  generateToken: jest.fn(() => ({ csrfToken: "token" })),
  verifyToken: jest.fn(() => ({}))
};
