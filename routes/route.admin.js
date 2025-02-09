let express = require("express");
let router = express.Router();

let { authorize } = require("../middleware/middleware.protects");

let {
  adminStats,
  courseStats,
  get_admin,
  deactivate_user_account,
  deactivate_business_account,
  activate_business_account,
  activate_user_account,
  change_user_role,
  get_users,
  get_business,
  allCoursesStats,
} = require("../controllers/controller.admin");
const {
  deactivate_user_account_validation,
  deactivate_business_account_validation,
  change_user_role_validation,
} = require("../middleware/validations/admin.validation");
const {
  filter_user_validation,
} = require("../middleware/validations/user.validation");
const {
  filter_business_validation,
} = require("../middleware/validations/business.validation");
const {
  jobs_stats,
  single_job_stats,
  funding_stats,
  single_funding_stats,
  user_courses,
} = require("../controllers/stats.controller");

router.get("/", authorize(["admin"]), filter_user_validation, get_admin);

router.get("/users", authorize(["admin"]), filter_user_validation, get_users);

router.get(
  "/business",
  authorize(["admin"]),
  filter_business_validation,
  get_business
);

router.get("/stats", authorize(["admin"]), adminStats);

router.get("/course-stats", authorize(["admin"]), user_courses);

router.get("/course-stats/:id", authorize(["admin"]), courseStats);

router.post(
  "/change-user-role",
  authorize(["admin"]),
  change_user_role_validation,
  change_user_role
);

router.post(
  "/deactivate-user-account",
  authorize(["admin", "user"]),
  deactivate_user_account_validation,
  deactivate_user_account
);

router.post(
  "/activate-user-account",
  authorize(["admin", "user"]),
  deactivate_user_account_validation,
  activate_user_account
);

router.post(
  "/deactivate-business-account",
  authorize(["admin", "business"]),
  deactivate_business_account_validation,
  deactivate_business_account
);

router.post(
  "/activate-business-account",
  authorize(["admin", "business"]),
  deactivate_business_account_validation,
  activate_business_account
);

/* job stats */
router.get("/jobs-stats", authorize(["admin"]), jobs_stats);

router.get("/jobs-stats/:id", authorize(["admin"]), single_job_stats);

/* funding enrol */
/* job stats */
router.get("/funding-stats", authorize(["admin"]), funding_stats);

router.get("/funding-stats/:id", authorize(["admin"]), single_funding_stats);

module.exports = router;
