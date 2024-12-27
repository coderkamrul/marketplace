const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,  // Ensure category names are unique
    trim: true
  },
  images: [{ 
    url: { type: String, required: true },
    alt: { type: String },
  }],
  status: { 
    type: String, 
    enum: ['draft', 'published', 'archived'], 
    default: 'draft' 
  },
  description: String
},{timestamps: true});

module.exports = mongoose.model('Category', categorySchema);
