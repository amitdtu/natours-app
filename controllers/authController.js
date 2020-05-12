const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = catchAsync(async (req, res, next) => {
  // const newUser = await User.create(req.body);
  const {
    name,
    email,
    password,
    passwordConfirm,
    passwordChangedAt,
  } = req.body;
  const newUser = await User.create({
    name: name,
    email: email,
    password: password,
    passwordConfirm: passwordConfirm,
    passwordChangedAt: passwordChangedAt,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  // 1) check if email and password exists
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError('Please provide email and password', 401));

  // 2) check if user exists and password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(
      new AppError(
        'Your email or password is incorrect. Please try again.',
        401
      )
    );
  }

  // 3) if everything is ok then send token to client

  const token = signToken(user._id);
  res.status(201).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) getting token check if it is there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token)
    return next(
      new AppError('You have no logged in. Please login to get access.', 401)
    );

  // 2) verify token
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decode);

  // 3) check if user is exists
  const currentUser = await User.findById(decode.id);
  if (!currentUser)
    return next(
      new AppError('The user belongs to this token has no longer exists', 401)
    );

  // 4) check if user has changed password after token was issued
  if (currentUser.changePasswordAfter(decode.iat)) {
    return next(
      new AppError('User has changed the password. Please login again')
    );
  }

  next();
});
