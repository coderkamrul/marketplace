const mongoose = require("mongoose");

const attributeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    values: { type: [String], required: true },
  },
  { timestamps: true }
);

const Attribute = mongoose.model("Attribute", attributeSchema);

module.exports = Attribute;
