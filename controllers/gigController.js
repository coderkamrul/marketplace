
// const asyncHandler = require('express-async-handler');
// const Gig = require('../models/Gig');

// // @desc    Get all gigs
// // @route   GET /api/gigs
// // @access  Public
// const getGigs = asyncHandler(async (req, res) => {
//   const gigs = await Gig.find({});
//   const gigsWithTotals = gigs.map(gig => {
//     const gigObject = gig.toObject();
//     return { ...gigObject, ...gig.calculateTotals() };
//   });
//   res.json(gigsWithTotals);
// });

// // @desc    Get single gig
// // @route   GET /api/gigs/:id
// // @access  Public
// const getGigById = asyncHandler(async (req, res) => {
//   const gig = await Gig.findById(req.params.id);
//   if (gig) {
//     res.json({ ...gig.toObject(), ...gig.calculateTotals() });
//   } else {
//     res.status(404);
//     throw new Error('Gig not found');
//   }
// });

// // @desc    Create a gig
// // @route   POST /api/gigs
// // @access  Private
// const createGig = asyncHandler(async (req, res) => {
//   const {
//     title,
//     category,
//     subcategory,
//     searchTags,
//     positiveKeywords,
//     negativeKeywords,
//     isThreePackages,
//     packages,
//     description,
//     faqs,
//     requirements,
//     images,
//     status,
//     cancellations,
//     hasSubscription,
//     averageDeliveryTime,
//     ordersInQueue,
//   } = req.body;

//   const gig = new Gig({
//     title,
//     category,
//     subcategory,
//     searchTags,
//     positiveKeywords,
//     negativeKeywords,
//     isThreePackages,
//     packages,
//     description,
//     faqs,
//     requirements,
//     images,
//     status,
//     cancellations,
//     hasSubscription,
//     averageDeliveryTime,
//     ordersInQueue,
//   });

//   const createdGig = await gig.save();
//   res.status(201).json(createdGig);
// });

// // @desc    Update a gig
// // @route   PUT /api/gigs/:id
// // @access  Private
// const updateGig = asyncHandler(async (req, res) => {
//   const {
//     title,
//     category,
//     subcategory,
//     searchTags,
//     positiveKeywords,
//     negativeKeywords,
//     isThreePackages,
//     packages,
//     description,
//     faqs,
//     requirements,
//     images,
//     status,
//     cancellations,
//     hasSubscription,
//     averageDeliveryTime,
//     ordersInQueue,
//     stats // Add stats to the request body
//   } = req.body;

//   const gig = await Gig.findById(req.params.id);

//   if (gig) {
//     // Update basic gig details
//     gig.title = title || gig.title;
//     gig.category = category || gig.category;
//     gig.subcategory = subcategory || gig.subcategory;
//     gig.searchTags = searchTags || gig.searchTags;
//     gig.positiveKeywords = positiveKeywords || gig.positiveKeywords;
//     gig.negativeKeywords = negativeKeywords || gig.negativeKeywords;
//     gig.isThreePackages = isThreePackages !== undefined ? isThreePackages : gig.isThreePackages;
//     gig.packages = packages || gig.packages;
//     gig.description = description || gig.description;
//     gig.faqs = faqs || gig.faqs;
//     gig.requirements = requirements || gig.requirements;
//     gig.images = images || gig.images;
//     gig.status = status || gig.status;
//     gig.cancellations = cancellations || gig.cancellations;
//     gig.hasSubscription = hasSubscription !== undefined ? hasSubscription : gig.hasSubscription;
//     gig.averageDeliveryTime = averageDeliveryTime || gig.averageDeliveryTime;
//     gig.ordersInQueue = ordersInQueue || gig.ordersInQueue;

//     // Update stats if provided
//     if (stats && Array.isArray(stats)) {
//       gig.stats = gig.stats.concat(stats);  // Append new stats to existing ones
//     }

//     const updatedGig = await gig.save();
//     res.json(updatedGig);
//   } else {
//     res.status(404);
//     throw new Error('Gig not found');
//   }
// });


// // @desc    Delete a gig
// // @route   DELETE /api/gigs/:id
// // @access  Private
// const deleteGig = asyncHandler(async (req, res) => {
//   const gig = await Gig.findByIdAndDelete(req.params.id);

//   if (gig) {
//     res.json({ message: 'Gig removed' });
//   } else {
//     res.status(404);
//     throw new Error('Gig not found');
//   }
// });

// // @desc    Get gig stats
// // @route   GET /api/gigs/:id/stats
// // @access  Private
// const getGigStats = asyncHandler(async (req, res) => {
//   const gig = await Gig.findById(req.params.id);

//   if (gig) {
//     res.json(gig.stats);
//   } else {
//     res.status(404);
//     throw new Error('Gig not found');
//   }
// });

