const express = require('express');
const router = express.Router();
const MenuController = require('../controllers/MenuController'); // Adjust path as needed

// Route to get all menus
router.get('/', MenuController.getAllMenus);

// Other routes as needed
router.post('/createmenu', MenuController.createMenu);
router.get('/:id', MenuController.getMenuById);
router.put('/update/:id', MenuController.updateMenu);
router.delete('/delete/:id', MenuController.deleteMenu);

module.exports = router;
