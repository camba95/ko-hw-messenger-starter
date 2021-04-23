const { auth } = require("../../src/middlewares/auth-sockets");
const { User } = require("../../src/db/models");
const cache = require("../../src/services/cache");

jest.mock("../../src/db/models");
jest.mock("../../src/utils/token");
jest.mock("../../src/services/cache");

describe("auth middleware", () => {

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test("should call nextMock with no error when no session and valid token", async () => {
    const user = { id: 1 };
    const socket = {
      handshake: {
        auth: {
          token: "token"
        }
      }
    };
    const nextMock = jest.fn();

    cache.get.mockImplementation(() => user);
    User.findByPk.mockImplementation(() => user);

    const middleware = auth();
    await middleware(socket, nextMock);

    expect(nextMock).toHaveBeenCalledTimes(1);
    expect(nextMock.mock.calls[0][0]).not.toBeInstanceOf(Error);
  });

  describe("No session", () => {

    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    test("should throw error when no token", async () => {
      const socket = {
        handshake: {
          auth: {}
        }
      };
      const nextMock = jest.fn();

      const middleware = auth();
      await middleware(socket, nextMock);

      expect(nextMock).toHaveBeenCalledTimes(1);
      expect(nextMock.mock.calls[0][0]).toBeInstanceOf(Error);
    });

    test("should throw error when token not store", async () => {
      const socket = {
        handshake: {
          auth: {
            token: "token"
          }
        }
      };
      const nextMock = jest.fn();

      cache.get.mockImplementation(() => null);

      const middleware = auth();
      await middleware(socket, nextMock);

      expect(nextMock).toHaveBeenCalledTimes(1);
      expect(nextMock.mock.calls[0][0]).toBeInstanceOf(Error);
    });

    test("should throw error when user does not exist", async () => {
      const user = { id: 1 };
      const socket = {
        handshake: {
          auth: {
            token: "token"
          }
        }
      };
      const nextMock = jest.fn();

      cache.get.mockImplementation(() => user)
      User.findByPk.mockImplementation(() => null);

      const middleware = auth();
      await middleware(socket, nextMock);

      expect(nextMock).toHaveBeenCalledTimes(1);
      expect(nextMock.mock.calls[0][0]).toBeInstanceOf(Error);
    });
  });

  describe("Session is present", () => {

    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    test("should throw error when no token", async () => {
      const user = { id: 1 };
      const socket = {
        handshake: {
          auth: {
            sessionId: "token"
          }
        }
      };
      const nextMock = jest.fn();

      cache.get.mockImplementation(() => user);

      const middleware = auth();
      await middleware(socket, nextMock);

      expect(nextMock).toHaveBeenCalledTimes(1);
      expect(nextMock).toHaveBeenCalledWith();
    });
  });
});
