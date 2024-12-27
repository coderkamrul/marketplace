const mongoose = require("mongoose");

// Define a recursive schema for menu items
const menuItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  href: { type: String, required: true },
  children: [{ type: mongoose.Schema.Types.Mixed, default: [] }]
});

// Self-reference for nested children
menuItemSchema.add({ children: [menuItemSchema] });

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["header", "footer"], required: true },
  items: [menuItemSchema]
});

const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;