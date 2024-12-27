const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  description: { 
    type: String, 
    required: true, 
    trim: true 
  },
  sku: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true 
  },
  barcode: { 
    type: String, 
    unique: true, 
    sparse: true, 
    trim: true 
  },
  brand: { 
    type: String, 
    trim: true 
  },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: false 
  },
  subcategory: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Subcategory', 
    required: false 
  },
  price: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  salePrice: { 
    type: Number, 
    min: 0 
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  unit: { 
    type: String, 
    enum: ['piece', 'kg', 'g', 'l', 'ml'], 
    default: 'piece' 
  },
  images: [{ 
    url: { type: String, required: true },
    alt: { type: String },
    isPrimary: { type: Boolean, default: false }
  }],
  tags: [{ 
    type: String, 
    trim: true 
  }],
  attributes: [{
    name: { type: String, required: false },
    value: { type: String, required: false }
  }],
  status: { 
    type: String, 
    enum: ['draft', 'published', 'archived'], 
    default: 'draft' 
  },
  featured: { 
    type: Boolean, 
    default: false 
  },
  digital: { 
    type: Boolean, 
    default: false 
  },
  downloadableFile: {
    url: { type: String },
    name: { type: String },
    size: { type: Number },
    type: { type: String }
  },
  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0, min: 0 }
  },
  seoTitle: { 
    type: String, 
    trim: true 
  },
  seoDescription: { 
    type: String, 
    trim: true 
  },
  seoKeywords: [{ 
    type: String, 
    trim: true 
  }],
  attributes: [],
  variations: [],
  weight: {
    value: { type: Number, min: 0 },
    unit: { type: String, enum: ['kg', 'g', 'lb', 'oz'] }
  },
  dimensions: {
    length: { type: Number, min: 0 },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 },
    unit: { type: String, enum: ['cm', 'in'] }
  },
  manufacturer: { 
    type: String, 
    trim: true 
  },
  countryOfOrigin: { 
    type: String, 
    trim: true 
  },
  warrantyInfo: { 
    type: String 
  },
  shippingClass: { 
    type: String 
  },
  taxClass: { 
    type: String 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: false 
  },
  updatedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

productSchema.virtual('url').get(function() {
  return `/products/${this._id}`;
});

productSchema.index({ name: 'text', description: 'text', tags: 'text' });

productSchema.pre('save', function(next) {
  // Custom logic before saving, if any
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;