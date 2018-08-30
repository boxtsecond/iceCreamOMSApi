'use strict';
var jwt = require('jwt-simple');
var secret = 'xxx';

// HS256 secrets are typically 128-bit random strings, for example hex-encoded:
// var secret = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex')

// encode
// var token = jwt.encode(payload, secret,'HS512');
//  console.log(token);
// var decoded = jwt.decode( token,
//   secret);
// console.log(decoded); //=> { foo: 'bar' }


// var jwt = require('jwt'),
//   payload = {
//     scope: 'client:outgoing?clientName=matt',
//     iss: 'APP_SID',
//     expires: Math.round((new Date().getTime()/1000)) + 3600
//   },
//   token = new jwt.WebToken(JSON.stringify(payload), JSON.stringify({typ:'JWT', alg:'HS256'}));
// console.log(token.serialize('hmackey'));

const authToken=require("../app/auth/Token");

let payload = authToken.encodeInsideToken("运营后台");
console.log(payload.token);
authToken.decodeInsideToken(payload.token).then(res => console.log(res));
authToken.decodeInsideToken(payload.token + '11').then(res => console.log(res));

