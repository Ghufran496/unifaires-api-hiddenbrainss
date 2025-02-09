const express = require("express");
const router = express();
const {
  index,
  store,
  update,
  destroy,
  get_by_id,
  user_cart,
} = require("../controllers/cart.controller");

const { authorize, bodyParser } = require("../middleware/middleware.protects");
const {
  add_cart,
  update_cart,
} = require("../middleware/validations/cart.validation");

router.get("/", authorize(["admin"]), index);

router.get("/my-cart", authorize(["user", "admin", "business"]), user_cart);

router.get("/:id", authorize(["user", "admin", "business"]), get_by_id);

router.post(
  "/",
  authorize(["user", "admin", "business"]),
  bodyParser,
  add_cart,
  store
);

router.put(
  "/:id",
  authorize(["user", "admin", "business"]),
  bodyParser,
  update_cart,
  update
);

router.delete("/:id", destroy);

module.exports = router;
