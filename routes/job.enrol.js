const express = require("express");
const router = express();

const {
  index,
  store,
  update,
  destroy,
  get_by_id,
  user_enrol_job,
  business_jobs_enrol,
  user_jobs_enrol,
  update_status,
} = require("../controllers/job.enrol.controller");

const {
  add_enrol,
  update_enrol,
  filter_enrol,
} = require("../middleware/validations/job.enrol.validation");

const { authorize, bodyParser } = require("../middleware/middleware.protects");

router.get("/", authorize(["admin"]), filter_enrol, index);

router.get(
  "/user-enrol",
  authorize(["admin", "user"]),
  filter_enrol,
  user_enrol_job
);

router.get(
  "/business-job-enrol",
  authorize(["business"]),
  filter_enrol,
  business_jobs_enrol
);

router.get("/user-job-enrol", authorize(["admin", "user"]), user_jobs_enrol);

router.get("/:id", authorize(["admin", "business", "user"]), get_by_id);

router.post(
  "/",
  authorize(["admin", "user", "business"]),
  bodyParser,
  add_enrol,
  store
);

router.put(
  "/status/:id",
  authorize(["admin", "user", "business"]),
  update_enrol,
  update_status
);

router.put(
  "/:id",
  authorize(["admin", "user", "business"]),
  update_enrol,
  update
);

router.delete("/user/:id", authorize(["user"]), destroy);

router.delete("/:id", authorize(["user", "admin", "business"]), destroy);

module.exports = router;
