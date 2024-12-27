const express = require('express');
const {
  createPage,
  getPages,
  getPageById,  // Import the new controller function
  updatePage,
  deletePage,
  clonePage,
  savePage,
  loadPage,
} = require('../controllers/pageController');

const router = express.Router();

// Route to create a new page and get all pages
router.route('/').post(createPage).get(getPages);

// Route to get a specific page by ID, update a page by ID, and delete a page by ID
router.route('/:id')
  .get(getPageById)  // Add the GET route for fetching a page by ID
  .put(updatePage)
  .delete(deletePage);
  router.route('/custom/:id').post(savePage);
router.route('/custom/:id').get(loadPage);

  // Route to clone a page by ID
  router.post('/clone/:id', clonePage);

module.exports = router;
