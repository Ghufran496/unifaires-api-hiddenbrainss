const express = require("express");
const router = express.Router();

const {
  add_address,
  update_address,
} = require("../middleware/validations/address.validation");

const {
  index,
  get_by_id,
  store,
  update,
  destroy,
  user_default_address,
  user_address,
} = require("../controllers/address.controller");

const {
  bodyParser,

  authorize,
} = require("../middleware/middleware.protects");

router.get("/", authorize(["admin"]), index);

router.get("/:id", get_by_id);

router.post(
  "/",
  bodyParser,
  authorize(["business", "admin", "user"]),
  add_address,
  store
);

router.put(
  "/:id",
  authorize(["business", "admin", "user"]),
  update_address,
  update
);

router.get(
  "/user/:userId",
  authorize(["business", "admin", "user"]),
  user_address
);
router.get(
  "/default/:userId",
  authorize(["business", "admin", "user"]),
  user_default_address
);

router.delete("/:id", authorize(["business", "admin", "user"]), destroy);

module.exports = router;
