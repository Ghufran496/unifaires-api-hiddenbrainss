const express = require("express");
const router = express.Router();
const {
  index,
  store,
  update,
  destroy,
  get_by_id,
  change_helptracks_status,
} = require("../controllers/help.track.controller");

const {
  add_helptrack,
  update_helptrack,
  update_status,
} = require("../middleware/validations/helptrack.validation");

const { authorize, bodyParser } = require("../middleware/middleware.protects");

router.get("/", authorize(["admin"]), index);

router.post("/", bodyParser, authorize(["admin"]), add_helptrack, store);

router.put("/:id", authorize(["admin"]), update_helptrack, update);

router.get("/:id", authorize(["admin"]), get_by_id);

router.delete("/:id", authorize(["admin"]), destroy);

router.get("/:id", authorize(["admin"]), get_by_id);

router.put(
  "/change-status/:id",
  authorize(["admin"]),
  update_status,
  change_helptracks_status
);

module.exports = router;
