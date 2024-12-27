const express = require('express');
const { createOrder, getOrders, updateOrderStatus, getOrderById, updateRequirements,  } = require('../controllers/GigOrderController');

const router = express.Router();

router.post('/create', createOrder); // Create an order
router.get('/', getOrders); // Get all orders
router.get('/:orderId', getOrderById); // Get a order
router.put('/status/:orderId', updateOrderStatus);
router.put('/requirements/:orderId', updateRequirements);

module.exports = router;
