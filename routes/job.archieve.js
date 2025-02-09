const express = require("express");
const router = express();

const {
  index,
  store,
  update,
  destroy,
  get_by_id,
  user_archieve,
  business_archieve,
} = require("../controllers/job.archieve.controller");

const {
  add_archieve,
  update_archieve,
} = require("../middleware/validations/job.archieve.validation");

const { filter_jobs } = require("../middleware/validations/jobs.validation");

const { authorize, bodyParser } = require("../middleware/middleware.protects");

router.get("/", authorize(["admin"]), filter_jobs, index);

router.post(
  "/",
  authorize(["admin", "business"]),
  bodyParser,
  add_archieve,
  store
);

router.put("/:id", authorize(["admin", "business"]), update_archieve, update);

router.delete("/:id", authorize(["admin", "business"]), destroy);

router.get("/user", authorize(["admin"]), user_archieve);

router.get("/business", authorize(["business"]), business_archieve);

router.get("/:id", authorize(["admin", "business"]), get_by_id);

module.exports = router;
