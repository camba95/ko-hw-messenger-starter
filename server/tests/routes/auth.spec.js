const request = require("supertest");
const { app } = require("../../src/app");

jest.mock("../../src/db/models");
jest.mock("../../src/utils/token");
jest.mock("../../src/utils/cookies");
jest.mock("../../src/services/cache");

describe("/POST register", () => {

  beforeEach(() => jest.clearAllMocks());

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
