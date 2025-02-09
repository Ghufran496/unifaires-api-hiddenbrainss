const jwt = require("jsonwebtoken");

class TokenUtils {
  verifyToken() {}
  async getTokenObject(req) {
    const authorization = req.headers.authorization;

    let token = authorization.split(" ")[1];

    const verify = jwt.verify(token, process.env.SECRET, (err, decode) => {
      if (!err) return decode;
    });

    return verify;
  }
}

module.exports = new TokenUtils();
