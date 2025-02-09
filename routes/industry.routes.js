const express = require("express");
const router = express.Router();

const {
  add_industry,
  update_industry,
  add_subindustry,
  add_bulk_industry,
} = require("../middleware/validations/industry.validation");

const {
  index,
  store,
  get_by_id,
  update,
  destroy,
  store_subindustry,
  get_subindustry,
  get_descendants,
  get_patents,
  bulk_store,
  bulk_sub_store,
} = require("../controllers/industry.controller");

const { bodyParser, authorize } = require("../middleware/middleware.protects");

router.get("/", index);

router.post("/", authorize(["admin"]), add_industry, store);

router.post("/bulk", bulk_store);

router.post(
  "/sub-industry",
  bodyParser,
  authorize(["admin"]),
  add_subindustry,
  store_subindustry
);

router.post("/sub-industry/bulk", bulk_sub_store);

router.get("/parents", get_patents);

router.get("/sub-industry/:id", get_subindustry);

router.get("/descendant/:id", get_descendants);

router.get("/:id", get_by_id);

router.put("/:id", authorize(["admin"]), update_industry, update);

router.delete("/:id", authorize(["admin"]), destroy);

module.exports = router;
