const express = require("express");
const multer = require("multer");
const Router = express.Router({ mergeParams: true });
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const { restrictedToLoggedIn } = require("../middlewares/isloggedIn");
const {
  blogValidationSchema,
  commentValidationSchema,
} = require("../validatation");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./public/uploads");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
//     cb(null, true);
//   } else {
//     cb(new Error("Invalid file type, only JPEG and PNG are allowed!"), false);
//   }
// };

// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 5, // 5MB
//   },
//   fileFilter: fileFilter,
// });

// multer
const { storage, cloudinary } = require("../cloudinary");
const upload = multer({ storage });

// blog routes
Router.get("/addBlog", restrictedToLoggedIn, (req, res) => {
  res.render("addBlog");
});

Router.post(
  "/",
  restrictedToLoggedIn,
  upload.single("coverImageURL"),
  async (req, res) => {
    // validating inputs
    const { error } = blogValidationSchema.validate(req.body);
    if (error) {
      req.flash("error", error.details.map((el) => el.message).join(", "));
      return res.redirect("/blog/addBlog");
    }

    const { title, body } = req.body;
    // console.log(req.file);
    const blog = new Blog({
      createdBy: res.locals.user._id,
      title: title,
      body: body,
      coverImageURL: req.file.path,
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

// delete blog
Router.post("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // blog
    const blog = await Blog.findById(id);

    if (!blog) {
      req.flash("error", "Blog not found!");
      return res.redirect("/blog");
    }

    // Deleting from cloudinary
    const imgUrl = blog.coverImageURL;
    // public ID from URL
    const publicId = imgUrl.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`Blogging/${publicId}`);

    // Deleting comments
    await Comment.deleteMany({ blogId: id });

    // Deleting the blog
    await Blog.findByIdAndDelete(id);

    req.flash("success", "Blog and associated comments deleted successfully!");
    res.redirect("/");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to delete blog!");
    res.redirect("/");
  }
});

// comments
Router.post("/:blogId/comments", restrictedToLoggedIn, async (req, res) => {
  const { error } = commentValidationSchema.validate({
    ...req.body,
    blogId: req.params.blogId,
    createdBy: res.locals.user._id,
  });
  if (error) {
    req.flash("error", error.details.map((el) => el.message).join(", "));
    return res.redirect(`/blog/${req.params.blogId}`);
  }

  const newComment = new Comment({
    content: req.body.content,
    createdBy: res.locals.user._id,
    blogId: req.params.blogId,
  });
  //   console.log(newComment);
  await newComment.save();
  req.flash("success", "comment saved successfully!");
  res.redirect(`/blog/${req.params.blogId}`);
});
// comments delete
Router.post(
  "/:blogId/comments/:commentId",
  restrictedToLoggedIn,
  async (req, res) => {
    blogId = req.params.blogId;
    commentId = req.params.commentId;
    // console.log(commentId);
    try {
      await Comment.findByIdAndDelete(commentId);
      req.flash("success", "comment deleted successfully!");
      res.redirect(`/blog/${req.params.blogId}`);
    } catch (err) {
      req.flash("failure", err.message);
      res.redirect(`/blog/${req.params.blogId}`);
    }
  }
);

module.exports = Router;
