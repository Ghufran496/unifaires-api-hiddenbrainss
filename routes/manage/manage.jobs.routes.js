const express = require("express");

const router = express();

const {
  business_update,
  admin_update,
  admin_jobs,
  business_jobs,
  admin_jobs_applicants,
  business_jobs_applicants,
} = require("../../controllers/manage/manage.jobs.controller");

const { store, destroy } = require("../../controllers/jobs.controller");

const {
  add_jobs,
  update_jobs,
  filter_jobs,
} = require("../../middleware/validations/jobs.validation");

const {
  authorize,
  bodyParser,
  manageAccountAuth,
} = require("../../middleware/middleware.protects");

const {
  validate_update_bulk_skills,
  validate_bulk_skills,
} = require("../../middleware/validations/skills.validation");

router.get(
  "/user-job-applicants/:jobId",
  authorize(["admin", "user", "business"]),
  manageAccountAuth({
    permissions: ["job_view"],
  }),
  filter_jobs,
  admin_jobs_applicants
);

router.get(
  "/business-job-applicants/:jobId",
  authorize(["admin", "user", "business"]),
  manageAccountAuth({
    permissions: ["job_view"],
  }),
  filter_jobs,
  business_jobs_applicants
);

router.get(
  "/user",
  authorize(["admin", "user", "business"]),
  manageAccountAuth({
    permissions: ["job_view"],
  }),
  filter_jobs,
  admin_jobs
);

router.get(
  "/business",
  authorize(["business"]),
  manageAccountAuth({
    permissions: ["read_business_job"],
  }),
  filter_jobs,
  business_jobs
);

router.post(
  "/",
  authorize(["admin", "business", "user"]),
  manageAccountAuth({
    permissions: ["job_create"],
  }),
  bodyParser,
  add_jobs,
  validate_bulk_skills,
  store
);

router.put(
  "/business/:id",
  authorize(["business"]),
  manageAccountAuth({
    permissions: ["job_edit"],
  }),
  validate_update_bulk_skills,
  update_jobs,
  business_update
);

router.put(
  "/user/:id",
  authorize(["admin", "business", "user"]),
  manageAccountAuth({
    permissions: ["job_edit"],
  }),
  update_jobs,
  admin_update
);

router.delete(
  "/:id",
  authorize(["admin", "business", "user"]),
  manageAccountAuth({
    permissions: ["job_delete"],
  }),
  destroy
);

module.exports = router;
