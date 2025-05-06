const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

// Custom Joi extension to sanitize HTML (template)
const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

// User validation schema
const userValidationSchema = Joi.object({
  fullName: Joi.string().min(3).max(50).required().escapeHTML(),
  email: Joi.string().email().required().escapeHTML(),
  password: Joi.string().min(6).required(),
});

// Blog validation schema
const blogValidationSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().escapeHTML(),
  body: Joi.string().min(10).required().escapeHTML(),
  coverImageURL: Joi.string().uri().optional(),
});

// Comment validation schema
const commentValidationSchema = Joi.object({
  content: Joi.string().min(1).max(500).required().escapeHTML(),
  blogId: Joi.string().required(),
  createdBy: Joi.string().required(),
});

module.exports = {
  userValidationSchema,
  blogValidationSchema,
  commentValidationSchema,
};
