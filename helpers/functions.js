const bcrypt = require("bcryptjs");

class FunctionHelper {
  async_compare(password, hash_password) {
    return new Promise(function (resolve, reject) {
      bcrypt.compare(password, hash_password, function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }
}
module.exports = new FunctionHelper();
