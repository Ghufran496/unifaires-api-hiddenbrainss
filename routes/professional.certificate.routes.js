const express = require("express");
const router = express();
const {
  index,
  store,
  update,
  destroy,
  get_by_id,
  user_profession,
} = require("../controllers/professional.certificate.controller");

const { authorize, bodyParser } = require("../middleware/middleware.protects");

const {
  add_profession,
  update_profession,
} = require("../middleware/validations/professional.certificate.validation");

router.get("/", authorize(["admin"]), index);
router.get(
  "/my-profession",
  authorize(["admin", "user", "business"]),
  user_profession
);

router.get("/:id", authorize(["admin", "business", "user"]), get_by_id);

router.post(
  "/",
  authorize(["admin", "business", "user"]),
  bodyParser,
  add_profession,
  store
);

router.put(
  "/:id",
  authorize(["admin", "business", "user"]),
  update_profession,
  update
);

router.delete("/:id", authorize(["admin", "business", "user"]), destroy);

module.exports = router;
