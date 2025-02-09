let express = require("express");
let router = express.Router();
const { index } = require("../controllers/general.controller");
const {
  search_validation,
} = require("../middleware/validations/general.validation");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Unifaires" });
});

router.get("/search", search_validation, index);

module.exports = router;
