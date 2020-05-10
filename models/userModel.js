const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    required: [true, 'user must have email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'user must have password'],
    // minLength: [8, 'name must be greater or equal to 8'],
  },
  passwordConfirm: {
    type: String,
    required: [true, 'user must have confirm password'],
    // minLength: [8, 'name must be greater or equal to 8'],
  },
});

userSchema.pre('save', async function (next) {
  console.log(this);
  // only run this function if password is actually modified
  if (!this.isModified('password')) return next();

  //   encrypt password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // delete passwordConfirm field
  this.passwordConfirm = undefined;

  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
