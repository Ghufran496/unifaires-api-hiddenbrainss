const express = require("express");
const router = express();

const {
  business_update,
  admin_update,
  admin_funding,
  business_funding,
  admin_funding_applicants,
  business_funding_applicants,
} = require("../../controllers/manage/mange.funding.controller");

const { store, destroy } = require("../../controllers/funding.controller");

const {
  add_funding,
  update_funding,
  filter_funding,
} = require("../../middleware/validations/funding.validation");

const {
  authorize,
  bodyParser,
  manageAccountAuth,
} = require("../../middleware/middleware.protects");

router.get(
  "/user-funding-applicants/:fundingId",
  authorize(["business", "user", "admin"]),
  manageAccountAuth({
    permissions: ["funding_view"],
  }),
  filter_funding,
  admin_funding_applicants
);

router.get(
  "/business-funding-applicants/:fundingId",
  authorize(["business", "user", "admin"]),
  manageAccountAuth({
    permissions: ["funding_view"],
  }),
  filter_funding,
  business_funding_applicants
);

router.get(
  "/user",
  authorize(["business", "user", "admin"]),
  manageAccountAuth({
    permissions: ["funding_view"],
  }),
  filter_funding,
  admin_funding
);

router.get(
  "/business",
  authorize(["business", "user", "admin"]),
  manageAccountAuth({
    permissions: ["funding_edit"],
  }),
  filter_funding,
  business_funding
);

router.post(
  "/",
  authorize(["business", "user", "admin"]),
  manageAccountAuth({
    permissions: ["funding_create"],
  }),
  bodyParser,
  add_funding,
  store
);

router.put(
  "/business/:id",
  authorize(["business", "user", "admin"]),
  manageAccountAuth({
    permissions: ["funding_edit"],
  }),
  update_funding,
  business_update
);

router.put(
  "/user/:id",
  authorize(["business", "user", "admin"]),
  manageAccountAuth({
    permissions: ["funding_edit"],
  }),
  update_funding,
  admin_update
);

router.delete(
  "/:id",
  authorize(["business", "user", "admin"]),
  manageAccountAuth({
    permissions: ["funding_delete"],
  }),
  destroy
);

module.exports = router;
