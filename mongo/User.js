const { model, Schema } = require('mongoose');

const userSchema = new Schema({
  email: String,
  password: String,
  image: String
});

module.exports = model('User', userSchema);
