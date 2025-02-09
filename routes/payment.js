const express = require("express");
const router = express.Router();

// auth middlewares
const {
  bodyParser,
  authorize,
  manageAccountAuth,
} = require("../middleware/middleware.protects");

// middlewares
const {
  stripe_customer_by_email,
  stripe_customer_by_id,
  add_stripe_customer,
  create_stripe_token,
  add_stripe_token_to_customer,
  charge_stripe_customer_validation,
  add_stripe_card,
  charge_associate,
  remove_stripe_card,
  add_funding_stripe,
  add_jobs_stripe,
  add_invite_stripe,
  add_free_business_course_validation_stripe,
} = require("../middleware/validations/payment.validation");

// controllers
const {
  create_stripe_customer,
  get_all_stripe_customer,
  get_stripe_customer_by_email,
  get_stripe_customer_by_id,
  update_stripe_customer,
  create_stripe_customer_token,
  add_card_to_customer_stripe,
  stripe_charge_customer,
  get_all_stripe_transaction,
  add_card,
  get_cards,
  associate_payment,
  remove_card,
  enrol_course,
  stripe_funding,
  stripe_jobs,
  stripe_invite,
  stripe_business_free_course_posting,
} = require("../controllers/payment.controller");

// cards
router.post(
  "/customer-card",
  authorize(["admin", "business", "user"]),
  add_stripe_card,
  add_card
);

router.post(
  "/remove-card",
  authorize(["admin", "business", "user"]),
  remove_stripe_card,
  remove_card
);

// customer
router.post(
  "/customer",
  authorize(["admin", "business", "user"]),

  create_stripe_customer
);

router.get(
  "/customer-card",
  authorize(["user", "business", "admin"]),
  get_cards
);

router.get("/customer", authorize(["admin"]), get_all_stripe_customer);

router.get(
  "/customer/:id",
  authorize(["admin", "business", "user"]),
  stripe_customer_by_id,
  get_stripe_customer_by_id
);

router.get(
  "/customer/:email/email",
  authorize(["admin", "business", "user"]),
  stripe_customer_by_email,
  get_stripe_customer_by_email
);

router.put(
  "/customer/:id",
  authorize(["admin", "business", "user"]),
  bodyParser,
  update_stripe_customer
);

router.post(
  "/stripe-token",
  authorize(["admin", "business", "user"]),
  bodyParser,
  create_stripe_token,
  create_stripe_customer_token
);

router.post(
  "/token",
  authorize(["admin", "business", "admin"]),
  bodyParser,
  add_stripe_token_to_customer,
  add_card_to_customer_stripe
);

router.post(
  "/charge",
  authorize(["admin", "business", "user"]),
  bodyParser,
  charge_stripe_customer_validation,
  stripe_charge_customer
);

// all stripe transactions
router.get("/all", authorize(["admin"]), get_all_stripe_transaction);

// associate payment
router.post(
  "/associate",
  authorize(["user", "business", "admin"]),
  bodyParser,
  charge_associate,
  associate_payment
);

router.post(
  "/funding",
  authorize(["business", "admin", "user"]),
  bodyParser,
  add_funding_stripe,
  stripe_funding
);

router.post(
  "/jobs-payment",
  authorize(["business", "user", "admin"]),
  add_jobs_stripe,
  stripe_jobs
);

router.post(
  "/invite-payment",
  authorize(["business"]),
  add_invite_stripe,
  stripe_invite
);

router.post(
  "/free-course-payment",
  authorize(["business", "user", "admin"]),

  add_free_business_course_validation_stripe,
  stripe_business_free_course_posting
);

/* manage account payments */

router.post(
  "/manage/associate",
  authorize(["user", "business", "admin"]),
  manageAccountAuth({
    permissions: ["create_associate"],
  }),
  bodyParser,
  charge_associate,
  associate_payment
);

router.post(
  "/manage/funding",
  authorize(["business", "admin", "user"]),
  manageAccountAuth({
    permissions: ["create_funding"],
  }),
  bodyParser,
  add_funding_stripe,
  stripe_funding
);

router.post(
  "/manage/jobs-payment",
  authorize(["business", "user", "admin"]),
  manageAccountAuth({
    permissions: ["create_job"],
  }),
  add_jobs_stripe,
  stripe_jobs
);

router.post(
  "/manage/invite-payment",
  authorize(["business", "admin", "user"]),
  manageAccountAuth({
    permissions: ["create_invite"],
  }),
  add_invite_stripe,
  stripe_invite
);

router.post(
  "/manage/free-course-payment",
  authorize(["business", "user", "admin"]),
  manageAccountAuth({
    permissions: ["create_associate"],
  }),
  add_free_business_course_validation_stripe,
  stripe_business_free_course_posting
);

module.exports = router;
