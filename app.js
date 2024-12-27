const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const pageRoutes = require('./routes/pageRoutes');
const menuRoutes = require('./routes/MenuRoutes');
const productRoutes = require('./routes/productRoutes');
const Category = require('./routes/CategoryRoutes');
const SubCategory = require('./routes/SubcategoryRoutes');
const AttributeRoutes = require('./routes/AttributeRoutes');
const BlogsRoutes = require('./routes/BlogsRoutes');
const BlogCategoryRoutes = require('./routes/BlogCategoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const couponsRoutes = require('./routes/CouponsRoutes');
const userRoutes = require('./routes/userRoutes');
const GigRoutes = require('./routes/GigRoutes');
const GigOrderRoutes = require('./routes/GigOrderRoutes');
const errorHandler = require('./middlewares/errorHandler');

const messageRoutes = require('./routes/messages');
const conversationRoutes = require('./routes/ConversationsRoutes');


require('dotenv').config();

const app = express();



// Connect to MongoDB

// Middleware
app.use(cors());
app.use(express.json({ limit: '500mb' })); // Increase the payload limit here
connectDB();

// Routes
app.use('/api/pages', pageRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', Category);
app.use('/api/subcategories', SubCategory);
app.use("/api/attributes", AttributeRoutes);
app.use("/api/blogs", BlogsRoutes);
app.use("/api/blog/categories", BlogCategoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponsRoutes);
app.use('/api', userRoutes);
app.use('/api/gigs', GigRoutes);
app.use('/api/gig/orders', GigOrderRoutes);


// messages routes
app.use('/api/messages', messageRoutes);
app.use('/api/conversations', conversationRoutes);

// Error Handler Middleware
app.use(errorHandler);


module.exports = app;

