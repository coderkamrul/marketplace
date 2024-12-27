const express = require('express');
const router = express.Router();
const Subcategory = require('../models/Subcategory');
const Category = require('../models/Category');


// Create a new subcategory under a specific category
router.post('/', async (req, res) => {
  try {
    const { name, images, status, categoryId } = req.body;
    
    // Check if the category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Create the subcategory
    const subcategory = new Subcategory({
      name,
      images,
      status,
      category: categoryId
    });

    await subcategory.save();
    res.status(201).json(subcategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Read (Get all subcategories)
router.get('/', async (req, res) => {
  try {
    const subcategories = await Subcategory.find().populate('category', 'name');
    res.status(200).json(subcategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get subcategory by ID
router.get('/:id', async (req, res) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id).populate('category', 'name');
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    res.status(200).json(subcategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get subcategories by category ID
router.get('/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    const subcategories = await Subcategory.find({ category: categoryId }).populate('category', 'name');
    
    if (subcategories.length === 0) {
      return res.status(404).json({ message: 'No subcategories found for this category' });
    }

    res.status(200).json(subcategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a subcategory
router.put('/:id', async (req, res) => {
  try {
    const { name, images, status, categoryId } = req.body;

    // Check if the category exists
    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
    }

    const subcategory = await Subcategory.findByIdAndUpdate(
      req.params.id,
      { name, images, status, category: categoryId },
      { new: true }
    );

    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    res.status(200).json(subcategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a subcategory
router.delete('/:id', async (req, res) => {
  try {
    const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    res.status(200).json({ message: 'Subcategory deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
