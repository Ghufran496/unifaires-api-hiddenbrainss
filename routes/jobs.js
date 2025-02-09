const express = require("express");
const router = express();
const {
  index,
  store,
  destroy,
  get_by_id,
  business_update,
  admin_update,
  admin_jobs,
  business_jobs,
  admin_jobs_applicants,
  business_jobs_applicants,
  get_by_slug,
  skills_jobs,
  job_attributes_filter,
} = require("../controllers/jobs.controller");

const {
  add_jobs,
  update_jobs,
  filter_jobs,
} = require("../middleware/validations/jobs.validation");

const { authorize, bodyParser } = require("../middleware/middleware.protects");

const {
  validate_update_bulk_skills,
  validate_bulk_skills,
} = require("../middleware/validations/skills.validation");

const {
  skills_course_validation,
} = require("../middleware/validations/course.validation");
const {
  filter_enrol,
} = require("../middleware/validations/job.enrol.validation");

router.post(
  "/skills-jobs",
  bodyParser,
  skills_course_validation,
  validate_bulk_skills,
  skills_jobs
);

router.get("/", filter_jobs, index);
router.get("/all", filter_jobs, index);

router.get(
  "/user-job-applicants/:jobId",
  authorize(["admin"]),
  filter_enrol,
  admin_jobs_applicants
);

router.get(
  "/business-job-applicants/:jobId",
  authorize(["business"]),
  filter_enrol,
  business_jobs_applicants
);

router.get("/user", authorize(["admin"]), filter_jobs, admin_jobs);

router.get("/business", filter_jobs, authorize(["business"]), business_jobs);

router.post(
  "/",
  authorize(["admin", "business"]),
  bodyParser,
  add_jobs,
  validate_bulk_skills,
  store
);

router.put(
  "/business/:id",
  authorize(["business"]),
  validate_update_bulk_skills,
  update_jobs,
  business_update
);

router.put("/user/:id", authorize(["admin"]), update_jobs, admin_update);

router.delete("/:id", authorize(["admin", "business"]), destroy);

router.get("/filter-attributes", job_attributes_filter);

router.get("/slug/:slug", get_by_slug);

router.get("/:id", get_by_id);

module.exports = router;
