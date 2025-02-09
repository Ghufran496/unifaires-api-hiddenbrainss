const sha1 = require("sha1");
const crypto = require("crypto");

const Joi = require("joi");
const usersServices = require("../services/users.services");
const roleServices = require("../services/role.service");
const businessServices = require("../services/business.services");
const associateUserServices = require("../services/associate.user.services");

const ndigit = require("n-digit-token");

const subscriptionServices = require("../services/subscription.services");
const { useAsync, utils, errorHandle } = require("./../core");

const { JParser } = require("../core/core.utils");
const tokenServices = require("../services/token.services");
const sendgridServices = require("../services/sendgrid.services");
const virtualAccountServices = require("../services/virtual.account.services");

exports.index = useAsync(async (req, res) => {
  res.json(utils.JParser("Welcome to auth api", true, {}));
});

exports.authLogin = useAsync(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const userSchema = Joi.object({
      email: Joi.string().email({ minDomainSegments: 2 }).required(),
      password: Joi.string()
        .pattern(
          new RegExp(
            /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,30}$/
          )
        )
        .required()
        .messages({
          "string.pattern.base":
            "Password must contain one digit from 1 to 9, one lowercase letter, one uppercase letter, one special character, no space, and it must be 8-30 characters long.",
        }),
    });

    const validator = await userSchema.validateAsync({ email, password });
    validator.password = sha1(validator.password);

    const user = await usersServices.loginFindBy(validator);

    if (!user) {
      return res
        .status(400)
        .json(utils.JParser("Invalid credentials", false, null));
    }

    // check if the user is verify

    if (!user.isEmailVerify) {
      return res.status(202).json(
        JParser("awaiting email verification", false, {
          isEmailVerify: false,
        })
      );
    }

    // check if the status is true

    if (!user.status) {
      return res
        .status(403)
        .json(
          JParser(
            "this account is current disable, contact support for assistance",
            false,
            null
          )
        );
    }

    // Now check admin role by ravi chauhan

    const role = await roleServices.findBy({ title: "admin" });
    if (role.dataValues.id === user.dataValues.roleId) {
      return res.status(202).json(
        JParser("Please check this is admin or inhour unifaires", false, {
          isEmailVerify: false,
        })
      );
    }

    const matchedUser = user;
    validator.apiKey = sha1(validator.email + new Date().toISOString);
    validator.token = sha1(validator.email + new Date().toISOString);

    const subscribe = await subscriptionServices.findByUserId(user.id);
    const virtualAccount = await virtualAccountServices.findBy({
      userId: user.id,
    });

    matchedUser.dataValues.virtualAccount = virtualAccount;

    if (subscribe && subscribe.status === "active") {
      matchedUser.dataValues.isSubscribe = true;
      matchedUser.dataValues.subscribe = subscribe;
    } else {
      matchedUser.dataValues.isSubscribe = false;
      matchedUser.dataValues.subscribe = false;
    }
    matchedUser.dataValues.isBusiness = false;
    const isBusiness = await businessServices.findBy({ email });
    matchedUser.dataValues.isPassword = false;
    if (isBusiness) {
      const { email, password } = validator;
      const isPassword = await businessServices.findBy({ email, password });
      if (isPassword) {
        matchedUser.dataValues.isPassword = true;
      }
    }

    await matchedUser.update({
      apiKey: validator.apiKey,
      token: validator.token,
    });

    // check if the user is an associate users

    const isAssociate = await associateUserServices.findAllBy({
      associateId: matchedUser.id,
    });

    if (isAssociate.length > 0) {
      const ids = isAssociate
        .map((associate) => {
          if (associate.userId) {
            return associate.userId;
          } else if (associate.businessId) {
            return associate.businessId;
          }
          return null;
        })
        .filter((id) => id !== null);

      matchedUser.dataValues.isAssociate = true;
      matchedUser.dataValues.associatedAcounts = ids;
    } else {
      matchedUser.dataValues.isAssociate = false;
    }

    return res.json(utils.JParser("OK response", !!matchedUser, matchedUser));
  } catch (e) {
    throw new errorHandle(e.message, 202);
  }
});

