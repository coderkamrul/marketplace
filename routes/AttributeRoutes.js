const express = require("express");
const router = express.Router();
const Attribute = require("../models/Attribute");

// Create an Attribute
router.post("/", async (req, res) => {
  const { name, values } = req.body;
  try {
    const newAttribute = new Attribute({
      name,
      values,
    });
    await newAttribute.save();
    res.status(201).json(newAttribute);
  } catch (err) {
    res.status(400).json({ error: "Error creating attribute" });
  }
});

// Get All Attributes
router.get("/", async (req, res) => {
  try {
    const attributes = await Attribute.find();
    res.status(200).json(attributes);
  } catch (err) {
    res.status(500).json({ error: "Error fetching attributes" });
  }
});

// Get a Single Attribute by ID
router.get("/:id", async (req, res) => {
  try {
    const attribute = await Attribute.findById(req.params.id);
    if (!attribute) {
      return res.status(404).json({ error: "Attribute not found" });
    }
    res.status(200).json(attribute);
  } catch (err) {
    res.status(500).json({ error: "Error fetching attribute" });
  }
});

// Update an Attribute
router.put("/:id", async (req, res) => {
  const { name, values } = req.body;
  try {
    const updatedAttribute = await Attribute.findByIdAndUpdate(
      req.params.id,
      { name, values },
      { new: true }
    );
    if (!updatedAttribute) {
      return res.status(404).json({ error: "Attribute not found" });
    }
    res.status(200).json(updatedAttribute);
  } catch (err) {
    res.status(400).json({ error: "Error updating attribute" });
  }
});

// Delete an Attribute
router.delete("/:id", async (req, res) => {
  try {
    const deletedAttribute = await Attribute.findByIdAndDelete(req.params.id);
    if (!deletedAttribute) {
      return res.status(404).json({ error: "Attribute not found" });
    }
    res.status(200).json({ message: "Attribute deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting attribute" });
  }
});

module.exports = router;
