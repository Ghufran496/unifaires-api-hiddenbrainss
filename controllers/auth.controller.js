const { async_compare } = require("../helpers/functions");
const userServices = require("../services/users.services");

const jwt = require("jsonwebtoken");
const roleService = require("../services/role.service");
const { useAsync, utils, errorHandle } = require("./../core");
const { JParser } = require("../core/core.utils");

exports.login = useAsync(async function (req, res) {
  const { email, password } = req.body;

  const user = await userServices.getUserByEmailWithPassword(email);

  if (!user)
    return res.status(404).json(JParser("account does not exist", false, null));

  // isActive Account
  if (!user.status) {
    return res.status(403).json(JParser("account suspended", false, null));
  }

  // Check the password
  const db_password = user.password;

  const isValidPassword = await async_compare(password, db_password);

  if (isValidPassword) {
    // // add user roles, and list of permissions

    const role = await roleService.findOne(user.roleId);

    const payload = {
      fullname: user.fullname,
      permissionId: user.permissionId,
      userId: user.id,
      id: user.id,
      role: role.title,
    };

    const token = jwt.sign(payload, process.env.SECRET);

    // get the user role and permission and add it to the request

    return res.status(200).send(
      JParser("login successfully", true, {
        user: {
          fullname: user.fullname,
          permissionId: user.permissionId,
          userId: user.id,
          id: user.id,
        },
        token,
      })
    );
  } else {
    return res.status(400).json(JParser("invalid password", false, null));
  }

  // Get user with email
});

exports.auth_email = useAsync(async function (req, res) {
  const { email } = req.body;

  const user = await userServices.getUserByEmail(email);

  if (!user)
    return res.status(404).json(JParser("email does not exist", false, null));

  // isActive Account
  if (!user.status)
    return res.status(403).json(JParser("acccount suspended", false, null));

  return res.status(200).send({
    status: true,
    message: "user fetch successfully",
    data: {
      user,
    },
  });
});
