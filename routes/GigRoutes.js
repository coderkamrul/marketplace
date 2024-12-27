const express =require('express');
const {
  getGigs,
  getGigById,
  createGig,
  updateGig,
  deleteGig,
  getGigStats,
  addGigStats,
  updateGigStats,
} = require( '../controllers/gigController.js');
const auth = require('../middlewares/auth.js');

const router = express.Router();

router.route('/').get(getGigs).post(createGig);
router.route('/:id').get(getGigById).put(updateGig).delete(deleteGig);
router.route('/stats/:id').get(getGigStats).post(addGigStats);

module.exports = router;

