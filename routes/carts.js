const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Get all carts
router.get("/", async (req, res) => {
  try {
    const carts = await Cart.find().populate("items.product");
    res.json(carts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one cart
router.get("/:id", getCart, (req, res) => {
  res.json(res.cart);
});

// Create a cart
router.post("/", async (req, res) => {
  const user = req.body.user;
  const items = req.body.items.map((item) => ({
    product: item.product,
    quantity: item.quantity,
  }));

  const cart = new Cart({
    user,
    items,
  });

  try {
    const newCart = await cart.save();
    res.status(201).json(newCart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a cart
router.patch("/:id", getCart, async (req, res) => {
  const updatedItems = req.body.items.map((item) => ({
    product: item.product,
    quantity: item.quantity,
  }));

  if (req.body.items != null) {
    res.cart.items = updatedItems;
  }

  try {
    const updatedCart = await res.cart.save();
    res.json(updatedCart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a cart
router.delete("/:id", getCart, async (req, res) => {
  try {
    await res.cart.deleteOne();
    res.json({ message: "Cart deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getCart(req, res, next) {
  let cart;

  try {
    cart = await Cart.findById(req.params.id).populate("items.product");
    if (cart == null) {
      return res.status(404).json({ message: "Cannot find cart" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.cart = cart;
  next();
}

module.exports = router;