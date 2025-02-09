const express = require("express");

const router = express();

const {
  business_course_stats,
  business_courses,
  user_courses,
  user_courses_stats,
  user_demography,
  jobs_stats,
} = require("../controllers/stats.controller");

const { authorize, manageAccountAuth, } = require("../middleware/middleware.protects");

router.get("/user-demography", authorize(["admin"]), user_demography);

router.get("/business-course", authorize(["business"]), business_courses);

router.get(
  "/business-course/:id",
  authorize(["business", "user"]),
  manageAccountAuth({
    permissions: ["content_analytics"],
  }),
  business_course_stats
);

router.get("/user-course", authorize(["admin"]), user_courses);

router.get("/user-course/:id", authorize(["admin"]), user_courses_stats);

router.get("/jobs", authorize(["admin"]), jobs_stats);

module.exports = router;
