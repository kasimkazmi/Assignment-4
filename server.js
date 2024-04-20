const express = require("express");
const bodyParser = require("body-parser");
const url =
  "mongodb+srv://kumar1232r:kumar1232r@cluster0.9gqdvqt.mongodb.net/assignment_4?retryWrites=true&w=majority";
  const mongoose = require("mongoose");
const app = express();
app.use(bodyParser.json());
const router = express.Router();
const port = process.env.PORT || 3000;
const cors = require("cors");

const products = require("./routes/products");
const users = require("./routes/users");
const comments = require("./routes/comments");
const carts = require("./routes/carts");
const orders = require("./routes/orders");
const authRoutes = require("./routes/authRoutes");

app.use(cors());
mongoose
  .connect(url)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

router.use("/products", products);
router.use("/orders", orders);
router.use("/comments", comments);
router.use("/carts", carts);
router.use("/users", users);
app.use("/api/auth", authRoutes);

app.use("/api", router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});