const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true, 
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
  category: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  }
},{timestamps: true});

module.exports = mongoose.model('Subcategory', subcategorySchema);
