const request = require("supertest");
const { app } = require("../../src/app");

jest.mock("../../src/db/models", () => ({
  User: {
    create: jest.fn((data) => ({
      ...data,
      dataValues: { ...data }
    }))
  }
}));

jest.mock("../../src/utils/token", () => ({
  generateToken: jest.fn(() => ({ csrfToken: "token" }))
}));

jest.mock("../../src/utils/cookies", () => ({
  getCookieSettings: jest.fn(() => ({}))
}));

jest.mock("../../src/services/cache", () => ({
  set: jest.fn(),
  expire: jest.fn(),
}));

describe("/POST register", () => {
  test("it should return 200", async () => {
    const data = {
      username: 'camba95',
      email: 'camba@mail.com',
      password: '123456',
    };
    const response = await request(app)
      .post("/auth/register")
      .send(data);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      ...data,
      success: true,
      csrfToken: "token"
    });
  });
});
