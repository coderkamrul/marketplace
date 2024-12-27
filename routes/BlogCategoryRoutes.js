const express = require("express");
const Category = require("../models/BlogCategory.js");

const router = express.Router();

// Create a new category
router.post("/", async (req, res) => {
  try {
    const { name, image, status = "published", slug } = req.body;

    // Create a new category with the provided data
    const category = new Category({
      name,
      image, // Assuming `image` is an object with `url` and `id` coming from the frontend
      status,
      slug,
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single category
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a category
router.put("/:id", async (req, res) => {
  try {
    const { name, image, status } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Update fields only if provided in the request
    if (name) category.name = name;
    if (image) category.image = image; // Expecting `image` to have `url` and `id`
    if (status) category.status = status;

    await category.save();
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a category
router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await category.deleteOne();
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;


