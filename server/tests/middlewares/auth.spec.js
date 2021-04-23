const { auth } = require("../../src/middlewares/auth");
const { COOKIE_NAME } = require("../../src/constants");
const { verifyToken } = require("../../src/utils/token");
const { User } = require("../../src/db/models");

jest.mock("../../src/db/models");
jest.mock("../../src/utils/token");

describe("auth middleware", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test("should call next with no error", async () => {
    const reqMock = {
      cookies: {
        [COOKIE_NAME]: "token"
      },
      header: () => "token"
    };
    const nextMock = jest.fn();

    User.findByPk.mockImplementation(() => ({}));

    verifyToken.mockImplementation(() => ({
      id: 1,
      csrfToken: "token"
    }));

    const middleware = auth();
    await middleware(reqMock, null, nextMock);

    expect(nextMock).toHaveBeenCalled();
  });

  test("should throw error when no cookie", async () => {
    const resMock = {
      status: jest.fn(() => resMock),
      send: jest.fn()
    };
    const reqMock = {
      cookies: {},
    };

    const middleware = auth();
    await middleware(reqMock, resMock, null);

    expect(resMock.status).toHaveBeenCalledWith(401);
    expect(resMock.send).toHaveBeenCalledWith();
  });

  test("should throw error if cookie invalid", async () => {
    const resMock = {
      status: jest.fn(() => resMock),
      send: jest.fn()
    };
    const reqMock = {
      cookies: {
        [COOKIE_NAME]: "token"
      },
    };

    verifyToken.mockImplementation(() => null);

    const middleware = auth();
    await middleware(reqMock, resMock, null);

    expect(resMock.status).toHaveBeenCalledWith(401);
    expect(resMock.send).toHaveBeenCalledWith();
  });

  test("should throw error if user does not exist", async () => {
    const resMock = {
      status: jest.fn(() => resMock),
      send: jest.fn()
    };
    const reqMock = {
      cookies: {
        [COOKIE_NAME]: "token"
      },
    };
    User.findOne.mockImplementation(() => null);

    const middleware = auth();
    await middleware(reqMock, resMock, null);

    expect(resMock.status).toHaveBeenCalledWith(401);
    expect(resMock.send).toHaveBeenCalledWith();
  });

  test("should throw error if cookie and header CSRF are not equal", async () => {
    const resMock = {
      status: jest.fn(() => resMock),
      send: jest.fn()
    };
    const reqMock = {
      cookies: {
        [COOKIE_NAME]: "token-1"
      },
      header: () => "token-2"
    };
    verifyToken.mockImplementation(() => ({ csrfToken: "token-1" }));
    User.findOne.mockImplementation(() => ({}));

    const middleware = auth();
    await middleware(reqMock, resMock, null);

    expect(resMock.status).toHaveBeenCalledWith(401);
    expect(resMock.send).toHaveBeenCalledWith();
  });
});
