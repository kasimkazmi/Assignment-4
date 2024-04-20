const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: { type: String, },
  lastName: { type: String, },
  email: { type: String, required: true, unique: true, match: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/ },
  password: { type: String, required: true, minlength: 8 },
  permissionLevel: { type: Number,  min: 0, max: 2 },
  username: { type: String, required: true, unique: true },
  purchaseHistory: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
  shippingAddress: {
    street: { type: String, },
    city: { type: String,  },
    state: { type: String,  },
    zip: { type: String, }
  },
  profilePicture: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model('User', userSchema);