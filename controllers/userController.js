const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.json({
    result: users.length,
    status: 'success',
    data: {
      users,
    },
  });
  // res.status(500).json({
  //   status: 'error',
  //   message: 'route not define yet',
  // });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route not define yet',
  });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route not define yet',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route not define yet',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route not define yet',
  });
};
