/* eslint-disable prettier/prettier */
const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('../routes/reviewRoutes');
const router = express.Router();

// router.param('id', tourController.checkId);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictedTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

// POST /tour/sa4564s5da4s54/reviews   (create review for a tour)
// GET /tour/sa4564s5da4s54/reviews  (get reviews for a tour)
// POST /tour/sa4564s5da4s54/review/adas4d5adsa1d54a5 (get specific review)

router.use('/:tourId/reviews', reviewRouter); // if router starts with this url then redirect to reviewRouter

module.exports = router;
