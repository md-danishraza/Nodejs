const express = require("express");

const router = express.Router({ mergeParams: true });

// handlers
const {
  generateShort,
  handleRedirect,
  getAnalytics,
} = require("../controllers/url");

// routes
router
  .route("/")
  .get((req, res) => {
    res.render("generate", { newUrl: null });
  })
  .post(generateShort);

router.get("/:shortId", handleRedirect);

router.get("/analytics/:shortId", getAnalytics);

module.exports = router;
