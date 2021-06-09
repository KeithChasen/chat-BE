const { model, Schema } = require('mongoose');

const messageSchema = new Schema({
  content: String,
  from: String,
  to: String,
  createdAt: String
});

module.exports = model('Message', messageSchema);
