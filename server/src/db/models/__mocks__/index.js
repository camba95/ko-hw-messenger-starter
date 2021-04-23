module.exports = {
  User: {
    create: jest.fn((data) => ({
      ...data,
      dataValues: { ...data }
    }))
  }
};
