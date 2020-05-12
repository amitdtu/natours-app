const AppError = require('../utils/appError');

// status 400 -> bad request
const handleCastErrDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFiledErrDB = (err) => {
  const value = err.errmsg.match(/"(.*?)"/)[0];
  const message = `Duplicate filed value: ${value}. Use another value`;
  return new AppError(message, 400);
};

const handleMongooseValidationErr = (err) => {
  const message = err.message.replace('Tour validation failed:', '');
  return new AppError(message, 400);
};

const handleInvalidToken = () =>
  new AppError('Invalid token. Please login again', 401);

const handleTokenExpire = () =>
  new AppError('Your token is expired. please login again.', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    err: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // operational error: send message to clients
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // programming error
  } else {
    console.log('ERROR is ', err);
    res.status(500).json({ status: 'error', message: 'something went wrong' });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') sendErrorDev(err, res);
  else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrDB(error);
    if (error.code === 11000) error = handleDuplicateFiledErrDB(error);
    if (error.name === 'ValidationError')
      error = handleMongooseValidationErr(error);
    if (error.name === 'JsonWebTokenError') error = handleInvalidToken();
    if (error.name === 'TokenExpiredError') error = handleTokenExpire();

    sendErrorProd(error, res);
  }
};