exports.adminLogin = useAsync(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const userSchema = Joi.object({
      email: Joi.string().email({ minDomainSegments: 2 }).required(),
      password: Joi.string()
        .pattern(
          new RegExp(
            /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,30}$/
          )
        )
        .required()
        .messages({
          "string.pattern.base":
            "Password must contain one digit from 1 to 9, one lowercase letter, one uppercase letter, one special character, no space, and it must be 8-30 characters long.",
        }),
    });

    // check admin roles

    const role = await roleServices.findBy({ title: "admin" });

    if (!role) {
      return res
        .status(403)
        .json(JParser("contact admin for support", false, null));
    }

    // get user record by roleId

    const isAdmin = await usersServices.findBy({ email, roleId: role.id });

    if (!isAdmin) {
      return res.status(403).json(JParser("unauthorized", false, null));
    }

    const validator = await userSchema.validateAsync({ email, password });
    validator.password = sha1(validator.password);

    const user = await usersServices.loginFindBy(validator);

    if (!user) {
      return res
        .status(400)
        .json(utils.JParser("Invalid credentials", false, null));
    }

    // check if the user is verify

    if (!user.isEmailVerify) {
      return res.status(202).json(
        JParser("awaiting email verification", false, {
          isEmailVerify: false,
        })
      );
    }

    // check if the status is true

    if (!user.status) {
      return res
        .status(403)
        .json(
          JParser(
            "this account is current disable, contact support for assistance",
            false,
            null
          )
        );
    }

    const matchedUser = user;
    validator.apiKey = sha1(validator.email + new Date().toISOString);
    validator.token = sha1(validator.email + new Date().toISOString);

    const subscribe = await subscriptionServices.findByUserId(user.id);
    const virtualAccount = await virtualAccountServices.findBy({
      userId: user.id,
    });

    matchedUser.dataValues.virtualAccount = virtualAccount;

    if (subscribe && subscribe.status === "active") {
      matchedUser.dataValues.isSubscribe = true;
      matchedUser.dataValues.subscribe = subscribe;
    } else {
      matchedUser.dataValues.isSubscribe = false;
      matchedUser.dataValues.subscribe = false;
    }
    matchedUser.dataValues.isBusiness = false;

    await matchedUser.update({
      apiKey: validator.apiKey,
      token: validator.token,
    });

    // check if the user is an associate users

    const isAssociate = await associateUserServices.findAllBy({
      associateId: matchedUser.id,
    });

    if (isAssociate.length > 0) {
      const ids = isAssociate
        .map((associate) => {
          if (associate.userId) {
            return associate.userId;
          } else if (associate.businessId) {
            return associate.businessId;
          }
          return null;
        })
        .filter((id) => id !== null);

      matchedUser.dataValues.isAssociate = true;
      matchedUser.dataValues.associatedAcounts = ids;
    } else {
      matchedUser.dataValues.isAssociate = false;
    }

    return res.json(utils.JParser("OK response", !!matchedUser, matchedUser));
  } catch (e) {
    throw new errorHandle(e.message, 202);
  }
});

