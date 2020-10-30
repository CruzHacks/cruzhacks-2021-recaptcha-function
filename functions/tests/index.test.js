const chai = require("chai");
const siteVerify = require("../index.js");
const fetchMock = require("fetch-mock");
const test = require("firebase-functions-test")();
test.mockConfig({
  siteverify: {
    recaptchasecretkey: "token",
    siteverifyurl: "http://www.test.com/siteVerify",
  },
});
describe("siteVerify", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it("return 401 when token is missing", (done) => {
    const req = {
      headers: {},
    };
    const res = {
      status: (status) => {
        chai.assert.equal(status, 401);
        return res;
      },
      send: ({ error, status, message }) => {
        chai.assert.equal(error, true);
        chai.assert.equal(status, 401);
        chai.assert.equal(message, "Token is missing");
        done();
      },
    };
    siteVerify.siteVerify(req, res);
  });

  it("return 400 when the token is invalid", (done) => {
    fetchMock.mock("http://www.test.com/siteVerify", {
      "error-codes": ["invalid-input-response"],
    });
    const req = {
      headers: {
        token: "token",
      },
    };
    const res = {
      status: (status) => {
        chai.assert.equal(status, 400);
        return res;
      },
      send: ({ error, status, message }) => {
        chai.assert.equal(error, true);
        chai.assert.equal(status, 400);
        chai.assert.equal(message, "Invalid Token Provided");
        done();
      },
    };
    siteVerify.siteVerify(req, res);
  });

  it("return 400 when invalid secret and token is provided", (done) => {
    fetchMock.mock("http://www.test.com/siteVerify", {
      "error-codes": ["invalid-input-response", "invalid-input-secret"],
    });
    const req = {
      headers: {
        token: "token",
      },
    };
    const res = {
      status: (status) => {
        chai.assert.equal(status, 400);
        return res;
      },
      send: ({ error, status, message }) => {
        chai.assert.equal(error, true);
        chai.assert.equal(status, 400);
        chai.assert.equal(message, "Invalid Token and Secret Provided");
        done();
      },
    };
    siteVerify.siteVerify(req, res);
  });

  it("return 401 when invalid secret is provided", (done) => {
    fetchMock.mock("http://www.test.com/siteVerify", {
      "error-codes": ["invalid-input-secret"],
    });
    const req = {
      headers: {
        token: "token",
      },
    };
    const res = {
      status: (status) => {
        chai.assert.equal(status, 401);
        return res;
      },
      send: ({ error, status, message }) => {
        chai.assert.equal(error, true);
        chai.assert.equal(status, 401);
        chai.assert.equal(message, "Incorrect Secret Provided");
        done();
      },
    };
    siteVerify.siteVerify(req, res);
  });

  it("return 400 when duplicate key sent", (done) => {
    fetchMock.mock("http://www.test.com/siteVerify", {
      "error-codes": ["timeout-or-duplicate"],
    });
    const req = {
      headers: {
        token: "token",
      },
    };
    const res = {
      status: (status) => {
        chai.assert.equal(status, 400);
        return res;
      },
      send: ({ error, status, message }) => {
        chai.assert.equal(error, true);
        chai.assert.equal(status, 400);
        chai.assert.equal(message, "Request Timed Out or Sent Duplicate Key");
        done();
      },
    };
    siteVerify.siteVerify(req, res);
  });

  it("return 200 if request was successful", (done) => {
    fetchMock.mock("http://www.test.com/siteVerify", {});
    const req = {
      headers: {
        token: "token",
      },
    };
    const res = {
      status: (status) => {
        chai.assert.equal(status, 200);
        return res;
      },
      send: ({ error, status, message }) => {
        chai.assert.equal(error, false);
        chai.assert.equal(status, 200);
        chai.assert.equal(message, "Succesfully Authenticated Request");
        done();
      },
    };
    siteVerify.siteVerify(req, res);
  });
});

fetchMock.reset();
