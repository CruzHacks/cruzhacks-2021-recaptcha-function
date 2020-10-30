const functions = require("firebase-functions");
require("isomorphic-fetch");

exports.siteVerify = functions.https.onRequest(async (request, response) => {
  const secretKey = functions.config().siteverify.recaptchasecretkey;
  const siteVerifyUrl = functions.config().siteverify.siteverifyurl;
  if (!Object.keys(request.headers).includes("token")) {
    return response
      .status(401)
      .send({ error: true, status: 401, message: "Token is missing" });
  }
  const token = request.headers.token;
  const formBody = `secret=${secretKey}&response=${token}`;
  return fetch(siteVerifyUrl, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
    body: formBody,
  })
    .then((res) => res.json())
    .then((json) => {
      if (Object.keys(json).includes("error-codes")) {
        const errors = json["error-codes"];
        if (
          errors.includes("invalid-input-response") &&
          errors.includes("invalid-input-secret")
        ) {
          return response.status(400).send({
            error: true,
            status: 400,
            message: "Invalid Token and Secret Provided",
          });
        } else if (errors.includes("invalid-input-response")) {
          return response.status(400).send({
            error: true,
            status: 400,
            message: "Invalid Token Provided",
          });
        } else if (errors.includes("invalid-input-secret")) {
          return response.status(401).send({
            error: true,
            status: 401,
            message: "Incorrect Secret Provided",
          });
        } else if (errors.includes("timeout-or-duplicate")) {
          return response.status(400).send({
            error: true,
            status: 400,
            message: "Request Timed Out or Sent Duplicate Key",
          });
        }
      }
      return response.status(200).send({
        error: false,
        status: 200,
        message: "Succesfully Authenticated Request",
      });
    })
    .catch((error) => {
      return response
        .status(500)
        .send({ error: true, status: 500, message: error.message });
    });
});
