const Menu = require('../models/Menu'); // Adjust path as needed

// Create a new menu


const createMenu = async (req, res) => {
  const { name, type, items } = req.body;
  try {
    const newMenu = new Menu({ name, type, items });
    await newMenu.save();
    res.status(201).json(newMenu);
  } catch (error) {
    res.status(500).json({ message: "Error creating menu", error });
  }
};

const getMenus = async (req, res) => {
  try {
    const menus = await Menu.find();
    res.status(200).json(menus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get a specific menu by ID
const getMenuById = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) return res.status(404).json({ message: 'Menu not found' });
    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all menu
const getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.find(); // Fetch all menu items
    res.json(menus); // Send all menu items as the response
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handle errors
  }
};

// Update a menu by ID
const updateMenu = async (req, res) => {
  try {
    const menu = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!menu) return res.status(404).json({ message: 'Menu not found' });
    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a menu by ID
const deleteMenu = async (req, res) => {
  try {
    const menu = await Menu.findByIdAndDelete(req.params.id);
    if (!menu) return res.status(404).json({ message: 'Menu not found' });
    res.json({ message: 'Menu deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMenu,
  getMenuById,
  updateMenu,
  deleteMenu,
  getAllMenus,
  getMenus,
};