// // @desc    Add gig stats
// // @route   POST /api/gigs/:id/stats
// // @access  Private
// const addGigStats = asyncHandler(async (req, res) => {
//   const { date, impressions, clicks, orders } = req.body;

//   const gig = await Gig.findById(req.params.id);

//   if (!gig) {
//     res.status(404);
//     throw new Error('Gig not found');
//   }

//   // Validate the new stat object
//   if (!date || impressions == null || clicks == null || orders == null) {
//     res.status(400);
//     throw new Error('Invalid data: All fields (date, impressions, clicks, orders) are required.');
//   }

//   // Append new stat to the stats array
//   gig.stats.push({ date, impressions, clicks, orders });

//   // Save the document
//   await gig.save();

//   // Respond with the updated gig
//   res.status(201).json(gig);
// });






// module.exports = {
//   getGigs,
//   getGigById,
//   createGig,
//   updateGig,
//   deleteGig,
//   getGigStats,
//   addGigStats,
// };


// const asyncHandler = require('express-async-handler');
// const Gig = require('../models/Gig');
// const User = require('../models/User');

// // @desc    Get all gigs
// // @route   GET /api/gigs
// // @access  Public
// exports.getGigs = asyncHandler(async (req, res) => {
//   const gigs = await Gig.find({});
//   const gigsWithTotals = gigs.map(gig => {
//     const gigObject = gig.toObject();
//     return { ...gigObject, ...gig.calculateTotals() };
//   });
//   res.json(gigsWithTotals);
// });

// // @desc    Get single gig
// // @route   GET /api/gigs/:id
// // @access  Public
// exports.getGigById = asyncHandler(async (req, res) => {
//   const gig = await Gig.findById(req.params.id);
//   if (gig) {
//     res.json({ ...gig.toObject(), ...gig.calculateTotals() });
//   } else {
//     res.status(404);
//     throw new Error('Gig not found');
//   }
// });

// // @desc    Create a gig
// // @route   POST /api/gigs
// // @access  Private
// exports.createGig = asyncHandler(async (req, res) => {
//   const {
//     title,
//     category,
//     subcategory,
//     searchTags,
//     positiveKeywords,
//     negativeKeywords,
//     isThreePackages,
//     packages,
//     description,
//     faqs,
//     requirements,
//     images,
//     status,
//     cancellations,
//     hasSubscription,
//     averageDeliveryTime,
//     ordersInQueue,
//   } = req.body;

//   let seller;
//   if (req.user && req.user.id) {
//     seller = await User.findById(req.user.id);
//     if (!seller) {
//       return res.status(404).json({ message: 'Seller not found' });
//     }
//   } else {
//     return res.status(401).json({ message: 'User not authenticated' });
//   }

//   const gig = new Gig({
//     title,
//     category,
//     subcategory,
//     searchTags,
//     positiveKeywords,
//     negativeKeywords,
//     isThreePackages,
//     packages,
//     description,
//     faqs,
//     requirements,
//     images,
//     status,
//     cancellations,
//     hasSubscription,
//     averageDeliveryTime,
//     ordersInQueue,
//     seller: {
//       id: seller._id,
//       name: seller.name,
//       image: seller.picture,
//       label: seller.label,
//       averageRating: seller.averageRating,
//       totalReviews: seller.totalReviews
//     },
//   });

//   const createdGig = await gig.save();
//   res.status(201).json(createdGig);
// });

// // @desc    Update a gig
// // @route   PUT /api/gigs/:id
// // @access  Private
// exports.updateGig = asyncHandler(async (req, res) => {
//   const {
//     title,
//     category,
//     subcategory,
//     searchTags,
//     positiveKeywords,
//     negativeKeywords,
//     isThreePackages,
//     packages,
//     description,
//     faqs,
//     requirements,
//     images,
//     status,
//     cancellations,
//     hasSubscription,
//     averageDeliveryTime,
//     ordersInQueue,
//     stats
//   } = req.body;

//   let gig;
//   if (req.user && req.user.id) {
//     gig = await Gig.findOne({ _id: req.params.id, 'seller.id': req.user.id });
//   } else {
//     return res.status(401).json({ message: 'User not authenticated' });
//   }

//   if (gig) {
//     gig.title = title || gig.title;
//     gig.category = category || gig.category;
//     gig.subcategory = subcategory || gig.subcategory;
//     gig.searchTags = searchTags || gig.searchTags;
//     gig.positiveKeywords = positiveKeywords || gig.positiveKeywords;
//     gig.negativeKeywords = negativeKeywords || gig.negativeKeywords;
//     gig.isThreePackages = isThreePackages !== undefined ? isThreePackages : gig.isThreePackages;
//     gig.packages = packages || gig.packages;
//     gig.description = description || gig.description;
//     gig.faqs = faqs || gig.faqs;
//     gig.requirements = requirements || gig.requirements;
//     gig.images = images || gig.images;
//     gig.status = status || gig.status;
//     gig.cancellations = cancellations || gig.cancellations;
//     gig.hasSubscription = hasSubscription !== undefined ? hasSubscription : gig.hasSubscription;
//     gig.averageDeliveryTime = averageDeliveryTime || gig.averageDeliveryTime;
//     gig.ordersInQueue = ordersInQueue || gig.ordersInQueue;

