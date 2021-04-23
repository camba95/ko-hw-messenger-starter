module.exports = {
  User: {
    create: jest.fn((data) => ({
      ...data,
      ...userObject,
      dataValues: { ...data },
    })),
    findOne: jest.fn(() => null),
    findByPk: jest.fn(() => null)
  },
};
