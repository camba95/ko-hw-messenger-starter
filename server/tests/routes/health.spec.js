const request = require("supertest");
const { app } = require("../../src/app");

describe("/GET ping", () => {
  test("it should return 200", async () => {
    const response = await request(app)
      .get("/health/ping");

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ success: true });
  });
});