exports.authRegister = useAsync(async function (req, res, next) {
  try {
    // Check if roles exist on the system
    const isRole = await roleServices.all();

    if (isRole && isRole.length) {
      // Validate email
      const { email } = req.body;
      const isEmail = await usersServices.verifyEmail(email);

      if (isEmail) {
        return res
          .status(400)
          .json(utils.JParser("Email already exists", false, null));
      }

      // Register user
      const value = req.body;

      const verificationToken = crypto.randomBytes(30).toString("hex");
      const verificationLink = `${process.env.FRONT_APP_URL}/verify/${verificationToken}?email=${email}`;

      // Rebuild user object
      value.apiKey = sha1(value.email + new Date().toISOString());
      value.token = sha1(value.email + new Date().toISOString());
      value.password = sha1(value.password);

      // Generate username
      let username = `${req.body.firstname}-${req.body.lastname}`.toLowerCase();

      username = username.replace(/[^\w-]/g, "").replace(/\s+/g, "-");

      // If username starts with a number, remove the number
      if (/^\d/.test(username)) {
        username = username.replace(/^\d+/, "");
      }

      let isUsernameTaken = true;
      let counter = 1;

      while (isUsernameTaken) {
        const potentialUsername =
          counter === 1 ? username : `${username}${counter}`;
        const isUser = await usersServices.findBy({
          username: potentialUsername,
        });

        if (!isUser) {
          value.username = potentialUsername;
          isUsernameTaken = false;
        } else {
          counter++;
        }
      }

      // Get the user role id
      if (!value.roleId) {
        const role = await roleServices.findBy({ title: "user" });

        if (!role) {
          return res
            .status(400)
            .json(
              utils.JParser(
                "Something went wrong, contact support",
                false,
                null
              )
            );
        }

        value.roleId = role.id;

        // Create user
        const [user, created] = await usersServices.findOrCreate(
          value.email,
          value
        );

        // Indicate if the user is new
        let newUser = JSON.parse(JSON.stringify(user));
        newUser["created"] = created;

        // Send a welcome email here
        if (created) {
          // store the token to model
          const expirationTime = new Date();

          expirationTime.setMinutes(expirationTime.getMinutes() + 15);

          const data = {
            userId: user.id,
            email,
            token: verificationToken,
            expiredAt: expirationTime.toISOString(),
          };

          const storeToken = await tokenServices.store(data);

          if (storeToken) {
            // send the mail
            await sendgridServices.accountVerification({
              email,
              verificationLink,
              firstname: req.body.firstname,
            });

            return res.json(
              utils.JParser("Registration is successful", true, newUser)
            );
          }
        }
      }
    } else {
      return res
        .status(404)
        .json(utils.JParser("No registered role on the system", false, null));
    }
  } catch (error) {
    next(error);
  }
});

// business auth register
exports.businessRegister = useAsync(async function (req, res, next) {
  // validate permissions
  try {
    const { email, companyName } = req.body;

    // Check business role existence
    const businessRole = await roleServices.findBy({ title: "business" });

    if (!businessRole) {
      return res
        .status(404)
        .json(utils.JParser("Business role not found", false, null));
    }

    // Check if email already exists
    const isEmail = await businessServices.findBy({ email });

    if (isEmail) {
      return res
        .status(404)
        .json(utils.JParser("Email already exists", false, null));
    }

    // Check if company name already exists
    const isCompany = await businessServices.findBy({ companyName });

    if (isCompany) {
      return res
        .status(400)
        .json(
          utils.JParser("Company of the same name already exists", false, null)
        );
    }

    let username =
      "b-" +
      companyName
        .toLowerCase()
        .replace(/[^\w-]/g, "")
        .replace(/\s+/g, "-");

    // Remove number if the username starts with it
    if (/^[0-9]/.test(username)) {
      username = username.replace(/^\d+/, "");
    }

    let isUsernameTaken = true;
    let counter = 1;

    while (isUsernameTaken) {
      const potentialUsername =
        counter === 1 ? username : `${username}${counter}`;
      const isUser = await businessServices.findBy({
        username: potentialUsername,
      });

      if (!isUser) {
        req.body.username = potentialUsername;
        isUsernameTaken = false;
      } else {
        counter++;
      }
    }

    const value = req.body;

    const verificationToken = crypto.randomBytes(30).toString("hex");
    const verificationLink = `${process.env.FRONT_APP_URL}/verify-business/${verificationToken}?email=${email}`;
    // Rebuild user object
    value.roleId = businessRole.id;
    value.apiKey = sha1(value.email + new Date().toISOString + "business");
    value.token = sha1(value.email + new Date().toISOString + "business");
    value.password = sha1(value.password);

    // Insert into the database
    const [user, created] = await businessServices.findOrCreate(
      value.email,
      value
    );

    if (created) {
      // store token and mail token

      const expirationTime = new Date();

      expirationTime.setMinutes(expirationTime.getMinutes() + 15);

      const data = {
        businessId: user.id,
        email,
        token: verificationToken,
        expiredAt: expirationTime.toISOString(),
      };

      const storeToken = await tokenServices.store(data);

      if (storeToken) {
        // send the mail
        await sendgridServices.accountVerification({
          email,
          verificationLink,
          firstname: req.body.companyName,
        });

        // Indicate if the user is new
        let newUser = JSON.parse(JSON.stringify(user));
        newUser["created"] = created;

        return res.json(
          utils.JParser("Registration is successful", true, newUser)
        );
      }
    }
  } catch (error) {
    next(error);
  }
});

