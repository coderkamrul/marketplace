const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema(
  {
    pageName: {
      type: String,
      required: true,
      trim: true,
    },
    pageLink: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    pageMenu: {
      type: String,
      required: true,
    },
    pageStatus: {
      type: String,
      required: true,
      enum: ['Unpublished', 'published', 'Everyone'], // Example statuses
    },
    pageType: {
      type: String,
      required: true,
      enum: ['Default', 'Home', 'Custom'], // Example types
    },
    html: {
      type: String,
      default: "", // Set default to an empty string or other appropriate default value
    },
    css: {
      type: String,
      default: "", // Set default to an empty string or other appropriate default value
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('Page', pageSchema);
