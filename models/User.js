'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Schema
const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      index: true,
      unique: true,
    },
    pass: {
      type: String,
    },
  },
  {
    collection: 'users',
  },
);

userSchema.statics.hashPass = function (passNotEncrypted) {
  return bcrypt.hash(passNotEncrypted, 5);
};

userSchema.methods.isCorrectPass = function (plainPass) {
  return bcrypt.compare(plainPass, this.pass);
};

// Model
const User = mongoose.model('User', userSchema);

// Export model
module.exports = User;
