const express = require("express");
const router = express.Router();

const {
  add_skills,
  update_skills,
  add_sub_skills,
} = require("../middleware/validations/skills.validation");

const {
  index,
  store,
  get_by_id,
  update,
  destroy,
  store_subcategory,
  get_subcategory,
  get_descendants,
  get_patents,
  bulk_store,
  bulk_sub_store,
  courses_skills,
  jobs_skills,
  seed_store,
} = require("../controllers/skills.controller");

const { bodyParser, authorize } = require("../middleware/middleware.protects");

router.get("/", index);

router.get("/course-skills", courses_skills);

router.get("/job-skills", jobs_skills);

router.post("/", authorize(["admin"]), add_skills, store);

router.post("/bulk", bulk_store);

router.post("/seed", seed_store);

router.post(
  "/sub-skills",
  bodyParser,
  authorize(["admin"]),
  add_sub_skills,
  store_subcategory
);

router.post("/sub-skills/bulk", bulk_sub_store);

router.get("/parents", get_patents);

router.get("/sub-skills/:id", get_subcategory);

router.get("/descendant/:id", get_descendants);

router.get("/:id", get_by_id);

router.put("/:id", authorize(["admin"]), update_skills, update);

router.delete("/:id", authorize(["admin"]), destroy);

module.exports = router;
