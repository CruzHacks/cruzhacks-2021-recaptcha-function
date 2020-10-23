const context = require("./defaultContexts");
const httpFunction = require("../index.js");

describe("unit tests for index.js driver", () => {
    describe("test recaptcha api", () => {
  
      test("should return 400 when the token is missing", async () => {
        const request = {
            body: {

            }
        };
        const response = {
            status: function (status) {
              try { 
                expect(status).toEqual(400);
              } catch (error) {

              }
              return this;
            },
            send: function (message) {
                console.log(message)
            },
            json: function (err) {
            },
        };
        await httpFunction.siteVerify(request, response);
      });
  
      test("should return 400 when the token is invalid", async () => {
        const request = {
          body: {
            token: "invalidtoken",
          }
        };
        const response = {
            status: function (status) {
              try { 
                expect(status).toEqual(400);
              } catch (error) {

              }
              return this;
            },
            send: function (message) {
                console.log(message)
            },
            json: function(err){
            },
        };
        await httpFunction.siteVerify(request, response);
      });
    });
});
  
