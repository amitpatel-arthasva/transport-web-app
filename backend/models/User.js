const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
  phonenumber: {
    type: String,
    required: true,
    unique: true,
    sparse: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  }
}, {
  timestamps: true,
});

const User = mongoose.model('user', userSchema);
module.exports = User;