const express = require("express");
const router = express.Router();

const {
  add_event,
  update_event,
} = require("../middleware/validations/event.validation");

const {
  index,
  store,
  update,
  destroy,
  get_by_id,
} = require("../controllers/event.controller");

const { isLogin, access } = require("../middleware/auth.middlewares");
const { useAsync } = require("../core");
const {
  adminBodyGuard,
  userBodyGuard,
  bodyParser,
} = require("../middleware/middleware.protects");

router.get("/", useAsync(adminBodyGuard), index);

router.get("/:id", get_by_id);

router.post("/", bodyParser, add_event, store);

router.put("/:id", useAsync(userBodyGuard), update_event, update);

router.delete("/:id", useAsync(userBodyGuard), destroy);

module.exports = router;
