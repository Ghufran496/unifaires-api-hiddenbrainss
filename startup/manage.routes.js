const express = require("express");
const router = express.Router();

const manage_course_routes = require("../routes/manage/manage.course.routes");
const manage_job_routes = require("../routes/manage/manage.jobs.routes");
const manage_funding_routes = require("../routes/manage/manage.funding.routes");

router.use("/manage-course", manage_course_routes);
router.use("/manage-jobs", manage_job_routes);
router.use("/manage-funding", manage_funding_routes);

module.exports = router;
