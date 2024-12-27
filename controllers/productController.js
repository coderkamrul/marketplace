const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category subcategory');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createProduct = async (req, res) => {
  const product = new Product(req.body);
  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category subcategory');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
















// Bulk Delete Products
exports.bulkDeleteProducts = async (req, res) => {
  try {
    const { ids } = req.body; // Expecting an array of product IDs in the request body
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No product IDs provided" });
    }

    const result = await Product.deleteMany({ _id: { $in: ids } });

    res.json({
      message: `${result.deletedCount} product(s) deleted successfully`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Bulk Update Product Status
exports.bulkUpdateProductStatus = async (req, res) => {
  try {
    const { ids, status } = req.body; // Expecting an array of product IDs and the new status
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No product IDs provided" });
    }
    if (!status) {
      return res.status(400).json({ message: "No status provided" });
    }

    const result = await Product.updateMany(
      { _id: { $in: ids } },
      { $set: { status } }
    );

    res.json({
      message: `${result.modifiedCount} product(s) updated to status '${status}' successfully`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};