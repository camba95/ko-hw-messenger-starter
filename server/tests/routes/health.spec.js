const chai = require("chai");
const chaiHttp = require("chai-http");
const { app } = require("../../app.js");

chai.should();
chai.use(chaiHttp);

describe("/POST ping", () => {
  it("it should return 200", done => {
    chai
      .request(app)
      .get("/health/ping")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have
          .property("success")
          .eql(true);
        done();
      });
  });
});
