const express = require("express");
const multer = require("multer");
const Router = express.Router({ mergeParams: true });
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const { restrictedToLoggedIn } = require("../middlewares/isloggedIn");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only JPEG and PNG are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  },
  fileFilter: fileFilter,
});

// blog routes
Router.get("/addBlog", restrictedToLoggedIn, (req, res) => {
  res.render("addBlog");
});

Router.post(
  "/",
  restrictedToLoggedIn,
  upload.single("coverImageURL"),
  async (req, res) => {
    const { title, body } = req.body;
    const blog = new Blog({
      createdBy: res.locals.user._id,
      title: title,
      body: body,
      coverImageURL: req.file.filename,
    });
    await blog.save();
    req.flash("success", "Blog saved successfully!");
    res.redirect(`/blog/${blog._id}`);
  }
);
Router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id).populate("createdBy");
  const comments = await Comment.find({ blogId: id }).populate("createdBy");
  //   console.log(comments);
  //   console.log(blog);
  res.render("blog", { blog: blog, comments: comments });
});

// comments
Router.post("/:blogId/comments", restrictedToLoggedIn, async (req, res) => {
  const newComment = new Comment({
    content: req.body.content,
    createdBy: res.locals.user._id,
    blogId: req.params.blogId,
  });
  //   console.log(newComment);
  await newComment.save();
  res.redirect(`/blog/${req.params.blogId}`);
});

module.exports = Router;
