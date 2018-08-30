'use strict';
/**
 * Example to refresh tokens using https://github.com/auth0/node-jsonwebtoken
 * It was requested to be introduced at as part of the jsonwebtoken library,
 * since we feel it does not add too much value but it will add code to mantain
 * we won't include it.
 *
 * I create this gist just to help those who want to auto-refresh JWTs.
 */

const jwt = require('jsonwebtoken');
class TokenGenerator{
  // constructor(secretOrPrivateKey,secretOrPublicKey,algorithm,expiresIn){
  constructor(audience,secret,algorithm,expiresIn){
    this.secret = secret;
    this.options =  { algorithm: algorithm, expiresIn: expiresIn }; //algorithm + keyid + noTimestamp + expiresIn + notBefore
    this.verify={ verify: { audience: audience } };
  }
  sign  (payload) {
    const jwtSignOptions = Object.assign({}, this.verify.verify, this.options);
    return jwt.sign(payload, this.secret, jwtSignOptions);
}
  refresh (token) {
    const payload = jwt.verify(token, this.secret, this.verify);
    delete payload.iat;
    delete payload.exp;
    delete payload.nbf;
    delete payload.jti;
    const jwtSignOptions = Object.assign({ }, this.options);
    return jwt.sign(payload, this.secret, jwtSignOptions);
  }
}








/**
 * Just few lines to test the behavior.
 */

var uuid=require('uuid');

console.log(uuid());
// const tokenGenerator = new TokenGenerator(
//   "myaud",
//   'ff4209ba-8a7c-479e-88b9-774bb6f8a9eeff4209ba-8a7c-479e-88b9-774bb6f8a9eeff4209ba-8a7c-479e-88b9-774bb6f8a9ee'
// , 'HS256',7200
//   )
// token = tokenGenerator.sign({ uid: '2' })
//
// console.log(token)
// setTimeout(function () {
//   token2 = tokenGenerator.refresh(token)
//   console.log(jwt.decode(token, { complete: true }))
//   console.log(jwt.decode(token2, { complete: true }))
// }, 3000)

// console.log(jwt.decode("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBpZCI6Inh1ZWdhb3F1biIsImF1ZCI6Inh1ZWdhb3F1bi5jb20iLCJpYXQiOjE1MDUzODY0MzAsImV4cCI6MTUwNTk5MTIzMH0.45GfVrECyaQmBKsRGl96LUO6-lfbZ2giek5S20KSigU", { complete: true }))
