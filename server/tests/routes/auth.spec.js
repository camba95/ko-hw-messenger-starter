const request = require("supertest");
const { User } = require("../../src/db/models");
const { app } = require("../../src/app");
const CustomError = require("../utils/error");

jest.mock("../../src/db/models");
jest.mock("../../src/utils/token");
jest.mock("../../src/utils/cookies");
jest.mock("../../src/services/cache");

describe("/POST register", () => {

  afterEach(() => jest.clearAllMocks());

  test("should return 200", async () => {
    const data = {
      username: "camba95",
      email: "camba@mail.com",
      password: "123456",
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

  test("should return 400 on missing field", async () => {
    const data = {
      username: "camba95",
      email: "camba@mail.com",
    };
    const response = await request(app)
      .post("/auth/register")
      .send(data);

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      error: "Username, password, and email required"
    });
  });

  test("should return 400 when password with less than 6 characters", async () => {
    const data = {
      username: "camba95",
      email: "camba@mail.com",
      password: "123",
    };
    const response = await request(app)
      .post("/auth/register")
      .send(data);

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      error: "Password must be at least 6 characters"
    });
  });

  test("should return 401 when use already exists", async () => {
    User.create.mockImplementation(() => {
      throw new CustomError("SequelizeUniqueConstraintError", "User not found");
    });

    const data = {
      username: "camba95",
      email: "camba@mail.com",
      password: "123456",
    };
    const response = await request(app)
      .post("/auth/register")
      .send(data);

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      error: "User already exists"
    });
  });
});
