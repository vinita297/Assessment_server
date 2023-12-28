const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");

require("dotenv").config();

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

module.exports = router;
