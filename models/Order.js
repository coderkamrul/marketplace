

const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  customer: { type: String, required: true },
  customerEmail: { type: String, required: true },
  paymentMethod: { 
    type: String, 
    enum: ['cash', 'card', 'cashOnDelivery'], 
    required: true 
  },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  products: [
    { 
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  coupon: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Coupon' 
  },
  discountAmount: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

OrderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', OrderSchema);

