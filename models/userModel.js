const crypto = require('crypto');
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
  photo: {
    type: 'String',
    default: 'default.jpg',
  },
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
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not equal',
    },
  },
  passwordChangedAt: Date,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
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

// change passwordChangedAt time if password is changed
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  // console.log('change date of passwordChangedAt');
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
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
    // console.log(changedPassword, jwtTimestamp);
    // console.log(changedPassword > jwtTimestamp);

    return changedPassword > jwtTimestamp;
  }

  // false means password not changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  // console.log({ resetToken }, this.passwordResetToken);
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
