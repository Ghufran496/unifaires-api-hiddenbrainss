const express = require("express");
const router = express.Router();

const {
  add_virtual_account,
  update_virtual_account,
  validate_bill_validation,
  add_enrolcourse,
  authorize_course_card,
  authorize_course_card_otp,
  filter_courses,
  add_job_posting_card_validation,
  add_job_posting_authorize_card_validation,
  add_funding_posting_card_validation,
  add_funding_posting_authorize_card_validation,
  add_invite_posting_authorize_card_validation,
  add_invite_posting_card_validation,
  add_course_posting_card_validation,
  add_course_posting_card_authorize_validation,
  add_course_posting_card_otp_validation,
} = require("../middleware/validations/flutterwave.payment.validation");

const {
  create_user_virtual_account,
  get_virtual_account,
  get_airtime_billers,
  get_data_billers,
  get_power_billers,
  get_cable_billers,
  validate_bill,
  flutterwave_authorize_course_card,
  flutterwave_card_otp,
  flutterwave_course_card,
  flutterwave_business_job_posting_card,
  flutterwave_business_job_posting_authorize_card,
  flutterwave_business_job_posting_authorize_otp,
  flutterwave_business_funding_posting_card,
  flutterwave_business_funding_posting_authorize_card,
  flutterwave_business_funding_posting_authorize_otp,
  flutterwave_business_invite_posting_authorize_card,
  flutterwave_business_invite_posting_authorize_otp,
  flutterwave_business_invite_posting_card,
  free_course_posting_payment,
  free_course_posting_card_authorize,
  free_course_posting_card_authorize_otp,
} = require("../controllers/flutterwave.payment.controller");

const {
  bodyParser,
  authorize,
  manageAccountAuth,
} = require("../middleware/middleware.protects");

// create virtual account

router.post(
  "/user-virtual-bank-account",
  bodyParser,
  authorize(["admin", "business", "user"]),
  add_virtual_account,
  create_user_virtual_account
);

router.get(
  "/virtual-bank-account/:orderRef",
  authorize(["business", "user", "admin"]),
  add_virtual_account,
  get_virtual_account
);

router.get(
  "/airtime-billers",
  authorize(["business", "user", "admin"]),
  get_airtime_billers
);

router.get(
  "/data-billers",
  authorize(["business", "user", "admin"]),
  get_data_billers
);

router.get(
  "/power-billers",
  authorize(["business", "user", "admin"]),
  get_power_billers
);

router.get(
  "/cable-billers",
  authorize(["business", "user", "admin"]),
  get_cable_billers
);

// validate bills
router.post(
  "/validate-bill",
  bodyParser,
  authorize(["business", "user", "admin"]),
  validate_bill_validation,
  validate_bill
);

// course card payment
router.post(
  "/course-card",
  authorize(["user", "admin"]),
  filter_courses,
  add_enrolcourse,
  flutterwave_course_card
);

// card authourize
router.post(
  "/course-card-authorize",
  authorize(["user", "admin"]),
  filter_courses,
  authorize_course_card,
  flutterwave_authorize_course_card
);

// card authourize
router.post(
  "/course-card-otp",
  authorize(["user", "admin"]),
  authorize_course_card_otp,
  flutterwave_card_otp
);

/*
  jobs posting
*/
// job card payment
router.post(
  "/job-card",
  authorize(["business"]),
  add_job_posting_card_validation,
  flutterwave_business_job_posting_card
);

router.post(
  "/job-card-authorize",
  authorize(["business"]),
  add_job_posting_authorize_card_validation,
  flutterwave_business_job_posting_authorize_card
);

// card authourize
router.post(
  "/job-card-otp",
  authorize(["business"]),
  authorize_course_card_otp,
  flutterwave_business_job_posting_authorize_otp
);

/*
  funding posting
*/

// funding card payment
router.post(
  "/funding-card",
  authorize(["business"]),
  add_funding_posting_card_validation,
  flutterwave_business_funding_posting_card
);

router.post(
  "/funding-card-authorize",
  authorize(["business"]),
  add_funding_posting_authorize_card_validation,
  flutterwave_business_funding_posting_authorize_card
);

// card authourize
router.post(
  "/funding-card-otp",
  authorize(["business"]),
  authorize_course_card_otp,
  flutterwave_business_funding_posting_authorize_otp
);

/*
  invites payments
*/

router.post(
  "/invite-card",
  authorize(["business"]),
  add_invite_posting_card_validation,
  flutterwave_business_invite_posting_card
);

router.post(
  "/invite-card-authorize",
  authorize(["business"]),
  add_invite_posting_authorize_card_validation,
  flutterwave_business_invite_posting_authorize_card
);

