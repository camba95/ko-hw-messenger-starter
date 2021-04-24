module.exports = {
  set: jest.fn(),
  expire: jest.fn(),
  get: jest.fn(() => ({})),
  del: jest.fn(),
};
