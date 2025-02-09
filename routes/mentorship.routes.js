const express = require("express");
const router = express();

const {
  index,
  store,
  update,
  destroy,
  get_by_id,
  bulk_delete,
} = require("../controllers/mentorship.controller");

const {
  add_mentorship,
  update_mentorship,
  bulk_delete_validation,
  filter_mentorship_validation,
} = require("../middleware/validations/mentorship.validation");

const { authorize, bodyParser } = require("../middleware/middleware.protects");
const {
  validate_bulk_skills,
} = require("../middleware/validations/skills.validation");

router.get("/", filter_mentorship_validation, index);

router.get("/:id", authorize(["admin", "user", "business"]), get_by_id);

router.post(
  "/",
  authorize(["admin", "user", "business"]),
  bodyParser,
  add_mentorship,
  validate_bulk_skills,
  store
);

router.put(
  "/:id",
  authorize(["admin", "user", "business"]),
  update_mentorship,
  update
);

router.post(
  "/bulk-delete",
  authorize(["admin", "user", "business"]),
  bulk_delete_validation,
  bulk_delete
);

router.delete("/:id", authorize(["admin", "user", "business"]), destroy);

module.exports = router;