// card authourize
router.post(
  "/invite-card-otp",
  authorize(["business"]),
  // authorize_course_card_otp,
  flutterwave_business_invite_posting_authorize_otp
);

/*
  -- business free course payment
*/
router.post(
  "/free-course-card-business",
  authorize(["business"]),
  add_course_posting_card_validation,
  free_course_posting_payment
);

router.post(
  "/free-course-card-authorize-business",
  authorize(["business"]),
  add_course_posting_card_authorize_validation,
  free_course_posting_card_authorize
);

router.post(
  "/free-course-card-otp-business",
  authorize(["business"]),
  add_course_posting_card_otp_validation,
  free_course_posting_card_authorize_otp
);

/* manage payment */

// course card payment
router.post(
  "/manage/course-card",
  authorize(["business", "user", "admin"]),
  manageAccountAuth({
    permissions: ["create_course"],
  }),
  filter_courses,
  add_enrolcourse,
  flutterwave_course_card
);

// card authourize
router.post(
  "/manage/course-card-authorize",
  authorize(["business", "user", "admin"]),
  manageAccountAuth({
    permissions: ["create_course"],
  }),
  filter_courses,
  authorize_course_card,
  flutterwave_authorize_course_card
);

// card authourize
router.post(
  "/manage/course-card-otp",
  authorize(["business", "user", "admin"]),
  manageAccountAuth({
    permissions: ["create_course"],
  }),
  authorize_course_card_otp,
  flutterwave_card_otp
);

/*
  jobs posting
*/
// job card payment
router.post(
  "/manage/job-card",
  authorize(["business", "user", "admin"]),
  manageAccountAuth({
    permissions: ["create_job"],
  }),
  add_job_posting_card_validation,
  flutterwave_business_job_posting_card
);

router.post(
  "/manage/job-card-authorize",
  authorize(["business", "user", "admin"]),
  manageAccountAuth({
    permissions: ["create_job"],
  }),
  add_job_posting_authorize_card_validation,
  flutterwave_business_job_posting_authorize_card
);

// card authourize
router.post(
  "/manage/job-card-otp",
  authorize(["business", "user", "admin"]),
  manageAccountAuth({
    permissions: ["create_job"],
  }),
  authorize_course_card_otp,
  flutterwave_business_job_posting_authorize_otp
);

/*
  funding posting
*/

// funding card payment
router.post(
  "/manage/funding-card",
  authorize(["business", "user", "admin"]),
  manageAccountAuth({
    permissions: ["create_funding"],
  }),
  add_funding_posting_card_validation,
  flutterwave_business_funding_posting_card
);

router.post(
  "/manage/funding-card-authorize",
  authorize(["business", "user", "admin"]),
  manageAccountAuth({
    permissions: ["create_funding"],
  }),
  add_funding_posting_authorize_card_validation,
  flutterwave_business_funding_posting_authorize_card
);

// card authourize
router.post(
  "/manage/funding-card-otp",
  authorize(["business", "user", "admin"]),
  manageAccountAuth({
    permissions: ["create_funding"],
  }),
  authorize_course_card_otp,
  flutterwave_business_funding_posting_authorize_otp
);

/*
  invites payments
*/

router.post(
  "/manage/invite-card",
  authorize(["business", "user", "admin"]),
  manageAccountAuth({
    permissions: ["create_invite"],
  }),
  add_invite_posting_card_validation,
  flutterwave_business_invite_posting_card
);

router.post(
  "/manage/invite-card-authorize",
  authorize(["business", "user", "admin"]),
  manageAccountAuth({
    permissions: ["create_invite"],
  }),
  add_invite_posting_authorize_card_validation,
  flutterwave_business_invite_posting_authorize_card
);

// card authourize
router.post(
  "/manage/invite-card-otp",
  authorize(["business", "user", "admin"]),
  // authorize_course_card_otp,
  manageAccountAuth({
    permissions: ["create_invite"],
  }),
  flutterwave_business_invite_posting_authorize_otp
);

/*
  -- business free course payment
*/
router.post(
  "/manage/free-course-card-business",
  authorize(["business", "user", "admin"]),
  manageAccountAuth({
    permissions: ["create_course"],
  }),
  add_course_posting_card_validation,
  free_course_posting_payment
);

router.post(
  "/manage/free-course-card-authorize-business",
  authorize(["business", "user", "admin"]),
  manageAccountAuth({
    permissions: ["create_course"],
  }),
  add_course_posting_card_authorize_validation,
  free_course_posting_card_authorize
);

router.post(
  "/manage/free-course-card-otp-business",
  authorize(["business", "user", "admin"]),
  manageAccountAuth({
    permissions: ["create_course"],
  }),
  add_course_posting_card_otp_validation,
  free_course_posting_card_authorize_otp
);

module.exports = router;
