const express = require("express");
const router = express.Router();

const {
  add_category,
  update_category,
  add_subcategory,
} = require("../middleware/validations/category.validation");

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
  course_category,
} = require("../controllers/category.controller");

const { bodyParser, authorize } = require("../middleware/middleware.protects");

router.get("/", index);

router.get("/course-category", course_category);

router.post("/", authorize(["admin"]), add_category, store);

router.post("/bulk", bulk_store);

router.post(
  "/sub-category",
  bodyParser,
  authorize(["admin"]),
  add_subcategory,
  store_subcategory
);

router.post("/sub-category/bulk", bulk_sub_store);

router.get("/parents", get_patents);

router.get("/sub-categoy/:id", get_subcategory);

router.get("/descendant/:id", get_descendants);

router.get("/:id", get_by_id);

router.put("/:id", authorize(["admin"]), update_category, update);

router.delete("/:id", authorize(["admin"]), destroy);

module.exports = router;
