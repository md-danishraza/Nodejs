const { Schema, model } = require("mongoose");

const blogShema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    coverImageURL: {
      type: String,
      default: "/images/default-cover.png",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Blog = model("Blog", blogShema);

module.exports = Blog;
