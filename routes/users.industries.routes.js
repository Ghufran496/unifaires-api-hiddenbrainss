const express = require("express");
const router = express();
const {
  index,
  store,
  update,
  destroy,
  get_by_id,
  user_industries,
} = require("../controllers/users.industries.controller");

const { authorize, bodyParser } = require("../middleware/middleware.protects");

const {
  add_user_industry,
  update_user_industry,
} = require("../middleware/validations/users.industries.validation");
const {
  validate_bulk_industries,
} = require("../middleware/validations/industry.validation");

router.get("/", authorize(["admin"]), index);

router.get(
  "/my-industries",
  authorize(["admin", , "user", "business"]),
  user_industries
);

router.get("/:id", authorize(["admin", , "user", "business"]), get_by_id);

router.post(
  "/",
  authorize(["admin", , "user", "business"]),
  bodyParser,
  add_user_industry,
  validate_bulk_industries,
  store
);

router.put(
  "/:id",
  authorize(["admin", , "user", "business"]),
  update_user_industry,
  update
);

router.delete("/:id", authorize(["admin", , "user", "business"]), destroy);

module.exports = router;
