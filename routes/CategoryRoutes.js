

const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory'); // Adjust the path as necessary

// GET all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single category by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE a new category
router.post('/', async (req, res) => {
  const { name, images, status, description } = req.body;

  const category = new Category({
    name,
    images: images || [],  // Ensure images is an empty array if not provided
    status: status || 'draft',
    description,
  });

  try {
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (err) {
    if (err.code === 11000) {  // Handle duplicate key error for 'name'
      res.status(400).json({ message: 'Category name must be unique' });
    } else {
      res.status(400).json({ message: err.message });
    }
  }
});

// UPDATE an existing category by ID
router.put('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Update category fields
    category.name = req.body.name || category.name;
    category.images = req.body.images || category.images;
    category.status = req.body.status || category.status;
    category.description = req.body.description || category.description;

    const updatedCategory = await category.save();
    res.status(200).json(updatedCategory);
  } catch (err) {
    if (err.code === 11000) {  // Handle duplicate key error for 'name'
      res.status(400).json({ message: 'Category name must be unique' });
    } else {
      res.status(400).json({ message: err.message });
    }
  }
});

router.delete('/:id', async (req, res) => {
  try {
    // Find and delete the parent category
    const category = await Category.findByIdAndDelete(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Delete associated subcategories
    await Subcategory.deleteMany({ category: req.params.id });

    res.status(200).json({ message: 'Category and associated subcategories deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
