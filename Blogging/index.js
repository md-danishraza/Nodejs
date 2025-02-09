require("dotenv").config();
const express = require("express");
const path = require("path");
const engine = require("ejs-mate");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");

const app = express();
const PORT = process.env.PORT;

app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const SECRET_KEY = "your_secret_key";

// Set up session middleware
app.use(
  session({
    secret: "another secret key",
    resave: false,
    saveUninitialized: true,
  })
);
// Set up flash middleware
app.use(flash());

// Middleware to set flash messages in res.locals
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");

  next();
});

//  middleware for checking user is loggin or not
const { isLoggedIn } = require("./middlewares/isloggedIn");
app.use(isLoggedIn);

// connecting to the server
mongoose
  .connect("mongodb://localhost:27017/blogify")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

// router
const user = require("./routers/user");
const blog = require("./routers/blog");
// model
const Blog = require("./models/blog");

app.get("/", async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });

  res.render("home", { blogs });
});
app.use("/user", user);

app.use("/blog", blog);

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
