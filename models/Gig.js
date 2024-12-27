const mongoose = require('mongoose');

const statSchema = new mongoose.Schema(
  {
    date: { type: String, required: false },
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    orders: { type: Number, default: 0 },
  },
  { _id: false }
);

const packageSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  deliveryTime: { type: String, required: true },
  numberOfPages: { type: String, required: true },
  features: { type: [String], required: true },
  revisions: { type: String, required: true },
  price: { type: String, required: true },
});

const faqSchema = mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const requirementSchema = mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: [String], default: [] },
  type: { type: String, enum: ['multiple_choice', 'text', "file"], required: true },
  required: { type: Boolean, default: false },
  choices: { type: [String], default: [] },
});

const imageSchema = mongoose.Schema({
  file: { path: { type: String, required: true } },
  preview: { type: String },
  isPrimary: { type: Boolean, default: false },
});

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const sellerSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  image: { type: String },
  label: { type: String, enum: ['level-1', 'level-2', 'Top Label', 'Pro'], default: 'level-1' },
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 }
});

const gigSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    subcategory: {
      type: String,
      required: true,
    },
    searchTags: {
      type: [String],
      default: [],
    },
    positiveKeywords: {
      type: [String],
      default: [],
    },
    negativeKeywords: {
      type: [String],
      default: [],
    },
    isThreePackages: {
      type: Boolean,
      default: false,
    },
    packages: {
      type: [packageSchema],
      default: [],
    },
    description: {
      type: String,
      required: true,
    },
    faqs: {
      type: [faqSchema],
      default: [],
    },
    requirements: {
      type: [requirementSchema],
      default: [],
    },
    images: {
      type: [imageSchema],
      default: [],
    },
    status: {
      type: String,
      required: true,
      enum: ['published', 'affiliate', 'draft', 'active', 'pending', 'modification', 'denied', 'paused'],
      default: 'draft',
    },
    cancellations: {
      type: String,
      default: '0%',
    },
    hasSubscription: {
      type: Boolean,
      default: false,
    },
    averageDeliveryTime: {
      type: Number,
      default: 0,
    },
    ordersInQueue: {
      type: Number,
      default: 0,
    },
    stats: { type: [statSchema], default: [] },
    seller: sellerSchema,
    reviews: [reviewSchema],
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Add a method to calculate totals from stats
gigSchema.methods.calculateTotals = function () {
  return this.stats.reduce(
    (totals, stat) => {
      totals.impressions += stat.impressions;
      totals.clicks += stat.clicks;
      totals.orders += stat.orders;
      return totals;
    },
    { impressions: 0, clicks: 0, orders: 0 }
  );
};

// Add a method to calculate average rating
gigSchema.methods.calculateAverageRating = function () {
  if (this.reviews.length === 0) {
    return 0;
  }
  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  return totalRating / this.reviews.length;
};

// Pre-save middleware to update averageRating and totalReviews
gigSchema.pre('save', async function (next) {
  if (this.isModified('reviews')) {
    this.averageRating = this.calculateAverageRating();
    this.totalReviews = this.reviews.length;

    // Update seller's overall rating and review count
    const User = mongoose.model('User');
    const seller = await User.findById(this.seller.id);
    if (seller) {
      await seller.updateRatingAndReviews();
      
      // Update the seller information in this gig
      this.seller.averageRating = seller.averageRating;
      this.seller.totalReviews = seller.totalReviews;
    }
  }
  next();
});

const Gig = mongoose.model('Gig', gigSchema);

module.exports = Gig;

