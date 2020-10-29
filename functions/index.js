const functions = require("firebase-functions");
const fetch = require("node-fetch");

exports.siteVerify = functions.https.onRequest(async (request, response) => {
  const secretKey = functions.config().siteverify.recaptchasecretkey;
  const siteVerifyUrl = functions.config().siteverify.siteverifyurl;

  // Check if token is in headers
  if (!Object.keys(request.headers).includes("token")) {
    return response
      .status(401)
      .send({ error: true, status: 401, message: "Token is missing" });
  }
  const token = request.headers.token;
  const formBody = `secret=${secretKey}&response=${token}`;
  fetch(siteVerifyUrl, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
    body: formBody,
  })
    .then((response) => response.json())
    .then((json) => {
      // Handle response from Google's recaptcha API
      if (json["error-codes"]) {
        if (
          "invalid-input-response" in json["error-codes"] &&
          "invalid-input-secret" in json["error-codes"]
        ) {
          return response
            .status(500)
            .send("Invalid token provided and incorrect secret");
        } else if ("invalid-input-response" in json["error-codes"]) {
          return response.status(400).send("Invalid token provided");
        } else if ("invalid-input-secret" in json["error-codes"]) {
          return response.status(500).send("incorrect secret");
        }
      }
      return response.status(200).send(json);
    })
    .catch((error) => {
      console.log(error);
      return response.status(500).send(error);
    });
});
