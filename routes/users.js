const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one user
router.get('/:id', getUser, (req, res) => {
  res.json(res.user);
});

// Create a new user
router.post('/users', async (req, res) => {
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    permissionLevel: req.body.permissionLevel,
    username: req.body.username,
    shippingAddress: req.body.shippingAddress
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Create an order
router.post('/orders', async (req, res) => {
  const order = new Order({
    user: req.body.user,
    products: req.body.products,
    totalPrice: req.body.totalPrice,
    status: 'pending'
  });

  try {
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// Update a user
router.patch('/:id', getUser, async (req, res) => {
  if (req.body.firstName != null) {
    res.user.firstName = req.body.firstName;
  }

  if (req.body.lastName != null) {
    res.user.lastName = req.body.lastName;
  }

  if (req.body.email != null) {
    res.user.email = req.body.email;
  }

  if (req.body.password != null) {
    res.user.password = req.body.password;
  }

  if (req.body.username != null) {
    res.user.username = req.body.username;
  }

  if (req.body.purchaseHistory != null) {
    res.user.purchaseHistory = req.body.purchaseHistory;
  }

  if (req.body.shippingAddress != null) {
    res.user.shippingAddress = req.body.shippingAddress;
  }

  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a user
router.delete('/:id', getUser, async (req, res) => {
  try {
    await User.deleteOne({ _id: req.params.id });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


async function getUser(req, res, next) {
  let user;

  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: 'Cannot find user' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.user = user;
  next();
}

module.exports = router;