//     if (stats && Array.isArray(stats)) {
//       gig.stats = gig.stats.concat(stats);
//     }

//     const updatedGig = await gig.save();
//     res.json(updatedGig);
//   } else {
//     res.status(404);
//     throw new Error('Gig not found or you are not the seller');
//   }
// });

// // @desc    Delete a gig
// // @route   DELETE /api/gigs/:id
// // @access  Private
// exports.deleteGig = asyncHandler(async (req, res) => {
//   if (!req.user || !req.user.id) {
//     return res.status(401).json({ message: 'User not authenticated' });
//   }
//   const gig = await Gig.findOneAndDelete({ _id: req.params.id, 'seller.id': req.user.id });

//   if (gig) {
//     res.json({ message: 'Gig removed' });
//   } else {
//     res.status(404);
//     throw new Error('Gig not found or you are not the seller');
//   }
// });

// // @desc    Get gig stats
// // @route   GET /api/gigs/:id/stats
// // @access  Private
// exports.getGigStats = asyncHandler(async (req, res) => {
//   if (!req.user || !req.user.id) {
//     return res.status(401).json({ message: 'User not authenticated' });
//   }
//   const gig = await Gig.findOne({ _id: req.params.id, 'seller.id': req.user.id });

//   if (gig) {
//     res.json(gig.stats);
//   } else {
//     res.status(404);
//     throw new Error('Gig not found or you are not the seller');
//   }
// });

// // @desc    Add gig stats
// // @route   POST /api/gigs/:id/stats
// // @access  Private
// exports.addGigStats = asyncHandler(async (req, res) => {
//   if (!req.user || !req.user.id) {
//     return res.status(401).json({ message: 'User not authenticated' });
//   }
//   const { date, impressions, clicks, orders } = req.body;

//   const gig = await Gig.findOne({ _id: req.params.id, 'seller.id': req.user.id });

//   if (!gig) {
//     res.status(404);
//     throw new Error('Gig not found or you are not the seller');
//   }

//   if (!date || impressions == null || clicks == null || orders == null) {
//     res.status(400);
//     throw new Error('Invalid data: All fields (date, impressions, clicks, orders) are required.');
//   }

//   gig.stats.push({ date, impressions, clicks, orders });
//   await gig.save();
//   res.status(201).json(gig);
// });

// // @desc    Get seller gigs
// // @route   GET /api/gigs/seller
// // @access  Private
// exports.getSellerGigs = asyncHandler(async (req, res) => {
//   const gigs = await Gig.find({ 'seller.id': req.user.id });
//   res.json(gigs);
// });

// // @desc    Add review to gig
// // @route   POST /api/gigs/:id/reviews
// // @access  Private
// exports.addReview = asyncHandler(async (req, res) => {
//   const { rating, comment } = req.body;
//   const gig = await Gig.findById(req.params.id);

//   if (gig) {
//     const alreadyReviewed = gig.reviews.find(
//       (r) => r.userId.toString() === req.user.id.toString()
//     );

//     if (alreadyReviewed) {
//       res.status(400);
//       throw new Error('Gig already reviewed');
//     }

//     const review = {
//       userId: req.user.id,
//       rating: Number(rating),
//       comment,
//     };

//     gig.reviews.push(review);
//     await gig.save();

//     // Update seller's rating
//     const seller = await User.findById(gig.seller.id);
//     if (seller) {
//       await seller.updateRatingAndReviews();
//     }

//     res.status(201).json({ message: 'Review added' });
//   } else {
//     res.status(404);
//     throw new Error('Gig not found');
//   }
// });

const asyncHandler = require('express-async-handler');
const Gig = require('../models/Gig');
const User = require('../models/User');

// @desc    Get all gigs
// @route   GET /api/gigs
// @access  Public
exports.getGigs = asyncHandler(async (req, res) => {
  const gigs = await Gig.find({});
  const gigsWithTotals = gigs.map(gig => {
    const gigObject = gig.toObject();
    return { ...gigObject, ...gig.calculateTotals() };
  });
  res.json(gigsWithTotals);
});

// @desc    Get single gig
// @route   GET /api/gigs/:id
// @access  Public
exports.getGigById = asyncHandler(async (req, res) => {
  const gig = await Gig.findById(req.params.id);
  if (gig) {
    res.json({ ...gig.toObject(), ...gig.calculateTotals() });
  } else {
    res.status(404);
    throw new Error('Gig not found');
  }
});

