const { setUser, getUser } = require("../service/auth");

async function restrictToLoggedIn(req, res, next) {
  const uid = req.cookies.uid;

  if (!uid) {
    res.redirect("/user/login");
    return;
  }
  const user = getUser(uid);

  if (!user) {
    res.redirect("/user/login");
    return;
  }

  // to access the current user
  req.user = user;
  next();
}

async function checkAuth(req, res, next) {
  const uid = req.cookies.uid;

  const user = getUser(uid);

  // to access the current user
  req.user = user;
  next();
}

module.exports = { restrictToLoggedIn, checkAuth };
