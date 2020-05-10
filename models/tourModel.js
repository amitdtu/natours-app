const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const TourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have name'],
      unique: true,
      trim: true,
      minlength: [10, 'A tour name must have greater or equal 10 characters'],
      maxlength: [40, 'A tour name must have less or equal 40 characters'],
      // validate: [validator.isAlpha, 'doesnt contain numbers'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have durations'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have group Size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have difficulty'],
      emum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'difficulty must be either: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'rating must be above 1'],
      max: [5, 'rating must be below 5'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price {VALUE} must be less than regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have cover image'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    images: [String],
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

TourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE run before .save() and .create()
TourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// TourSchema.pre('save', function (next) {
//   console.log('will save documn=ent');
//   next();
// });

// TourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// Query MIDDLEWARE
TourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

TourSchema.post(/^find/, function (doc, next) {
  // console.log(doc);
  next();
});

// AGGREATE MIDDLEWARE
TourSchema.pre('aggregate', function (next) {
  // this.pipeline() returns array and unshift method used to add element at index 0
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', TourSchema);

module.exports = Tour;
