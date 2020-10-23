const context = require("./defaultContexts");
const httpFunction = require("../index.js");

describe("unit tests for index.js driver", () => {
    describe("test recaptcha api", () => {
  
      test("should return 400 when the token is missing", async () => {
        const request = {
            headers: {

            }
        };
        const response = {
            status: function (status) {

              expect(status).toEqual(400);
              return this;
            },
            send: function (message) {
                expect(message).toEqual("Token is missing")
            }
        };
        await httpFunction.siteVerify(request, response);
      });
  
      test("should return 400 when the token is invalid", async () => {
        const request = {
          headers: {
            token: "invalidtoken",
          }
        };
        const response = {
            status: function (status) {
              expect(status).toEqual(400);
              return this;
            },
            send: function (message) {
                expect(message).toEqual("Invalid token provided")
            },
        };
        await httpFunction.siteVerify(request, response);
      });
    });
});
  
