# Recaptcha Function

[![Build Status](https://dev.azure.com/kyleobrien0535/CruzHacks%202020%20Website/_apis/build/status/mailing_service/CruzHacks.cruzhacks-mailing-microservice.CI?branchName=master)](https://dev.azure.com/kyleobrien0535/CruzHacks%202020%20Website/_build/latest?definitionId=12&branchName=master)

This Firebase Function is responsible for verifying a user using Google's RECAPTCHA.

## Development

### Dependnecies

- Local NPM packages --> `npm install`

### Start

`npm run serve`



### Test

This project uses [Mocha](https://mochajs.org/). Run all tests via `npm run test`. 

### Environment Variables

`SITEVERIFYURL`
`RECAPTCHASECRETKEY`

## Request Schema

```shell
curl --request GET \
  --url http://localhost:5001/cruzhacks-4a899/us-central1/siteVerify \
  --header 'token: RECAPTCHA_GENERATED_TOKEN' \
  --header 'content-type: application/json' \
```

## Response Schemas

### Success

```json
{
  "error": false,
  "status": 200,
  "message": "Succesfully Authenticated Request"
}
```

### Missing Token

```json
{
  "error": true,
  "status": 401,
  "message": "Token is missing"
}
```

### Invalid Token

```json
{
  "error": true,
  "status": 400,
  "message": "Invalid Token Provided"
}
```

### Invalid Token and Secret

```json
{
  "error": true,
  "status": 400,
  "message":  "Invalid Token and Secret Provided"
}
```

### Invalid Secret

```json
{
  "error": true,
  "status": 401,
  "message":  "Incorrect Secret Provided"
}
```

### Duplicate Token Sent

```json
{
  "error": true,
  "status": 400,
  "message":  "Request Timed Out or Sent Duplicate Key"
}
```

## Technologies

- Firebase Functions
- NodeJS
- Mocha
- Prettier
- Eslint