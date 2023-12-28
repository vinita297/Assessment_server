const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const bcrypt = require("bcrypt");

router.post("/signup", (req, res) => {
  console.log("sent by clients-", req.body);

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).send({ error: "Please fill all the fields" });
  }

  User.findOne({ email: email }).then(async (savedUser) => {
    if (savedUser) {
      return res.status(422).send({ error: "User already exists" });
    }
    const user = new User({
      email,
      password,
    });
    try {
      await user.save();
      //   res.send({ message: "User saved successfully" });
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      res.send({ token });
    } catch (err) {
      console.log("db err", err);
      return res.status(422).send({ error: err.message });
    }
  });
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).send({ error: "Please fill all the fields" });
  }
  const savedUser = await User.findOne({ email: email });

  if (!savedUser) {
    return res.status(422).send({ error: "Invalid credentials" });
  }

  try {
    bcrypt.compare(password, savedUser.password, (err, result) => {
      if (result) {
        console.log("Password matched");
        const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET);
        res.send({ token });
      } else {
        console.log("Password does not match");
        return res.status(422).json({ error: "Invalid credentials" });
      }
    });
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
