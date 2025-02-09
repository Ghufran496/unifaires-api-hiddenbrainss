const express = require("express");
const router = express();

const {
  index,
  store,
  update,
  destroy,
  get_by_id,
  user_wish,
} = require("../controllers/job.wish.controller");

const {
  add_job_wishlist,
  update_job_wishlist,
} = require("../middleware/validations/job.wish.validation");

const { filter_jobs } = require("../middleware/validations/jobs.validation");

const { authorize, bodyParser } = require("../middleware/middleware.protects");

router.get("/", authorize(["admin"]), filter_jobs, index);

router.post(
  "/",
  authorize(["admin", "user"]),
  bodyParser,
  add_job_wishlist,
  store
);

router.put("/:id", authorize(["admin", "user"]), update_job_wishlist, update);

router.delete("/:id", authorize(["admin", "user"]), destroy);

router.get("/user", authorize(["admin", "user"]), user_wish);

router.get("/:id", authorize(["admin", "user"]), get_by_id);

module.exports = router;
