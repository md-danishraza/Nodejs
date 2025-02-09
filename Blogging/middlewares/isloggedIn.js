const jwt = require("jsonwebtoken");
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.token) {
    const token = req.cookies.token;
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.user = decodedUser;
  } else {
    res.locals.user = null;
  }
  next();
};

exports.restrictedToLoggedIn = async (req, res, next) => {
  if (res.locals.user) {
    next();
  } else {
    req.flash("error", "login first");
    res.status(404).redirect("/user/login");
  }
};
