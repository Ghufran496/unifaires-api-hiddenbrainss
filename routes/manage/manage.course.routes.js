const express = require("express");
const router = express();

const {
  owner_course,
} = require("../../controllers/manage/manage.course.controller");

// get the create and update from the normal controller

const {
  store,
  update,
  destroy,
} = require("../../controllers/course/course.controller");

const {
  add_course,
  update_course,
  filter_course,
} = require("../../middleware/validations/course.validation");

const {
  bodyParser,
  authorize,
  manageAccountAuth,
} = require("../../middleware/middleware.protects");

const {
  validate_bulk_skills,
  validate_update_bulk_skills,
} = require("../../middleware/validations/skills.validation");

router.get(
  "/user",
  authorize(["business", "user", "admin"]),
  manageAccountAuth({
    permissions: ["content_view"],
  }),

  filter_course,
  owner_course
);

router.post(
  "/",
  authorize(["business", "user", "admin"]),
  manageAccountAuth({
    permissions: ["content_create"],
  }),
  bodyParser,
  validate_bulk_skills,
  add_course,
  store
);

router.put(
  "/:id",
  authorize(["business", "user", "admin"]),
  manageAccountAuth({
    permissions: ["content_edit"],
  }),
  bodyParser,
  validate_update_bulk_skills,
  update_course,
  update
);

router.delete(
  "/:id",
  authorize(["business", "user", "admin"]),
  manageAccountAuth({
    permissions: ["content_delete"],
  }),
  destroy
);

module.exports = router;
