const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    userName: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false, timestamps: false }
);

const iconSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    path: { type: String, required: true },
    body: { type: String, required: true },
    version: { type: String, required: true },
    author: { type: [authorSchema], required: true },
    categories: {
      type: [String],
      required: true,
      enum: ["OAuth", "OIDC", "Email", "Adapter", "Others"],
    },
    keywords: { type: [String], required: true },
    url: { type: String, required: true },
  },
  { timestamps: true }
);

const Icon = mongoose.model("Icon", iconSchema);
module.exports = Icon;
