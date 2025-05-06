if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const path = require("path");
const engine = require("ejs-mate");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const appError = require("./utils/appError");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");

const app = express();
const PORT = process.env.PORT || 8000;

app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());

// Configure Helmet with CSP (template)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"], // Allow resources from the same origin
        scriptSrc: [
          "'self'",
          "https://cdn.jsdelivr.net",
          "'unsafe-inline'", // Required for inline scripts (e.g., Bootstrap)
        ],
        styleSrc: [
          "'self'",
          "https://cdn.jsdelivr.net", // For Bootstrap CSS (via jsDelivr)
          "'unsafe-inline'", // Required for inline styles (e.g., Bootstrap)
        ],
        imgSrc: [
          "'self'",
          "data:", // Allow inline images (e.g., base64 encoded)
          "https://res.cloudinary.com/dykphe12x/", // For Cloudinary images
        ],
        connectSrc: ["'self'"],
        fontSrc: [
          "'self'",
          "https://fonts.googleapis.com", // For Google Fonts
          "https://fonts.gstatic.com", // For Google Fonts
        ],
        objectSrc: ["'none'"], // Disallow <object>, <embed>, <applet>
        upgradeInsecureRequests: [], // Automatically upgrade HTTP to HTTPS
      },
    },
  })
);

// Set up session middleware
app.use(
  session({
    secret: process.env.SESSION,
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
// adding user to req object from token
const { isLoggedIn } = require("./middlewares/isloggedIn");
app.use(isLoggedIn);

// connecting to the server
const mongo = process.env.MONGO_URL || "mongodb://localhost:27017/blogify";
mongoose
  .connect(mongo)
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

app.all("*", (req, res, next) => {
  next(new appError("Page not found", 404));
});

// custom error handler
app.use((err, req, res, next) => {
  const { message = "something went wrong", status } = err;
  // res.send("something went wrong");
  res.status(status || 500).render("error", { message, status, err });
});

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
