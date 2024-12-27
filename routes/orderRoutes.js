const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Counter = require('../models/Counter');
const Coupon = require('../models/Coupons');
// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Create a new order
router.post('/', async (req, res) => {
  const {
    customer,
    customerEmail,
    paymentMethod,
    shippingAddress,
    products,
    totalAmount,
    discountAmount,
  } = req.body;

  // Validate required fields
  if (!customer || !customerEmail || !paymentMethod || !shippingAddress || !products || !totalAmount) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Fetch and increment the last order number
  let counter = await Counter.findOne({ name: 'order' });
  if (!counter) {
    // Initialize the counter if it doesn't exist
    counter = new Counter({ name: 'order', count: 1 });
    await counter.save();
  } else {
    counter.count += 1;
    await counter.save();
  }

  const orderNumber = `ORD-${counter.count.toString().padStart(5, '0')}`;

  // Create the order
  const order = new Order({
    orderNumber, // Add the generated order number
    customer,
    customerEmail,
    paymentMethod,
    shippingAddress,
    products,
    totalAmount,
    discountAmount,
    status: 'pending', // Default status
  });

  try {
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update an order
router.put('/:id', async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an order
router.delete('/:id', async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



module.exports = router;
