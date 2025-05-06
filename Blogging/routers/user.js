const express = require("express");

const Router = express.Router({ mergeParams: true });
const User = require("../models/user");
const { createTokenForUser, validateToken } = require("../services/auth");
const { userValidationSchema } = require("../validatation");

// user routes

// show login
Router.get("/login", (req, res) => {
  res.render("login");
});
// handle login
Router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      req.flash("error", "user not found! Sign Up");
      return res.status(401).redirect("/user/signup");
    }
    if (!(await user.comparePassword(password))) {
      req.flash("error", "Invalid password! retry");
      return res.status(401).redirect("/user/login");
    }
    // generating token
    const token = createTokenForUser(user);
    res.cookie("token", token);

    // redirect to home
    req.flash("success", "Logged In successfully!");
    res.redirect("/");
  } catch (err) {
    res.status(500).send(err);
  }
});
// show signup
Router.get("/signup", (req, res) => {
  res.render("signup");
});
// handle signup
Router.post("/signup", async (req, res) => {
  const { error } = userValidationSchema.validate(req.body);
  if (error) {
    req.flash("error", error.details.map((el) => el.message).join(", "));
    return res.redirect("/user/signup");
  }

  const { fullName, email, password } = req.body;

  // console.log(req.body);
  const newUser = User({
    fullName,
    email,
    password,
  });
  try {
    await newUser.save();
    req.flash("success", "SignUp In successfully!");
    res.redirect("/user/login");
  } catch (err) {
    // console.log(err);
    res.status(500).send(err);
  }
});

Router.get("/logout", (req, res) => {
  res.clearCookie("token");
  req.flash("success", "Logged out successfully!");
  res.redirect("/");
});
module.exports = Router;
