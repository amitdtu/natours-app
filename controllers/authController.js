const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    // domain: 'http://localhost:3000',
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // remove password from user output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  // const newUser = await User.create(req.body);
  const { name, email, password, passwordConfirm, role } = req.body;

  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    role,
  });

  const url = `http://localhost:3000/me`;
  await new Email(newUser, url).sendWelcome();

  createSendToken(newUser, 201, res);
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
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) getting token check if it is there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token)
    return next(
      new AppError('You have no logged in. Please login to get access.', 401)
    );

  // 2) verify token
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

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

  // store user in req for future use
  req.user = currentUser;

  next();
});

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  // 1) getting token check if it is there
  if (req.cookies.jwt) {
    const token = req.cookies.jwt;

    // 2) verify token
    const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) check if user is exists
    const currentUser = await User.findById(decode.id);
    if (!currentUser) return next();

    // 4) check if user has changed password after token was issued
    if (currentUser.changePasswordAfter(decode.iat)) {
      return next();
    }

    // there is a loggedIn user

    return res.status(200).json({
      status: 'success',
      user: currentUser,
    });
  }
  return next(new AppError('User is not loggedIn', 400));
});

exports.logout = (req, res, next) => {
  res.cookie('jwt', 'loggedOut', {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    status: 'success',
  });
};

exports.restrictedTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You are not allowed to perform this action.', 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) check if user is exists with the given email
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError('there is no user with this email', 404));

  // 2) create random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) send it to user's email
  const resetURL = `http://localhost:3000/resetPassword/${resetToken}`;

  await new Email(user, resetURL).sendResetPassword();

  // const message = `Forgot your password? Click the given link
  // to reset your password. ${resetURL}. If you didn't forgot. Ignore this message`;

  try {
    // await sendEmail({
    //   email: user.email,
    //   subject: 'Your password reset token (valid for 10 mins)',
    //   message,
    // });
    res.status(200).json({
      status: 'success',
      message: 'Eamil has been sent.',
      data: {
        resetToken,
      },
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        'There was an error sending the email. Please try again later.',
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) get user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // 2) If token has not expired and there is a user, set the new password
  if (!user) return next(new AppError('Token is invalid or expired', 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) update changedPasswordAt property of user (works in userModel instance)
  // 4) Log the user in and send JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword, newPasswordConfirm } = req.body;
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) check if posted current password is correct
  if (!(await user.correctPassword(currentPassword, user.password)))
    return next(new AppError('Current password is incorrect.'));

  // 3) if so, update password
  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;
  await user.save();

  // 4) login the user, send jwt
  createSendToken(user, 200, res);
});
