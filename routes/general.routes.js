const express = require("express");
const router = express();
const {
  index,
  store,
  update,
  destroy,
  get_by_id,
  search_name,
  search_name_chat,
} = require("../controllers/general.controller");
const {
  search_validation,
  search_name_validation,
} = require("../middleware/validations/general.validation");
const { authorize } = require("../middleware/middleware.protects");

router.get("/", search_validation, index);

router.get("/search/:name", search_name_validation, search_name);

router.get(
  "/search-name-chat/:name",
  authorize(["user", "admin", "business"]),
  search_name_validation,
  search_name_chat
);

router.get("/:id", get_by_id);
router.post("/", store);
router.put("/:id", update);
router.delete("/:id", destroy);

module.exports = router;
