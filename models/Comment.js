const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);