// @desc    Create a gig
// @route   POST /api/gigs
// @access  Private
exports.createGig = asyncHandler(async (req, res) => {
  const { seller, ...gigData } = req.body;

  if (!seller || !seller.id) {
    return res.status(400).json({ message: 'Seller information is required' });
  }

  const gig = new Gig({
    ...gigData,
    seller
  });

  const createdGig = await gig.save();
  res.status(201).json(createdGig);
});

// @desc    Update a gig
// @route   PUT /api/gigs/:id
// @access  Private
exports.updateGig = asyncHandler(async (req, res) => {
  const {
    title,
    category,
    subcategory,
    searchTags,
    positiveKeywords,
    negativeKeywords,
    isThreePackages,
    packages,
    description,
    faqs,
    requirements,
    images,
    status,
    cancellations,
    hasSubscription,
    averageDeliveryTime,
    ordersInQueue,
    stats
  } = req.body;

  const gig = await Gig.findById(req.params.id);

  if (!gig) {
    return res.status(404).json({ message: 'Gig not found' });
  }

  gig.title = title || gig.title;
  gig.category = category || gig.category;
  gig.subcategory = subcategory || gig.subcategory;
  gig.searchTags = searchTags || gig.searchTags;
  gig.positiveKeywords = positiveKeywords || gig.positiveKeywords;
  gig.negativeKeywords = negativeKeywords || gig.negativeKeywords;
  gig.isThreePackages = isThreePackages !== undefined ? isThreePackages : gig.isThreePackages;
  gig.packages = packages || gig.packages;
  gig.description = description || gig.description;
  gig.faqs = faqs || gig.faqs;
  gig.requirements = requirements || gig.requirements;
  gig.images = images || gig.images;
  gig.status = status || gig.status;
  gig.cancellations = cancellations || gig.cancellations;
  gig.hasSubscription = hasSubscription !== undefined ? hasSubscription : gig.hasSubscription;
  gig.averageDeliveryTime = averageDeliveryTime || gig.averageDeliveryTime;
  gig.ordersInQueue = ordersInQueue || gig.ordersInQueue;

  if (stats && Array.isArray(stats)) {
    gig.stats = gig.stats.concat(stats);
  }

  const updatedGig = await gig.save();
  res.json(updatedGig);
});

// @desc    Delete a gig
// @route   DELETE /api/gigs/:id
// @access  Private
exports.deleteGig = asyncHandler(async (req, res) => {
  const gig = await Gig.findOneAndDelete({ _id: req.params.id });

  if (gig) {
    res.json({ message: 'Gig removed' });
  } else {
    res.status(404);
    throw new Error('Gig not found or you are not the seller');
  }
});

// @desc    Get gig stats
// @route   GET /api/gigs/:id/stats
// @access  Private
exports.getGigStats = asyncHandler(async (req, res) => {
  const gig = await Gig.findById(req.params.id);

  if (gig) {
    res.json(gig.stats);
  } else {
    res.status(404);
    throw new Error('Gig not found or you are not the seller');
  }
});

// @desc    Add gig stats
// @route   POST /api/gigs/:id/stats
// @access  Private
exports.addGigStats = asyncHandler(async (req, res) => {
  const { date, impressions, clicks, orders } = req.body;

  const gig = await Gig.findById(req.params.id);

  if (!gig) {
    res.status(404);
    throw new Error('Gig not found or you are not the seller');
  }

  if (!date || impressions == null || clicks == null || orders == null) {
    res.status(400);
    throw new Error('Invalid data: All fields (date, impressions, clicks, orders) are required.');
  }

  gig.stats.push({ date, impressions, clicks, orders });
  await gig.save();
  res.status(201).json(gig);
});

// @desc    Get seller gigs
// @route   GET /api/gigs/seller
// @access  Private
exports.getSellerGigs = asyncHandler(async (req, res) => {
  const gigs = await Gig.find({});
  res.json(gigs);
});

// @desc    Add review to gig
// @route   POST /api/gigs/:id/reviews
// @access  Private
exports.addReview = asyncHandler(async (req, res) => {
  const { userId, rating, comment } = req.body;
  const gig = await Gig.findById(req.params.id);

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required for adding a review' });
  }

  if (gig) {
    const alreadyReviewed = gig.reviews.find(
      (r) => r.userId.toString() === userId.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Gig already reviewed');
    }

    const review = {
      userId,
      rating: Number(rating),
      comment,
    };

    gig.reviews.push(review);
    await gig.save();

    // Update seller's rating
    const seller = await User.findById(gig.seller.id);
    if (seller) {
      await seller.updateRatingAndReviews();
    }

    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Gig not found');
  }
});

