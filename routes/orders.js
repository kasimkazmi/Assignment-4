// Import the required modules
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

// Get all orders
router.get("/", async (req, res) => {
  try {
    // Find all orders and populate the user field
    const orders = await Order.find().populate("user");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one order
router.get("/:id", getOrder, (req, res) => {
  res.json(res.order);
});

// Create an order
router.post("/", async (req, res) => {
  const userId = req.body.user; // Get the user ID from the request body
  const user = await User.findById(userId); // Find the user by ID

  if (!user) {
    return res.status(404).json({ message: "User not found" }); // Return 404 if user not found
  }

  const items = req.body.items.map((item) => ({ // Map the items array to the required format
    product: item.product,
    quantity: item.quantity,
    price: item.price, // Make sure the price field is provided
  }));

  const total = items.reduce((acc, item) => acc + item.quantity * item.price, 0); // Calculate the total price

  const order = new Order({
    user: user._id, // Set the user ID
    items: items, // Set the items array
    total: total, // Set the total price
  });

  try {
    const newOrder = await order.save(); // Save the new order
    res.status(201).json(newOrder); // Return the new order with 201 status code
  } catch (err) {
    res.status(400).json({ message: err.message }); // Return 400 with error message
  }
});

// Update an order
router.patch("/:id", getOrder, async (req, res) => {
  if (req.body.status != null) { // Update the status field only
    res.order.status = req.body.status;
  }

  try {
    const updatedOrder = await res.order.save(); // Save the updated order
    res.json(updatedOrder); // Return the updated order
  } catch (err) {
    res.status(400).json({ message: err.message }); // Return 400 with error message
  }
});

// Delete an order
router.delete("/:id", getOrder, async (req, res) => {
  try {
    await res.order.deleteOne(); // Delete the order
    res.json({ message: "Order deleted" }); // Return success message
  } catch (err) {
    res.status(500).json({ message: err.message }); // Return 500 with error message
  }
});

async function getOrder(req, res, next) {
  let order;

  try {
    // Find the order by ID and populate the user and items.product fields
    order = await Order.findById(req.params.id).populate({
      path: "user",
      model: "User",
    }).populate({
      path: "items.product",
      model: "Product",
    });
    if (order == null) {
      return res.status(404).json({ message: "Cannot find order" }); // Return 404 if order not found
    }
  } catch (err) {
    return res.status(500).json({ message: err.message }); // Return 500 with error message
  }

  res.order = order; // Set the order object in the response object
  next(); // Call the next middleware function
}

module.exports = router;