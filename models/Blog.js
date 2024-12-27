// const mongoose =require('mongoose');

// const blogSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   content: {
//     type: String,
//     required: true,
//   },
//   category: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'BlogCategory',
//     required: true,
//   },
//   tags: [{
//     type: String,
//     trim: true,
//   }],
//   status: {
//     type: String,
//     enum: ['draft', 'published', 'archived'],
//     default: 'draft',
//   },
//   featured: {
//     type: Boolean,
//     default: false,
//   },
//   images: [{
//     url: String,
//     id: String,
//   }],
//   seoTitle: String,
//   seoDescription: String,
//   seoKeywords: [String],
//   slug: {
//     type: String,
//     unique: true,
//   },
// }, {
//   timestamps: true,
// });

// // Generate slug before saving
// blogSchema.pre('save', function(next) {
//   if (this.isModified('title')) {
//     this.slug = this.title
//       .toLowerCase()
//       .replace(/[^a-zA-Z0-9]/g, '-')
//       .replace(/-+/g, '-');
//   }
//   next();
// });

// const Blog = mongoose.model('Blog', blogSchema);

// module.exports = Blog;



const mongoose = require('mongoose');
const BlogCategory = require('./BlogCategory'); // Import BlogCategory model

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BlogCategory',
    required: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  images: [{
    url: String,
    id: String,
  }],
  seoTitle: String,
  seoDescription: String,
  seoKeywords: [String],
  slug: {
    type: String,
    unique: true,
  },
}, {
  timestamps: true,
});

// Generate slug before saving
blogSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-');
  }
  next();
});

// Increment post count when a blog is created
blogSchema.post('save', async function (doc) {
  await BlogCategory.findByIdAndUpdate(
    doc.category,
    { $inc: { postCount: 1 } } // Increment post count
  );
});

// Decrement post count when a blog is removed
blogSchema.post('remove', async function (doc) {
  await BlogCategory.findByIdAndUpdate(
    doc.category,
    { $inc: { postCount: -1 } } // Decrement post count
  );
});

// Handle category changes during blog updates
blogSchema.pre('findOneAndUpdate', async function (next) {
  const docToUpdate = await this.model.findOne(this.getQuery());
  const updatedCategory = this.getUpdate().category;

  if (docToUpdate.category.toString() !== updatedCategory.toString()) {
    // Decrement post count for the old category
    await BlogCategory.findByIdAndUpdate(
      docToUpdate.category,
      { $inc: { postCount: -1 } }
    );
    // Increment post count for the new category
    await BlogCategory.findByIdAndUpdate(
      updatedCategory,
      { $inc: { postCount: 1 } }
    );
  }
  next();
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
