const jwt = require('jsonwebtoken');
const fs = require('fs');

const config = fs.existsSync(`${__dirname}/../config.js`)? require(`${__dirname}/../config.js`) : null;
const jwtSecret = process.env.JWT || config.JWT;

module.exports = context => {
  if(context.req && context.req.headers.authorization) {
    const token = context.req.headers.authorization.split('Bearer ')[1];
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      context.user = decodedToken;
    });
  }

  return context;
};

