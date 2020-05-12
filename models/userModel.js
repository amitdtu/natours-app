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
    select: false,
    // minLength: [8, 'name must be greater or equal to 8'],
  },
  passwordConfirm: {
    type: String,
    required: [true, 'user must have confirm password'],
    // minLength: [8, 'name must be greater or equal to 8'],
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  // only run this function if password is actually modified
  if (!this.isModified('password')) return next();

  //   encrypt password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // delete passwordConfirm field
  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  password
) {
  return await bcrypt.compare(candidatePassword, password);
};

userSchema.methods.changePasswordAfter = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedPassword = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(changedPassword, jwtTimestamp);

    return changedPassword > jwtTimestamp;
  }

  // false means password not changed
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
