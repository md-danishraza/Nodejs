const express = require("express");
const { handleSignUp, handleLogin } = require("../controllers/users");

const router = express.Router({ mergeParams: true });

router.get("/signup", (req, res) => {
  res.render("signup");
});
router.post("/signup", handleSignUp);

router.get("/login", (req, res) => {
  res.render("login");
});
router.post("/login", handleLogin);

module.exports = router;
