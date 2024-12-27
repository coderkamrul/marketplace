const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupons');

// // Create a new coupon
// router.post('/', async (req, res) => {
//   try {
//     const coupon = new Coupon(req.body);
//     await coupon.save();
//     res.status(201).json(coupon);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// Create a new coupon
router.post('/', async (req, res) => {
  const {
    code,
    discountType,
    discountValue,
    minPurchase,
    expirationDate,
    usageLimit,
    isActive,
    applicableType,
    productIds,
    categoryIds,
  } = req.body;

  try {
    const coupon = new Coupon({
      code,
      discountType,
      discountValue,
      minPurchase,
      expirationDate,
      usageLimit,
      isActive,
      applicableType,
      productIds: applicableType === 'products' ? productIds : [],
      categoryIds: applicableType === 'categories' ? categoryIds : [],
    });
    await coupon.save();
    res.status(201).json(coupon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all coupons
router.get('/', async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific coupon
router.get('/:id', getCoupon, (req, res) => {
  res.json(res.coupon);
});


// Update a coupon
router.put('/:id', getCoupon, async (req, res) => {
  const {
    code,
    discountType,
    discountValue,
    minPurchase,
    expirationDate,
    usageLimit,
    isActive,
    applicableType,
    productIds,
    categoryIds,
  } = req.body;

  // Update fields only if they are provided
  if (code != null) {
    res.coupon.code = code;
  }
  if (discountType != null) {
    res.coupon.discountType = discountType;
  }
  if (discountValue != null) {
    res.coupon.discountValue = discountValue;
  }
  if (minPurchase != null) {
    res.coupon.minPurchase = minPurchase;
  }
  if (expirationDate != null) {
    res.coupon.expirationDate = expirationDate;
  }
  if (usageLimit != null) {
    res.coupon.usageLimit = usageLimit;
  }
  if (isActive != null) {
    res.coupon.isActive = isActive;
  }

  // Handle applicableType, productIds, and categoryIds
  if (applicableType != null) {
    res.coupon.applicableType = applicableType;
  }

  if (applicableType === 'products' && productIds != null) {
    res.coupon.productIds = productIds;
  } else if (applicableType === 'categories' && categoryIds != null) {
    res.coupon.categoryIds = categoryIds;
  } else {
    // If applicableType is 'all' or not provided, clear the productIds and categoryIds
    res.coupon.productIds = [];
    res.coupon.categoryIds = [];
  }

  try {
    const updatedCoupon = await res.coupon.save();
    res.json(updatedCoupon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



// Delete a coupon
router.delete('/:id', getCoupon, async (req, res) => {
  try {
    await Coupon.deleteOne({ _id: res.coupon._id }); // Replace `res.coupon.remove()` with `deleteOne()`
    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Middleware function to get coupon by ID
async function getCoupon(req, res, next) {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (coupon == null) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.coupon = coupon;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}




// Validate a coupon
router.post('/validate', async (req, res) => {
  const { couponCode, totalAmount, productIds = [], categoryIds = [] } = req.body;

  if (!couponCode) {
    return res.status(400).json({ message: 'Coupon code is required' });
  }

  try {
    const coupon = await Coupon.findOne({ code: couponCode, isActive: true });

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid or expired coupon' });
    }

    const currentDate = new Date();
    if (coupon.expirationDate < currentDate) {
      return res.status(400).json({ message: 'Coupon has expired' });
    }

    if (totalAmount < coupon.minPurchase) {
      return res.status(400).json({
        message: `Minimum purchase of $${coupon.minPurchase} is required to use this coupon.`,
      });
    }

    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: 'Coupon usage limit exceeded' });
    }

    if (coupon.applicableType === 'products') {
      const areAllProductsApplicable = productIds.every((id) => coupon.productIds.includes(id));
      const hasNonApplicableProducts = productIds.some((id) => !coupon.productIds.includes(id));

      if (!areAllProductsApplicable || hasNonApplicableProducts) {
        return res.status(400).json({ 
          message: 'This coupon is only applicable to specific products and cannot be applied with other products.' 
        });
      }
    }

    if (coupon.applicableType === 'categories') {
      const areAllCategoriesApplicable = categoryIds.every((id) => coupon.categoryIds.includes(id));
      const hasNonApplicableCategories = categoryIds.some((id) => !coupon.categoryIds.includes(id));

      if (!areAllCategoriesApplicable || hasNonApplicableCategories) {
        return res.status(400).json({ 
          message: 'This coupon is only applicable to specific categories and cannot be applied with other categories.' 
        });
      }
    }

    res.json({
      isValid: true,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minPurchase: coupon.minPurchase,
      id: coupon._id.toString(),
      usageLimit: coupon.usageLimit,
      usedCount: coupon.usedCount,
      message: 'Coupon is valid',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});





// Increment coupon usage after checkout
router.post('/incrementUsage', async (req, res) => {
  const { couponId } = req.body;

  if (!couponId) {
    return res.status(400).json({ message: 'Coupon ID is required' });
  }

  try {
    // Find the coupon by ID
    const coupon = await Coupon.findById(couponId);

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    // Increment the usedCount only after the checkout is complete
    coupon.usedCount += 1;
    await coupon.save(); // Save the updated coupon

    res.json({ message: 'Coupon usage count updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;

