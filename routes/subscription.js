const express = require("express");
const router = express();
const {
  index,
  store,
  update,
  destroy,
  get_by_id,
  user_subscription,
  remove_subscription,
} = require("../controllers/subscription.controller");

const { authorize, bodyParser } = require("../middleware/middleware.protects");

const {
  add_subscription,
  update_subscription,
  unsubscribe_validation,
} = require("../middleware/validations/subscription.validation");

router.get("/", authorize(["admin"]), index);

router.get(
  "/user-subscription",
  authorize(["admin", "business", "user"]),
  user_subscription
);

router.get("/:id", authorize(["admin"]), get_by_id);

router.post(
  "/",
  authorize(["admin", "business", "user"]),
  bodyParser,
  add_subscription,
  store
);

router.post(
  "/unsubscribe/:id",
  authorize(["admin", "business", "user"]),
  bodyParser,
  unsubscribe_validation,
  remove_subscription
);

router.put("/:id", authorize(["admin"]), update_subscription, update);
router.delete("/:id", authorize(["admin"]), destroy);

module.exports = router;