// business auth login
exports.businessLogin = useAsync(async (req, res, next) => {
  try {
    //create data if all data available
    const schema = Joi.object({
      email: Joi.string().email({ minDomainSegments: 2 }).required(),
      password: Joi.string()
        .pattern(
          new RegExp(
            /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,30}$/
          )
        )
        .required()
        .messages({
          "string.pattern.base":
            "Password must contain one digit from 1 to 9, one lowercase letter, one uppercase letter, one special character, no space, and it must be 8-30 characters long.",
        }),
    });

    const { email, password } = req.body;

    const validator = await schema.validateAsync({ email, password });

    validator.password = sha1(validator.password);

    const business = await businessServices.findBy(validator);

    if (!business) {
      return res
        .status(400)
        .json(utils.JParser("invalid credentials", false, null));
    }

    if (!business.isEmailVerify) {
      return res.status(202).json(
        utils.JParser("awaiting email verification", false, {
          isEmailVerify: false,
        })
      );
    }

    // check the account status
    if (!business.status) {
      return res
        .status(403)
        .json(
          JParser(
            "this account is current disable, contact support for assistance",
            false,
            null
          )
        );
    }

    validator.apiKey = sha1(
      validator.email + new Date().toISOString + "business"
    );
    validator.token = sha1(
      validator.email + new Date().toISOString + "business"
    );

    await business.update({
      apiKey: validator.apiKey,
      token: validator.token,
    });
    business.dataValues.isPassword = false;
    const isUser = await usersServices.findBy({ email });
    business.dataValues.isPassword = false;
    if (isUser) {
      const { email, password } = validator;
      const isPassword = await usersServices.findBy({ email, password });

      if (isPassword) {
        business.dataValues.isPassword = true;
      }
    }

    return res.json(utils.JParser("ok-response", !!business, business));
  } catch (e) {
    throw new errorHandle(e.message, 202);
  }
});

// associate user login
exports.associateVerify = useAsync(async (req, res, next) => {
  try {
    const { token, email } = req.body;

    const user = await usersServices.findBy({ email });

    if (!user) {
      return res
        .status(400)
        .json(utils.JParser("invalid email address", false, null));
    }

    const isAssociate = await associateUserServices.findOneBy({
      voucher: token,
      [`associateId`]: user.id,
    });

    if (!isAssociate) {
      return res.status(401).json(utils.JParser("invalid token", false, null));
    }

    // check if their is password

    let data = {};

    if (user.password === null) {
      data["isPassword"] = false;
    } else {
      data["isPassword"] = true;
    }
    return res.json(utils.JParser("ok-response", true, data));
  } catch (e) {
    throw new errorHandle(e.message, 202);
  }
});

exports.associateLogin = useAsync(async (req, res, next) => {
  try {
    // validate the token supply
    const { token, email, password } = req.body;

    const user = await usersServices.findBy({ email });

    if (!user) {
      res.status(400).json(utils.JParser("invalid email address", false, null));

      return;
    }

    const isUser = await associateUserServices.findOneBy({
      voucher: token,
      associateId: user.id,
    });

    if (isUser) {
      // validate the password
      let validatePassword = sha1(password);

      const isValid = await usersServices.findBy({
        email,
        password: validatePassword,
      });

      if (!isValid) {
        res.status(400).json(utils.JParser("Invalid password", false, null));
        return;
      }

      // verify password
      const schema = Joi.object({
        email: Joi.string(),
      });
      //capture user data

      //validate user
      const validator = await schema.validateAsync({ email });

      const matchedUser = isValid;

      validator.apiKey = sha1(validator.email + new Date().toISOString);
      validator.token = sha1(validator.email + new Date().toISOString);

      await matchedUser.update({
        apiKey: validator.apiKey,
        token: validator.token,
      });

      return res.json(utils.JParser("ok-response", !!matchedUser, matchedUser));
    } else {
      return res.status(400).json(utils.JParser("invalid token", false, null));
    }
  } catch (e) {
    throw new errorHandle(e.message, 202);
  }
});

