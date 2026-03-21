const express = require("express");
const mongoose = require("mongoose");
const Memory = require("./models/Memory");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

require("dotenv").config();

const app = express();


app.use(express.json());

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// test route
app.get("/", (req, res) => {
  res.send("Backend + MongoDB working");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

//post api

app.post("/add-memory", async (req, res) => {
  try {
    const newMemory = new Memory(req.body);
    const savedMemory = await newMemory.save();
    res.json(savedMemory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/register", async (req, res) => {
  try {
    const { name, dob, email, password, confirmPassword } = req.body;

    // check password match
    if (password !== confirmPassword) {
      return res.status(400).json({ msg: "Passwords do not match" });
    }

    // check user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // save user
    const user = new User({
      name,
      dob,
      email,
      password: hashedPassword
    });

    await user.save();

    // create token
    const token = jwt.sign({ id: user._id }, "secretkey");

    res.json({ token });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});