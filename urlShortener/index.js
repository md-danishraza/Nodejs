const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const URL = require("./models/url");
const { restrictToLoggedIn, checkAuth } = require("./middlwares/auth");

const app = express();
const PORT = 3000;

// mongo connection
mongoose
  .connect("mongodb://localhost:27017/shortUrl")
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.log(`error connecting to MongoDB:- ${err}`);
  });

// ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routers
const urlRoutes = require("./routers/url");
const userRoutes = require("./routers/users");

// route handlers
app.get("/", checkAuth, async (req, res) => {
  // res.send("Welcome to URL Shortener!");
  console.log(req.user);
  if (req.user) {
    const id = req.user._id;

    const allUrls = await URL.find({ createdBy: id });
    res.render("home", { allUrls });
  } else {
    const allUrls = await URL.find({});
    res.render("home", { allUrls });
  }
  // console.log(allUrls);
});
app.use("/url", restrictToLoggedIn, urlRoutes);
app.use("/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
