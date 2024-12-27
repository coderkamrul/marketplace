const Page = require('../models/page');

// Create a new page
exports.createPage = async (req, res) => {
  try {
    const { pageName, pageLink, pageMenu, pageStatus, pageType } = req.body;

    const page = new Page({
      pageName,
      pageLink,
      pageMenu,
      pageStatus,
      pageType,
    });

    await page.save();
    res.status(201).json({ success: true, data: page });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all pages
exports.getPages = async (req, res) => {
  try {
    const pages = await Page.find();
    res.status(200).json({ success: true, data: pages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
// **Get a single page by ID**
exports.getPageById = async (req, res) => {
  try {
    const { id } = req.params;
    const page = await Page.findById(id);

    if (!page) {
      return res.status(404).json({ success: false, error: 'Page not found' });
    }

    res.status(200).json({ success: true, data: page });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update a page
exports.updatePage = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPage = await Page.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedPage) {
      return res.status(404).json({ success: false, error: 'Page not found' });
    }

    res.status(200).json({ success: true, data: updatedPage });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete a page
exports.deletePage = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPage = await Page.findByIdAndDelete(id);

    if (!deletedPage) {
      return res.status(404).json({ success: false, error: 'Page not found' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



// Clone a page
exports.clonePage = async (req, res) => {
  try {
    const { id } = req.params;
    const originalPage = await Page.findById(id);

    if (!originalPage) {
      return res.status(404).json({ success: false, error: 'Page not found' });
    }

    // Create a new page object by copying the original page's properties
    const clonedPageData = {
      pageName: originalPage.pageName + ' - Copy', // Append ' - Copy' to distinguish the clone
      pageLink: generateUniquePageLink(originalPage.pageLink), // Generate a unique pageLink
      pageMenu: originalPage.pageMenu,
      pageStatus: originalPage.pageStatus,
      pageType: originalPage.pageType,
    };

    const clonedPage = new Page(clonedPageData);

    await clonedPage.save();

    res.status(201).json({ success: true, data: clonedPage });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Helper function to generate a unique pageLink
const generateUniquePageLink = (originalLink) => {
  const timestamp = Date.now();
  return `${originalLink}-${timestamp}`;
};


// Save page data
exports.savePage = async (req, res) => {
  const pageId = req.params.id;
  const { html, css } = req.body;

  // Log incoming data for debugging
  // console.log('Saving page with ID:', pageId);
  // console.log('Received HTML:', html);
  // console.log('Received CSS:', css);

  try {
    let page = await Page.findById(pageId);
    
    if (page) {
      // Update existing page
      page.html = html;
      page.css = css;
      await page.save();
      console.log('Page updated successfully');
    } else {
      // Create new page
      page = new Page({ _id: pageId, html, css });
      await page.save();
      console.log('New page created successfully');
    }
    
    res.status(200).send({ success: true, status: 'success' });
  } catch (error) {
    console.error('Error saving the page:', error);
    res.status(500).send({ success: false, error: 'Failed to save the page' });
  }
};

// Load page data
exports.loadPage = async (req, res) => {
  const pageId = req.params.id;

  try {
    const page = await Page.findById(pageId);
    if (page) {
      res.status(200).send({ success: true, html: page.html, css: page.css });
    } else {
      res.status(404).send({ success: false, error: 'Page not found' });
    }
  } catch (error) {
    console.error('Error loading the page:', error);
    res.status(500).send({ success: false, error: 'Failed to load the page' });
  }
};


