const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one order
router.get('/:id', getOrder, (req, res) => {
  res.json(res.order);
});

// Create an order
router.post('/', async (req, res) => {
  const order = new Order({
    products: req.body.products,
    quantities: req.body.quantities,
    user: req.body.user,
  });

  try {
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an order
router.patch('/:id', getOrder, async (req, res) => {
  if (req.body.products != null) {
    res.order.products = req.body.products;
  }

  if (req.body.quantities != null) {
    res.order.quantities = req.body.quantities;
  }

  if (req.body.user != null) {
    res.order.user = req.body.user;
  }

  try {
    const updatedOrder = await res.order.save();
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an order
router.delete('/:id', getOrder, async (req, res) => {
  try {
    await res.order.remove();
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getOrder(req, res, next) {
  let order;

  try {
    order = await Order.findById(req.params.id);
    if (order == null) {
      return res.status(404).json({ message: 'Cannot find order' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.order = order;
  next();
}

module.exports = router;