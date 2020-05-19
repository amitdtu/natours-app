const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// POST /tour/sa4564s5da4s54/reviews
// POST /reviews

router
  .route('/')
  .get(reviewController.getAllReview)
  .post(
    authController.protect,
    authController.restrictedTo('user'),
    reviewController.setTourAndUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .delete(reviewController.deleteReview)
  .patch(reviewController.updateReview);

module.exports = router;
