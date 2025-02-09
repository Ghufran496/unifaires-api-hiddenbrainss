const express = require("express");
const router = express();
const {
  index,
  store,
  update,
  destroy,
  get_by_id,
  exportNewsletter,
} = require("../controllers/newsletter.subscriber.controller");
const { authorize } = require("../middleware/middleware.protects");

const {
  add_newsletter_subscriber,
  update_newsletter_subscriber,
} = require("../middleware/validations/newsletter.subscriber.validation");

router.get("/", authorize(["admin"]), index);

router.get("/export", authorize(["admin"]), exportNewsletter);

router.get("/:id", authorize(["admin"]), get_by_id);

router.post("/", add_newsletter_subscriber, store);

router.put("/:id", update_newsletter_subscriber, update);

router.delete("/:id", destroy);

module.exports = router;
