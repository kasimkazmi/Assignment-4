const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Product = require('../models/Product');
const User = require('../models/User');

// Get all comments
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate({
        path: 'user',
        select: 'username'
      })
      .populate({
        path: 'product',
        select: 'description'
      });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one comment
router.get('/:id', getComment, (req, res) => {
  res.json(res.comment);
});

// Create a comment
async function createComment(req, res) {
  const product = await Product.findById(req.body.product);
  const user = await User.findById(req.body.user);

  if (!product || !user) {
    return res.status(400).json({ message: 'Invalid product or user' });
  }

  const comment = new Comment({
    product: product,
    user: user,
    rating: req.body.rating,
    text: req.body.text
  });

  try {
    const newComment = await comment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
router.post('/', createComment);

// Update a comment
router.patch('/:id', getComment, async (req, res) => {
  if (req.body.product != null) {
    res.comment.product = req.body.product;
  }

  if (req.body.user != null) {
    res.comment.user = req.body.user;
  }

  if (req.body.rating != null) {
    res.comment.rating = req.body.rating;
  }

  if (req.body.text != null) {
    res.comment.text = req.body.text;
  }

  try {
    const updatedComment = await res.comment.save();
    res.json(updatedComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a comment
router.delete('/:id', getComment, async (req, res) => {
  try {
    await res.comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



async function getComment(req, res, next) {
  let comment;

  try {
    comment = await Comment.findById(req.params.id)
      .populate({
        path: 'user',
        select: 'username'
      })
      .populate({
        path: 'product',
        select: 'description'
      });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.comment = comment;
  next();
}

module.exports = router;