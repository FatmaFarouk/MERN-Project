require('dotenv').config();
const jwt = require('jsonwebtoken');

// sign 
module.exports.signToken = ({ claims }) => {
    return jwt.sign(claims, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY || "1d",
    });
};

// verify
module.exports.verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
  };