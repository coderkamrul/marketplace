// const express =require('express');
// const Blog =require('../models/Blog.js');


// const router = express.Router();

// // Create a new blog
// router.post('/', async (req, res) => {
//   try {
//     const blog = new Blog({
//       ...req.body,
//       tags: req.body.tags.split(',').map(tag => tag.trim()),
//       seoKeywords: req.body.seoKeywords.split(',').map(keyword => keyword.trim()),
//     });
//     await blog.save();
//     res.status(201).json(blog);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });


// // Clone a blog
// router.post('/clone/:id', async (req, res) => {
//   try {
//     const originalBlog = await Blog.findById(req.params.id);
//     if (!originalBlog) {
//       return res.status(404).json({ message: 'Blog not found' });
//     }

//     // Create a new blog object with the original blog's data
//     const clonedBlog = new Blog({
//       title: `${originalBlog.title} (Copy)`,
//       description: originalBlog.description,
//       content: originalBlog.content,
//       category: originalBlog.category,
//       tags: originalBlog.tags,
//       status: 'draft', // Always set cloned blog to draft
//       featured: false, // Reset featured status
//       seoTitle: originalBlog.seoTitle,
//       seoDescription: originalBlog.seoDescription,
//       seoKeywords: originalBlog.seoKeywords,
//       images: originalBlog.images
//     });

//     await clonedBlog.save();
//     res.status(201).json(clonedBlog);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });


// // Get all blogs
// router.get('/', async (req, res) => {
//   try {
//     const blogs = await Blog.find()
//       .populate('category', 'name')
//       .sort({ createdAt: -1 });
//     res.json(blogs);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Get a single blog by slug
// router.get('/:slug', async (req, res) => {
//   try {
//     const blog = await Blog.findOne({ slug: req.params.slug })
//       .populate('category', 'name');
//     if (!blog) {
//       return res.status(404).json({ message: 'Blog not found' });
//     }
//     res.json(blog);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Update a blog
// router.patch('/:id', async (req, res) => {
//   try {
//     const blog = await Blog.findById(req.params.id);
//     if (!blog) {
//       return res.status(404).json({ message: 'Blog not found' });
//     }

    // Object.assign(blog, {
    //   ...req.body,
    //   tags: req.body.tags?.split(',').map(tag => tag.trim()),
    //   seoKeywords: req.body.seoKeywords?.split(',').map(keyword => keyword.trim()),
    // });

//     await blog.save();
//     res.json(blog);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Delete a blog
// router.delete('/:id', async (req, res) => {
//   try {
//     const blog = await Blog.findById(req.params.id);
//     if (!blog) {
//       return res.status(404).json({ message: 'Blog not found' });
//     }

//     await blog.deleteOne();
//     res.json({ message: 'Blog deleted' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });




const express = require('express');
const Blog = require('../models/Blog');
const BlogCategory = require('../models/BlogCategory');

const router = express.Router();

// Utility Function to Update postCount in BlogCategory
const updateCategoryPostCount = async (categoryId) => {
  const count = await Blog.countDocuments({ category: categoryId });
  await BlogCategory.findByIdAndUpdate(categoryId, { postCount: count });
};

// BLOG ROUTES

// Create a New Blog
router.post('/', async (req, res) => {
  try {
    const blog = new Blog({
      ...req.body,
      tags: req.body.tags.split(',').map(tag => tag.trim()),
      seoKeywords: req.body.seoKeywords.split(',').map(keyword => keyword.trim()),
    });
    await blog.save();

    // Update post count for the category
    await updateCategoryPostCount(blog.category);

    res.status(201).json(blog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Clone a Blog
router.post('/clone/:id', async (req, res) => {
  try {
    const originalBlog = await Blog.findById(req.params.id);
    if (!originalBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const clonedBlog = new Blog({
      title: `${originalBlog.title} (Copy)`,
      description: originalBlog.description,
      content: originalBlog.content,
      category: originalBlog.category,
      tags: originalBlog.tags,
      status: 'draft',
      featured: false,
      seoTitle: originalBlog.seoTitle,
      seoDescription: originalBlog.seoDescription,
      seoKeywords: originalBlog.seoKeywords,
      images: originalBlog.images,
    });

    await clonedBlog.save();

    // Update post count for the category
    await updateCategoryPostCount(clonedBlog.category);

    res.status(201).json(clonedBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get All Blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('category', 'name')
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a Blog by Slug
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug })
      .populate('category', 'name');
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a Blog
router.patch('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const oldCategory = blog.category;

    // Handle tags and seoKeywords safely
    const tags =
      typeof req.body.tags === 'string'
        ? req.body.tags.split(',').map(tag => tag.trim())
        : blog.tags; // Retain existing tags if not provided

    const seoKeywords =
      typeof req.body.seoKeywords === 'string'
        ? req.body.seoKeywords.split(',').map(key => key.trim())
        : blog.seoKeywords; // Retain existing seoKeywords if not provided

    Object.assign(blog, {
      ...req.body,
      tags,
      seoKeywords,
    });

    await blog.save();

    // Update post counts for both old and new categories if category changed
    if (oldCategory.toString() !== blog.category.toString()) {
      await updateCategoryPostCount(oldCategory);
      await updateCategoryPostCount(blog.category);
    } else {
      await updateCategoryPostCount(blog.category);
    }

    res.json(blog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Delete a Blog
router.delete('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const categoryId = blog.category;

    await blog.deleteOne();

    // Update post count for the category
    await updateCategoryPostCount(categoryId);

    res.json({ message: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

