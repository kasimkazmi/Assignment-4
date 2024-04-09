const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, match: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/ },
  password: { type: String, required: true, minlength: 8 },
  permissionLevel: { type: Number, required: true, min: 0, max: 2 },
  username: { type: String, required: true, unique: true },
  purchaseHistory: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true }
  }
});

module.exports = mongoose.model('User', userSchema);