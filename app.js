const express = require('express');
const morgan = require('morgan');
const rateLimiter = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const helmet = require('helmet');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

// global middleware

// set security http headers
app.use(helmet());

// limit request from same IP
const limiter = rateLimiter({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour',
});

app.use('/api', limiter);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// body parser reading req.body json data
app.use(express.json({ limit: '10kb' }));

// sanatize req.body data against NoSQL query injection
app.use(mongoSanitize());

// protect from xss attack
app.use(xss());

// http pollution prevent
app.use(
  hpp({
    whitelist: [
      'duration',
      'price',
      'difficulty',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
    ],
  })
);

// testing middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

// router middleware
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.use('*', (req, res, next) => {
  // const err = new Error(`cannot find ${req.originalUrl}. url on this server`);
  // err.statusCode = 404;
  // err.status = 'failed';

  next(new AppError(`cannot find ${req.originalUrl}. url on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
