const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${process.env.MONGODB_URI}`);
});

app.use(express.json());

// Routes go here

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});