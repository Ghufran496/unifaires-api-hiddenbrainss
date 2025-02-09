const express = require("express");

const router = express();

const {
  index,
  store,
  update,
  destroy,
  get_by_id,
  accept_invite,
  reject_invite,
  my_invites_business,
  my_invites_user,
  my_access_user,
  my_access_business,
} = require("../controllers/invite.controller");

const {
  add_invite,
  update_invite,
  accept_invite_validation,
  invite_query_validate,
} = require("../middleware/validations/invite.validation");

const { bodyParser, authorize } = require("../middleware/middleware.protects");
router.get("/", authorize(["admin"]), index);

router.get(
  "/user-invites",
  authorize(["admin"]),
  invite_query_validate,
  my_invites_user
);

router.get("/user-access", authorize(["admin", "user"]), my_access_user);

router.get(
  "/business-invites",
  authorize(["business"]),
  invite_query_validate,
  my_invites_business
);

router.get("/business-access", authorize(["business"]), my_access_business);

router.get("/:id", authorize(["business", "admin", "user"]), get_by_id);

router.post(
  "/accept-invite",
  bodyParser,
  accept_invite_validation,
  accept_invite
);

router.post(
  "/reject-invite",
  bodyParser,
  authorize(["business", "admin", "user"]),
  accept_invite_validation,
  reject_invite
);

router.post("/", bodyParser, authorize(["admin"]), add_invite, store);

router.put("/:id", authorize(["business", "admin"]), update_invite, update);

router.delete("/:id", authorize(["business", "admin"]), destroy);

module.exports = router;
