const { bodyParser, authorize } = require("../middleware/middleware.protects");

const express = require("express");
const router = express.Router();
const CoreError = require("./../core/core.error");

const {
  index,
  authLogin,
  authRegister,
  businessLogin,
  associateLogin,
  userToken,
  verifyUserToken,
  resetUserPassword,
  businessToken,
  verifyBusinessToken,
  resetBusinessPassword,
  resetBusinessWithAuth,
  resetUserWithAuthToken,
  verifyUserEmail,
  verifyBusinessEmail,
  deactiveBusinessAcount,
  deactiveUserAccount,
  sendBusinessToken,
  associateVerify,

  resendUserEmailVerification,
  resendBusinessEmailVerification,
  adminLogin,
} = require("./../controllers/controller.auth");

const {
  add_user,

  old_password_reset,
  associate_verify,
  associate_login,
} = require("../middleware/validations/user.validation");

const {
  send_token,
  verify_token,
  reset_password,
  verify_email,
  deactivate_account,
} = require("../middleware/validations/auth.validation");

router.get("/", index);

router.post("/login", bodyParser, authLogin);

router.post("/associate-login", bodyParser, associate_login, associateLogin);

router.post("/associate-verify", bodyParser, associate_verify, associateVerify);

router.post("/register", bodyParser, add_user, authRegister);

// reset user token

router.post("/reset-user-token", bodyParser, send_token, userToken);

// verify user token
router.post("/verify-user-token", bodyParser, verify_token, verifyUserToken);

// reset user password
router.post(
  "/reset-user-password",
  bodyParser,
  reset_password,
  resetUserPassword
);

// reset user token
router.post("/reset-business-token", bodyParser, send_token, businessToken);

// verify business token
router.post(
  "/verify-business-token",
  bodyParser,
  verify_token,
  verifyBusinessToken
);

// reset business password
router.post(
  "/reset-business-password",
  bodyParser,
  reset_password,
  resetBusinessPassword
);

// business auth routes
router.post("/business-login", bodyParser, businessLogin);

// admin auth routes
router.post("/admin-login", bodyParser, adminLogin);

// reset user and business password
router.post(
  "/old-reset-user-password",
  authorize(["admin", "user", "business"]),
  old_password_reset,
  resetUserWithAuthToken
);

router.post(
  "/old-reset-business-password",
  authorize(["admin", "user", "business"]),

  old_password_reset,
  resetBusinessWithAuth
);

// send token
router.post(
  "/user-token",
  authorize(["admin", "user", "business"]),
  send_token,
  resetUserWithAuthToken
);

router.post(
  "/resend-user-email-verification",
  send_token,
  resendUserEmailVerification
);

router.post(
  "/resend-business-email-verification",

  send_token,
  resendBusinessEmailVerification
);

router.post(
  "/business-token",
  authorize(["business"]),
  bodyParser,
  send_token,
  sendBusinessToken
);

// verify signup email

router.post("/verify-user-email", bodyParser, verify_email, verifyUserEmail);

router.post(
  "/verify-business-email",
  bodyParser,
  verify_email,
  verifyBusinessEmail
);

router.post(
  "/user-deactivate",
  authorize(["user", "admin", "business"]),
  bodyParser,
  deactivate_account,
  deactiveUserAccount
);

router.post(
  "/business-deactivate",
  authorize(["business"]),
  bodyParser,

  deactivate_account,
  deactiveBusinessAcount
);

router.all("/*", (req, res) => {
  throw new CoreError(
    `route not found ${req.originalUrl} using ${req.method} method`,
    404
  );
});
module.exports = router;
