const functions = require('firebase-functions');
const fetch = require("node-fetch")

exports.siteVerify = functions.https.onRequest(async (request, response) => {

    const [accessResponse] = await client.accessSecretVersion({
        name: "projects/cruzhacks-4a899/secrets/RecaptchaSecretKey/versions/latest",
    });
    const secret = accessResponse.payload.data.toString('utf8');
    const siteVerifyUrl = "https://www.google.com/recaptcha/api/siteverify";
    
    // Check if token is in headers 
    if (!(Object.keys(request.headers).includes("token"))) {
        return response.status(400).send("Token is missing");
    }
    const token = request.headers.token;
    const formBody = `secret=${secret}&response=${token}`;
    fetch(siteVerifyUrl, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: "POST",
        body: formBody
    })
    .then(response => response.json())
    .then(json => {
        // Handle response from Google's recaptcha API
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
        }  
        return response.status(200).send(json)
    })
    .catch(error => {
        console.log(error)
        return response.status(500).send(error);
    }) 
})