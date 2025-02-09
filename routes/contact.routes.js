const express = require("express");
const router = express();
const {
  index,
  store,
  update,
  destroy,
  get_by_id,
  user_contact,
} = require("../controllers/contact.controller");

const { authorize, bodyParser } = require("../middleware/middleware.protects");

const {
  add_contact,
  update_contact,
} = require("../middleware/validations/contact.validation");

router.get("/", authorize(["admin"]), index);
router.get(
  "/my-contact",
  authorize(["admin", "user", "business"]),
  user_contact
);

router.get("/:id", authorize(["admin", "business", "user"]), get_by_id);

router.post(
  "/",
  authorize(["admin", "business", "user"]),
  bodyParser,
  add_contact,
  store
);

router.put(
  "/:id",
  authorize(["admin", "business", "user"]),
  update_contact,
  update
);

router.delete("/:id", authorize(["admin", "business", "user"]), destroy);

module.exports = router;
