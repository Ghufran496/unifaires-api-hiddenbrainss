const roleServices = require("../services/role.service");
const usersServices = require("../services/users.services");
const emailServices = require("../services/email.services");
const tokenServices = require("../services/token.services");
const ndigit = require("n-digit-token");
const { useAsync, utils } = require("./../core");
const { JParser } = require("../core/core.utils");
const roleService = require("../services/role.service");
const { calculatePagination } = require("../helpers/paginate.helper");
const businessServices = require("../services/business.services");
const User = require("../models/user");
const purchasedCourse = require("../models/PurchasedCourse");

exports.index = useAsync(async function (req, res, next) {
  try {
    // pages

    const { limit, offset, page } = calculatePagination(req);
    // limit
    //
    let { count, rows } = await usersServices.getAllUser({
      limit,
      offset,
      exclude: ["token"],
    });

    return res.status(200).send(
      JParser("ok-response", true, {
        users: rows,
        currentPage: page,
        limit,
        count,
        pages: Math.ceil(count / limit),
      })
    );
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async function (req, res, next) {
  // validate permissions
  try {
    // check if roles exist on the system

    const isRole = await roleServices.getAllRole();

    if (isRole && isRole.length) {
      // validate email
      let isEmail = await usersServices.verifyEmail(req.body.email);

      if (isEmail) {
        return res
          .status(400)
          .json(utils.JParser("email already exist", false, null));
      } else {
        // register user
        const userData = await usersServices.createUser(req);

        // add token

        if (userData) {
          const token = ndigit.gen(6);
          // Send email confirmation
          const emailVerify = emailServices.elasticEmailConfirmation({
            email: req.body.email,
            token,
          });

          if (emailVerify) {
            tokenServices.storeToken({
              token,
              email: req.body.email,
              userId: userData.id,
            });
          }

          return res
            .status(201)
            .send(utils.JParser("User Created Successfully", true, userData));
        }
      }
    } else {
      return res
        .status(404)
        .json(utils.JParser("no registered role on the system", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async function (req, res, next) {
  try {
    let { id } = req.params;

    // check user exist
    let user = await usersServices.findOne(id);

    if (user) {
      // check for resouces ownership

      const user = await usersServices.update(id, req);

      delete user.password;

      return res
        .status(200)
        .json(utils.JParser("user updated successfully", false, user));
    }

    return res.status(400).send({
      success: false,
      message: "Invalid User Id",
      data: null,
    });
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async function (req, res, next) {
  try {
    let { id } = req.params;
    let user = await usersServices.getUserById(id);

    if (user) {
      if (user.id === req.user.id) {
        const deleteUser = await usersServices.deleteUser(id);

        if (deleteUser) {
          return res
            .status(204)
            .json(JParser("user deleted successfully", true, null));
        } else {
          return res
            .status(400)
            .json(JParser("something went wrong", false, null));
        }
      } else {
        return res.status(403).json(utils.JParser("unauthorize", false, null));
      }
    } else {
      return res.status(400).send(JParser("invalid user id", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await usersServices.findOne(id);
    delete user.password;

    if (user) {
      return res
        .status(200)
        .json(JParser("user fetch successfully", true, user));
    } else {
      return res.status(404).json(JParser("user not found", false, null));
    }
  } catch (error) {
    res.status(404).json(JParser("user not found", false, null));
  }
});

exports.my_profile = useAsync(async (req, res, next) => {
  try {
    const { id } = req.user;

    const user = await usersServices.findOne(id);
    delete user.password;

    if (user) {
      return res
        .status(200)
        .json(JParser("profile fetch successfully", true, user));
    } else {
      return res.status(404).json(JParser("profile not found", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.get_user_role = useAsync(async (req, res, next) => {
  try {
    const { id, roleId } = req.user;

    const role = await roleService.getAllRoleById(roleId);

    if (role) {
      return res.status(200).json(JParser("success", true, role));
    }
  } catch (error) {
    next(error);
  }
});

exports.user_role = useAsync(async function (req, res, next) {
  // verify user
  const { token } = req.body;
});

exports.get_user_by_role = useAsync(async (req, res, next) => {
  try {
    const { role } = req.query;

    if (role) {
      const isRole = await roleServices.getAllRoleByTitle(role);

      if (isRole) {
        const { id } = isRole;

        const user = await usersServices.getRolesUser(id);

        if (user) {
          return res
            .status(200)
            .json(JParser("users fetch successfully", true, user));
        }
      } else {
        return res.status(404).json(JParser("invalid role", false, null));
      }
    } else {
      return res
        .status(400)
        .json(JParser("role params is required", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.user_profile = useAsync(async (req, res, next) => {
  try {
    const { username } = req.params;

    const user = await usersServices.findBy({ username });

    // password, apikey, token, roleId

    if (!user) {
      return res.status(404).json(JParser("profile not found", false, null));
    }

    const { password, token, ...data } = user.dataValues;

    return res.status(200).json(JParser("ok-response", true, data));
  } catch (error) {
    next(error);
  }
});

exports.update_username = useAsync(async (req, res, next) => {
  try {
    const { id } = req.user;
    const { username } = req.body;

    const user = await usersServices.findOne(id);

    if (!user) {
      return res.status(404).json(JParser("profile not found", false, null));
    }

    const isUsername = await usersServices.findBy({ username });

    if (isUsername && isUsername.id !== id) {
      return res.status(409).json(JParser("username is taken", false, null));
    }

    const update = await usersServices.update(user.id, { body: { username } });
    if (!update) {
      return res
        .status(500)
        .json(JParser("failed to update username", false, null));
    }

    const updatedUser = await usersServices.findBy({ username });
    const { password, token, ...data } = updatedUser.dataValues;

    return res.status(200).json(JParser("ok-response", true, data));
  } catch (error) {
    next(error);
  }
});

exports.getSwitchUserDatas = useAsync(async (req, res, next) => {
  try {
    if (
      typeof req?.business?.email === "string" &&
      req.business.email.trim() !== "" &&
      typeof req?.business?.token === "string" &&
      req.business.token.trim() !== ""
    ) {
      const userAcc = await getSimilarUserAccountDatas({
        email: req.business.email.trim(),
      });
      if (typeof userAcc?.error === "string") {
        return res.status(404).json(JParser(userAcc.error, false, null));
      }

      return res
        .status(200)
        .json(JParser("ok-response", true, { user: userAcc }));
    } else if (
      typeof req?.user?.email === "string" &&
      req.user.email.trim() !== "" &&
      typeof req?.user?.token === "string" &&
      req.user.token.trim() !== ""
    ) {
      const userAcc = await getSimilarBusinessAccountDatas({
        email: req.user.email.trim(),
      });
      if (typeof userAcc?.error === "string") {
        return res.status(404).json(JParser(userAcc.error, false, null));
      }

      return res
        .status(200)
        .json(JParser("ok-response", true, { business: userAcc }));
    }
    return res.status(404).json(JParser("Account not found", false, null));
  } catch (error) {
    next(error);
  }
});
exports.update_balance = useAsync(async (req, res, next) => {
  try {
    const { balance, userId, courseId } = req.body;

    if (!userId || !balance || !courseId) {
      return res
        .status(400)
        .json(JParser("Missing required fields", false, null));
    }

    const user = await usersServices.findOne(userId);
    if (!user) {
      return res.status(404).json(JParser("User not found", false, null));
    }

    const update = await usersServices.updateUserBalance(userId, balance);
    if (!update) {
      return res
        .status(500)
        .json(JParser("Failed to update balance", false, null));
    }

    let existingPurchase;
    try {
      existingPurchase = await purchasedCourse.findOne({
        where: { userId, courseId },
      });
    } catch (error) {
      console.error("Error checking purchased course:", error);
      return res
        .status(500)
        .json(JParser("Database error while checking purchase", false, null));
    }

    if (!existingPurchase) {
      try {
        await purchasedCourse.create({ userId, courseId });
        console.log("Course added to user's purchased courses:", courseId);
      } catch (error) {
        console.error("Error adding course to purchased courses:", error);
        return res
          .status(500)
          .json(
            JParser("Failed to add course to purchased courses", false, null)
          );
      }
    } else {
      console.log(
        "Course already exists in user's purchased courses:",
        courseId
      );
    }

    return res
      .status(200)
      .json(JParser("Balance updated successfully", true, { userId, balance }));
  } catch (error) {
    console.error("Unexpected error in update_balance:", error);
    return res.status(500).json(JParser("Internal Server Error", false, null));
  }
});
exports.update_balance_by_email = useAsync(async (req, res, next) => {
  try {
    const { userId, email, amount } = req.body;
    const sendUser = await User.findOne({
      where: { email },
    });
    const currentUser = await User.findOne({
      where: { id: userId },
    });
    console.log(sendUser, "sendUser");
    // const currentUser = await usersServices.findOne({ userId });
    if (!sendUser) {
      return res.status(404).json(JParser("Send User not found", false, null));
    }
    console.log(currentUser, "currentUser");
    if (!currentUser) {
      return res
        .status(404)
        .json(JParser("Current User not found", false, null));
    }
    const SendUserBalance =
      parseFloat(sendUser.dataValues.balance) + parseFloat(amount);
    console.log(SendUserBalance, "SendUserBalance");
    const CurrentUserAmount =
      parseFloat(currentUser.dataValues.balance) - parseFloat(amount);
    console.log(CurrentUserAmount, "CurrentUserAmount");
    const update = await usersServices.updateUserBalance(
      sendUser.dataValues.id,
      SendUserBalance
    );

    if (!update) {
      return res
        .status(500)
        .json(JParser("Failed to update balance", false, null));
    }
    const updateCurrent = await usersServices.updateUserBalance(
      currentUser.dataValues.id,
      CurrentUserAmount
    );
    if (!updateCurrent) {
      return res
        .status(500)
        .json(JParser("Failed to update balance", false, null));
    }

    return res
      .status(200)
      .json(JParser("Balance updated successfully", true, { email, amount }));
  } catch (error) {
    next(error);
  }
});

/**
 * Get the user account datas for given email
 */
async function getSimilarUserAccountDatas({ email = "" }) {
  const userObj = await usersServices.findBy({ email });
  if (
    !(
      typeof userObj?.dataValues?.id === "string" &&
      userObj.dataValues.id.trim() !== ""
    )
  ) {
    return { error: "No user account available" };
  }
  const role = await roleServices.findBy({ title: "admin" });
  if (
    typeof role?.dataValues?.id === "string" &&
    role.dataValues.id.trim() !== "" &&
    typeof userObj?.dataValues?.roleId === "string" &&
    role.dataValues.id.trim() === userObj.dataValues.roleId.trim()
  ) {
    return { error: "User has admin role" };
  }
  return { ...userObj?.dataValues, isUser: true, isPassword: true };
}

/**
 * Get the business account datas for given email
 */
async function getSimilarBusinessAccountDatas({ email = "" }) {
  const businessObj = await businessServices.findBy({ email });
  if (
    !(
      typeof businessObj?.dataValues?.id === "string" &&
      businessObj.dataValues.id.trim() !== ""
    )
  ) {
    return { error: "No user account available" };
  }

  return { ...businessObj?.dataValues, isBusiness: true, isPassword: true };
}
