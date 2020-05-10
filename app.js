const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

// app.use((req, res, next) => {
//   console.log('Here is a middleware');
//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.use('*', (req, res, next) => {
  // const err = new Error(`cannot find ${req.originalUrl}. url on this server`);
  // err.statusCode = 404;
  // err.status = 'failed';

  next(new AppError(`cannot find ${req.originalUrl}. url on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
