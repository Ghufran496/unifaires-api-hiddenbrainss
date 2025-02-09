const tokenServices = require("../services/token.services");
const emailServices = require("../services/email.services");
const usersServices = require("../services/users.services");

const ndigit = require("n-digit-token");

exports.index = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.store = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.get_by_id = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.destroy = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.send_token = async (req, res, next) => {
  try {
    const { email } = req.body;

    // check if email exist

    const isUser = await usersServices.getUserByEmail(email);

    if (isUser) {
      const token = ndigit.gen(6);
      // Send email confirmation
      const emailVerify = await emailServices.sendToken({
        email,
        token,
      });

      if (emailVerify) {
        const createToken = await tokenServices.storeToken({
          token,
          email,
        });

        if (createToken) {
          res.status(201).send({
            success: true,
            message: "token resend successfully",
            data: null,
          });
        } else {
          return res.status(400).json({
            status: false,
            message: "failed to resend token",
            data: null,
          });
        }
      } else {
        return res.status(400).json({
          status: false,
          message: "failed to email token",
          data: null,
        });
      }
    } else {
      return res.status(400).json({
        status: false,
        message: "invalid email address",
        data: null,
      });
    }
  } catch (error) {
    next(error);
  }
};
