const express = require("express");
const router = express();
const {
  index,
  store,
  update,
  destroy,
  get_by_id,
  all,
  get_by_slug,
  get_course_enrol,
  business_courses,
  user_courses,
  skills_courses,
  free_associate_course,
  get_level_course_of_education,
  program_start_date,
  qualification_type,
  course_level,
  course_lang,
  study_pace,
  study_mode,
  course_subtitle,
  course_program_type,
  course_program_ranking,
  course_attributes_filter,
  course_single_attributes_filter,
} = require("../../controllers/course/course.controller");

const {
  add_course,
  update_course,
  filter_course,
  skills_course_validation,
} = require("../../middleware/validations/course.validation");

const {
  bodyParser,
  authorize,
} = require("../../middleware/middleware.protects");
const {
  validate_bulk_skills,
  validate_update_bulk_skills,
} = require("../../middleware/validations/skills.validation");

router.get("/", filter_course, index);

router.get(
  "/user-courses",
  authorize(["admin", "business"]),
  filter_course,
  user_courses
);

router.get(
  "/business-courses",
  authorize(["business"]),
  filter_course,
  business_courses
);

router.get("/all", authorize(["admin"]), all);

router.post(
  "/",
  authorize(["admin", "business"]),
  bodyParser,
  add_course,
  validate_bulk_skills,
  store
);

router.post(
  "/skills-courses",
  bodyParser,
  skills_course_validation,
  validate_bulk_skills,
  skills_courses
);

router.put(
  "/:id",
  authorize(["admin", "business"]),
  bodyParser,
  validate_update_bulk_skills,
  update_course,
  update
);

router.delete(
  "/:id",
  authorize(["admin", "business"]),

  destroy
);

router.get("/slug/:slug", get_by_slug);

router.get("/students/:id", get_course_enrol);

router.get(
  "/associate-course",
  authorize(["admin", "user"]),
  free_associate_course
);

router.get("/levels-of-education", get_level_course_of_education);

router.get("/program-start-date", program_start_date);

router.get("/qualification-type", qualification_type);

router.get("/level", course_level);

router.get("/lang", course_lang);

router.get("/study-pace", study_pace);

router.get("/study-mode", study_mode);

router.get("/subtitle-language", course_subtitle);

router.get("/program-type", course_program_type);

router.get("/program-ranking", course_program_ranking);

router.get("/filter-attributes", course_attributes_filter);

router.get("/:id", get_by_id);

module.exports = router;
