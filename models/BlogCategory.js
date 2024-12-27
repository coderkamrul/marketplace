// const mongoose = require('mongoose');
// const slugify = require('slugify');

// const categorySchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//     unique: true,
//   },
//   slug: {
//     type: String,
//     unique: true,
//   },
//   image: {
//     url: String,
//     id: String,
//   },
//   status: {
//     type: String,
//     enum: ['published', 'draft'],
//     default: 'published',
//   },
// }, {
//   timestamps: true,
// });

// // Auto-generate slug from name if not provided
// categorySchema.pre('save', function(next) {
//   if (!this.slug) {
//     this.slug = slugify(this.name, { lower: true });
//   }
//   next();
// });

// // Virtual for post count
// categorySchema.virtual('postCount', {
//   ref: 'Blog',
//   localField: '_id',
//   foreignField: 'category',
//   count: true,
// });

// const BlogCategory = mongoose.model('BlogCategory', categorySchema);

// module.exports = BlogCategory;



const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  image: {
    url: String,
    id: String,
  },
  status: {
    type: String,
    enum: ['published', 'draft'],
    default: 'published',
  },
  postCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});


const BlogCategory = mongoose.model('BlogCategory', categorySchema);

module.exports = BlogCategory;
