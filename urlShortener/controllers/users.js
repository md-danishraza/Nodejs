const User = require("../models/users");
const { setUser, getUser } = require("../service/auth");

exports.handleSignUp = async (req, res) => {
  const { name, email, password } = req.body;
  //   console.log(req.body);
  const newUser = new User({
    name,
    email,
    password,
  });

  try {
    await newUser.save();
    // redirect to homepage
    res.redirect("/");
  } catch (e) {
    res.send("Registration Error");
  }
};

exports.handleLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.redirect("/user/login");
    } else {
      const token = setUser(user);
      res.cookie("uid", token);
      res.redirect("/");
    }
  } catch (e) {
    res.send("Invalid credentials: " + e.message);
  }
};
