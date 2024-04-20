const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const verifyToken = require("../middleware/verifyToken");
const jwtSecret = config.get('jwtSecret');
const User = require("../models/User");

// @route    POST api/auth/register
// @desc     Register user
// @access   Public
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post(
  "/register",
  [
        check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
    check("username", "Username is required").notEmpty(),
    check("confirmPassword", "Confirrm password is required").notEmpty(),
  ],
  upload.single('profilePicture'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      email,
      password,
      username,
      confirmPassword
     
    } = req.body;

    let profilePicture = "";
    if (req.file) {
      profilePicture = req.file.path;
    }

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }
      user = await User.findOne({ username });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Username already exists" }] });
      }

      user = new User({
        email,
        password,
        confirmPassword,
        username,
        profilePicture
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route    POST api/auth/login
// @desc     Authenticate user & get token
// @access   Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign({ user: user._id }, config.get("jwtSecret"), {
      expiresIn: 3600,
    });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
// @route    GET api/auth/user/:id
// @desc     Get user by ID
// @access   Private
router.get("/user/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      returnres.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


module.exports = router;