// send token to user
exports.userToken = useAsync(async (req, res, next) => {
  try {
    const { email, firstname } = req.body;

    // get user record
    const user = await usersServices.findBy({ email });

    if (!user) {
      return res.status(400).json(JParser("email does not exist", false, null));
    }

    const token = ndigit.gen(6);

    const expirationTime = new Date();

    expirationTime.setMinutes(expirationTime.getMinutes() + 15);

    const data = {
      userId: user.id,
      email,
      token,
      expiredAt: expirationTime.toISOString(),
    };

    // change all other user tokens to false
    const update = await tokenServices.changeUserStatus(user.id, false);

    if (!update) {
      return res
        .status(400)
        .json(JParser("something went wrong, try again", false, null));
    }

    const newStore = await tokenServices.store(data);

    if (!newStore) {
      return res.status(400).json(JParser("something went wrong", false, null));
    }

    // send the forget password mail
    await sendgridServices.userToken({
      email,
      token,
      firstname: user?.firstname,
    });

    return res.status(200).json(JParser("ok-response", true, {}));
  } catch (error) {
    next(error);
  }
});

// verify token
exports.verifyUserToken = useAsync(async (req, res, next) => {
  try {
    const { email, token } = req.body;

    // get user record
    const user = await usersServices.findBy({ email });

    if (user) {
      // verify token

      const isToken = await tokenServices.findBy({
        token,
        userId: user.id,
        status: true,
      });

      if (isToken) {
        const currentTime = new Date();
        const expirationTime = new Date(isToken.expiredAt);

        if (expirationTime > currentTime) {
          await usersServices.update(user.id, { isEmailVerify: 1 });

          return res.status(200).json(JParser("valid token123", true, isToken));
        } else {
          return res.status(400).json(JParser("expired token", false, null));
        }
      } else {
        return res.status(400).json(JParser("invalid token", false, null));
      }
    } else {
      return res.status(400).json(JParser("email does not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});

// change password
exports.resetUserPassword = useAsync(async (req, res, next) => {
  try {
    const { email, token } = req.body;

    // get user record
    const user = await usersServices.findBy({ email });

    if (!user) {
      return res.status(400).json(JParser("email does not exist", false, null));
    }

    // verify token
    const isToken = await tokenServices.findBy({
      token,
      email,
      status: true,
    });

    if (!isToken) {
      return res
        .status(400)
        .json(JParser("invalid or expired token", false, null));
    }

    // set the new password
    const password = sha1(req.body.password);
    req.body = {
      password,
    };

    const update = await usersServices.update(user.id, req);

    if (!update) {
      return res
        .status(400)
        .json(JParser("password reset failed", false, null));
    }

    // change the token status to false
    const tokenData = {
      body: {
        status: false,
        userId: user.id,
      },
    };

    await tokenServices.update(isToken.id, tokenData);

    return res
      .status(200)
      .json(JParser("password reset successfully", true, {}));
  } catch (error) {
    next(error);
  }
});

// send token to business
exports.businessToken = useAsync(async (req, res, next) => {
  try {
    const { email } = req.body;

    // get user record
    const business = await businessServices.findBy({ email });

    if (!business) {
      return res.status(400).json(JParser("email does not exist", false, null));
    }

    const { companyName } = business;
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 15);

    const token = ndigit.gen(6);

    const data = {
      businessId: business.id,
      email,
      token,
      expiredAt: expirationTime,
    };

    // turn all token for this user to false
    const update = await tokenServices.changeBusinessStatus(business.id, false);

    if (!update) {
      return res
        .status(400)
        .json(JParser("something went wrong, try again", false, null));
    }

    const store = await tokenServices.store(data);

    if (!store) {
      return res
        .status(400)
        .json(JParser("something went wrong, try again", false, null));
    }

    // send the mail
    await sendgridServices.forgetPassword({
      email,
      token,
      firstname: companyName,
    });

    return res.status(200).json(JParser("ok-response", true, {}));
  } catch (error) {
    next(error);
  }
});

// verify token
exports.verifyBusinessToken = useAsync(async (req, res, next) => {
  try {
    const { email, token } = req.body;

    // get user record
    const business = await businessServices.findBy({ email });

    if (!business) {
      return res.status(400).json(JParser("email does not exist", false, null));
    }

    // verify token

    const isToken = await tokenServices.findBy({
      token,
      businessId: business.id,
      status: true,
    });

    if (!isToken) {
      return res.status(400).json(JParser("invalid token", false, null));
    }

    const currentTime = new Date();
    const expirationTime = new Date(isToken.expiredAt);

    if (expirationTime > currentTime) {
      return res.status(200).json(JParser("valid token", true, isToken));
    } else {
      return res.status(400).json(JParser("expired token", false, null));
    }
  } catch (error) {
    next(error);
  }
});

// change password
exports.resetBusinessPassword = useAsync(async (req, res, next) => {
  try {
    const { email, token } = req.body;

    // get user record
    const business = await businessServices.findBy({ email });

    if (!business) {
      return res.status(400).json(JParser("email does not exist", false, null));
    }

    // verify token

    const isToken = await tokenServices.findBy({
      token,
      businessId: business.id,
      status: true,
    });

    if (!isToken) {
      return res.status(400).json(JParser("invalid token", false, null));
    }

    //  set the new password

    const currentTime = new Date();
    const expirationTime = new Date(isToken.expiredAt);

    const password = sha1(req.body.password);
    req.body = {
      password,
    };

    const update = await businessServices.update(business.id, req);

    if (update) {
      // change the status of the token

      const tokenData = {
        body: {
          status: false,
          businessId: business.id,
        },
      };

      await tokenServices.update(isToken.id, tokenData);
      return res.status(200).json(JParser("ok-response", true, {}));
    }
  } catch (error) {
    next(error);
  }
});

// reset user password with previous password
exports.resetUserWithAuthToken = useAsync(async (req, res, next) => {
  try {
    const { oldPassword, password } = req.body;

    const { id: userId, email } = req.user;

    const userSchema = Joi.object({
      email: Joi.string().email({ minDomainSegments: 2 }).required(),
      password: Joi.string()
        .pattern(
          new RegExp(
            /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,30}$/
          )
        )
        .required()
        .messages({
          "string.pattern.base":
            "Password must contain one digit from 1 to 9, one lowercase letter, one uppercase letter, one special character, no space, and it must be 8-30 characters long.",
        }),
    });

    const validator = await userSchema.validateAsync({
      email,
      password: oldPassword,
    });

    validator.password = sha1(validator.password);

    const user = await usersServices.findBy(validator);

    if (!user) {
      return res
        .status(400)
        .json(utils.JParser("Invalid credentials", false, null));
    }

    // reset the password
    const newPassword = sha1(password);
    const data = {
      body: {
        password: newPassword,
      },
    };
    const resetUser = await usersServices.update(userId, data);

    if (resetUser) {
      return res.status(200).json(JParser("ok-response", true, {}));
    }
  } catch (e) {
    throw new errorHandle(e.message, 202);
  }
});

exports.resetBusinessWithAuth = useAsync(async (req, res, next) => {
  try {
    const { oldPassword, password } = req.body;

    const { id: businessId, email } = req.business;

    const userSchema = Joi.object({
      email: Joi.string().email({ minDomainSegments: 2 }).required(),
      password: Joi.string()
        .pattern(
          new RegExp(
            /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,30}$/
          )
        )
        .required()
        .messages({
          "string.pattern.base":
            "Password must contain one digit from 1 to 9, one lowercase letter, one uppercase letter, one special character, no space, and it must be 8-30 characters long.",
        }),
    });

    const validator = await userSchema.validateAsync({
      email,
      password: oldPassword,
    });
    validator.password = sha1(validator.password);

    const user = await businessServices.findBy(validator);

    if (!user) {
      return res
        .status(400)
        .json(utils.JParser("Invalid credentials", false, null));
    }

    // reset the password
    const newPassword = sha1(password);
    const data = {
      body: {
        password: newPassword,
      },
    };
    const resetUser = await businessServices.update(businessId, data);

    if (resetUser) {
      return res.status(200).json(JParser("ok-response", true, {}));
    }
  } catch (e) {
    throw new errorHandle(e.message, 202);
  }
});

// send token to user
exports.sendUserToken = useAsync(async (req, res, next) => {
  try {
    const { email } = req.body;

    // get user record

    const user = await usersServices.findBy({ email });

    if (!user) {
      return res.status(404).json(JParser("email does not exist", false, null));
    }

    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 15);

    const { firstname } = user;
    const token = ndigit.gen(6);

    const data = {
      userId: user.id,
      email,
      token,
      expiredAt: expirationTime.toISOString(),
    };

    // change all other user token to false

    const update = await tokenServices.changeUserStatus(user.id, false);

    if (update) {
      const store = await tokenServices.store(data);

      if (store) {
        // send the mail
        await sendgridServices.userToken({
          email,
          token,
          firstname,
        });

        return res.status(200).json(JParser("ok-response", true, {}));
      }
    }
  } catch (error) {
    next(error);
  }
});

exports.sendBusinessToken = useAsync(async (req, res, next) => {
  try {
    const { email } = req.body;

    // get user record

    const business = await businessServices.findBy({ email });

    if (!business) {
      return res.status(400).json(JParser("email does not exist", false, null));
    }

    const { companyName } = business;
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 15);

    const token = ndigit.gen(6);

    const data = {
      businessId: business.id,
      email,
      token,
      expiredAt: expirationTime,
    };

    // turn all token for this user to false
    const update = await tokenServices.changeBusinessStatus(business.id, false);

    if (update) {
      const store = await tokenServices.store(data);

      if (store) {
        // send the mail
        await sendgridServices.businessToken({
          email,
          token,
          firstname: companyName,
        });

        return res.status(200).json(JParser("ok-response", true, {}));
      }
    }
  } catch (error) {
    next(error);
  }
});

// verify user email and change the isEmailVerify to true
exports.verifyUserEmail = useAsync(async (req, res, next) => {
  try {
    const { email, token } = req.body;

    // get user record
    const user = await usersServices.findBy({ email });

    if (!user) {
      return res.status(400).json(JParser("email does not exist", false, null));
    }

    // verify token

    const isToken = await tokenServices.findBy({
      token,
      email,
      status: true,
    });

    if (!isToken) {
      return res.status(404).json(JParser("invalid token ", false, null));
    }

    //  set the new password

    const data = {
      body: {
        isEmailVerify: true,
      },
    };

    const update = await usersServices.update(user.id, data);

    if (update) {
      // change the tokens status to false

      const tokenData = {
        body: {
          status: false,
          userId: user.id,
        },
      };

      await tokenServices.update(isToken.id, tokenData);

      return res.status(200).json(JParser("ok-response", true, {}));
    }
  } catch (error) {
    next(error);
  }
});

exports.verifyBusinessEmail = useAsync(async (req, res, next) => {
  try {
    const { email, token } = req.body;

    // get user record
    const business = await businessServices.findBy({ email });

    if (!business) {
      return res.status(404).json(JParser("email does not exist", false, null));
    }

    const isToken = await tokenServices.findBy({
      token,
      businessId: business.id,
      status: true,
    });

    if (!isToken) {
      return res.status(404).json(JParser("invalid token", false, null));
    }

    //  set the new password

    const data = {
      body: {
        isEmailVerify: true,
      },
    };
    const update = await businessServices.update(business.id, data);

    if (update) {
      return res.status(200).json(JParser("ok-response", true, {}));
    }
  } catch (error) {
    next(error);
  }
});

// deactivate user account
exports.deactiveUserAccount = useAsync(async (req, res, next) => {
  try {
    const { token } = req.body;
    const { email, id: userId } = req.user;

    const isToken = await tokenServices.findBy({
      token,
      email,
      status: true,
    });

    if (!isToken) {
      return res.status(400).json(JParser("invalid token", false, null));
    }

    req.body = {
      status: false,
    };

    const update = await usersServices.update(userId, req);

    if (update) {
      // change the tokens status to false

      const tokenData = {
        body: {
          status: false,
          userId: userId,
        },
      };

      await tokenServices.update(isToken.id, tokenData);

      return res.status(200).json(JParser("ok-response", true, null));
    }
  } catch (error) {
    next(error);
  }
});

// deactive business account
exports.deactiveBusinessAcount = useAsync(async (req, res, next) => {
  try {
    const { token } = req.body;

    const { id: businessId } = req.business;

    const isToken = await tokenServices.findBy({
      token,
      businessId: businessId,
      status: true,
    });

    if (!isToken) {
      return res.status(400).json(JParser("invalid token", false, null));
    }

    req.body = {
      status: false,
    };

    const update = await businessServices.update(businessId, req);

    if (update) {
      // change the status of the token

      const tokenData = {
        body: {
          status: false,
          businessId: businessId,
        },
      };

      await tokenServices.update(isToken.id, tokenData);
      return res
        .status(200)
        .json(JParser("account deactivated successfully", true, {}));
    } else {
      return res
        .status(400)
        .json(JParser("account deactivatedfailed", false, null));
    }
    // }
  } catch (error) {
    next(error);
  }
});

// reset email verification link
exports.resendUserEmailVerification = useAsync(async function (req, res, next) {
  try {
    const { email } = req.body;

    const isUser = await usersServices.verifyEmail(email);

    if (!isUser) {
      return res
        .status(400)
        .json(utils.JParser("Invalid email address", false, null));
    }

    // Register user

    const verificationToken = crypto.randomBytes(30).toString("hex");

    const verificationLink = `${process.env.FRONT_APP_URL}/verify/${verificationToken}?email=${email}`;

    // Send a welcome email here

    // store the token to model
    const expirationTime = new Date();

    expirationTime.setMinutes(expirationTime.getMinutes() + 15);

    const data = {
      userId: isUser.id,
      email,
      token: verificationToken,
      expiredAt: expirationTime.toISOString(),
    };

    const storeToken = await tokenServices.store(data);

    if (storeToken) {
      // send the mail
      const { success } = await sendgridServices.accountVerification({
        email,
        verificationLink,
        firstname: isUser.firstname,
      });

      if (success) {
        return res.json(utils.JParser("ok-response", true, null));
      }
    }
  } catch (error) {
    next(error);
  }
});

// reset business email verification link
exports.resendBusinessEmailVerification = useAsync(async function (
  req,
  res,
  next
) {
  try {
    const { email } = req.body;

    const isBusiness = await businessServices.findBy({ email });

    if (!isBusiness) {
      return res
        .status(400)
        .json(utils.JParser("Invalid email address", false, null));
    }

    const verificationToken = crypto.randomBytes(30).toString("hex");

    const verificationLink = `${process.env.FRONT_APP_URL}/verify-business/${verificationToken}?email=${email}`;

    // Send a welcome email here

    // store the token to model
    const expirationTime = new Date();

    expirationTime.setMinutes(expirationTime.getMinutes() + 15);

    const data = {
      businessId: isBusiness.id,
      email,
      token: verificationToken,
      expiredAt: expirationTime.toISOString(),
    };

    const storeToken = await tokenServices.store(data);

    if (storeToken) {
      // send the mail
      const { success } = await sendgridServices.accountVerification({
        email,
        verificationLink,
        firstname: isBusiness.companyName,
      });

      if (success) {
        return res.json(utils.JParser("ok-response", true, []));
      }
    }
  } catch (error) {
    next(error);
  }
});
