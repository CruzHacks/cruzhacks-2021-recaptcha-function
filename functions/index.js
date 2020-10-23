const functions = require('firebase-functions');
const fetch = require("node-fetch")
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');
const client = new SecretManagerServiceClient();


/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
// parent = 'projects/my-project', // Project for which to manage secrets.
// secretId = 'foo', // Secret ID.
// payload = 'hello world!' // String source data.

exports.siteVerify = functions.https.onRequest(async (request, response) => {
    const [accessResponse] = await client.accessSecretVersion({
        name: "projects/309119986430/secrets/RecaptchaSecretKey/versions/latest",
    });
    console.log(secret)
    const siteVerifyUrl = "https://www.google.com/recaptcha/api/siteverify";
    
    if (!('token' in request.body)) {
        return response.status(400).send("Token is missing");
    }
    const secret = accessResponse.payload.data.toString('utf8')
    var formBody = "secret"+"="+secret;
    formBody = formBody + "&response"+"="+request.body.token
    fetch(siteVerifyUrl, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: "POST",
        body: formBody
    })
    .then(response => response.json())
    .then(json => {
        if (json['error-codes']) {
            if ('invalid-input-response' in json['error-codes'] && 'invalid-input-secret' in json['error-codes']){
                return response.status(500).send('Invalid token provided and incorrect secret')
            }
            else if ('invalid-input-response' in json['error-codes']){
                return response.status(400).send('Invalid token provided')
            }
            else if ('invalid-input-secret' in json['error-codes']){
                return response.status(500).send('incorrect secret')
            }
        } else {    
            return response.status(200).send(json)
        }
        
    })
    .catch(error => {
        console.log(error)
        return response.status(500).send(error);
    }) 
})