const jwt = require("jsonwebtoken");

exports.isLogin = async function (req, res, next) {
  try {
    const token = req.headers.authorization;

    if (!token)
      return res.status(400).send({
        error: true,
        message: "No token supply",
      });

    let auth_token = token.split(" ")[1];
    const verify = jwt.verify(auth_token, process.env.SECRET);

    if (verify) {
      req.user = verify;

      // get the user permission and role, add it to req (better way that won't require database query, will be replace with later!

      next();
    }
  } catch (error) {
    return res.status(401).send({
      error: true,
      message: "Invalid token supply",
    });
  }
};

exports.access = (permission) => async (req, res, next) => {
  const { role } = req.user;

  if (permission.includes(role)) {
    next();
  } else {
    // check if the request contain params value

    return res.status(403).json({
      status: false,
      message: "Unauthorized",
      data: null,
    });
  }
  // if the current user have the permssions
};
