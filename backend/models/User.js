const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  age: { type: Number },
  isAdmin: { type: Boolean },
});

module.exports = mongoose.model('User', userSchema);
