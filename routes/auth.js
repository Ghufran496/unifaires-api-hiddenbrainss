const express = require("express");
const router = express.Router();
const { login, auth_email } = require("../controllers/auth.controller");

const {
  email_auth_validation,
  login_validation,
} = require("../middleware/validations/auth.validation");
const { bodyParser } = require("../middleware/middleware.protects");
const { useAsync } = require("../core");

router.post("/login", bodyParser, login_validation, useAsync(login));
router.get("/email", email_auth_validation, useAsync(auth_email));

module.exports = router;
