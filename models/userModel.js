const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'user must have name'],
    trim: true,
    // minLength: [8, 'name must be greater or equal to 8'],
    // maxLength: [20, 'name must be greater or equal to 20'],
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'please provide a valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'user must have password'],
    minLength: [8, 'name must be greater or equal to 8'],
  },
  passwordConfirm: {
    type: String,
    required: [true, 'user must have password'],
    // minLength: [8, 'name must be greater or equal to 8'],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
