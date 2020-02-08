const expressjwt = require("express-jwt");

const jwtCheck = expressjwt({    
    secret: "mykey"
  });

module.exports = jwtCheck;