const express = require("express");
const mongoose = require("mongoose");
const Memory = require("./models/Memory");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

require("dotenv").config();

const app = express();
app.use(express.json());

/* 🔐 AUTH MIDDLEWARE (TOP LEVEL) */
const auth = (req, res, next) => {
  try {
    const token = req.headers["authorization"];

    if (!token) {
      return res.status(401).json({ msg: "No token" });
    }

    const verified = jwt.verify(token, "secretkey");
    req.user = verified;

    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

/* 🔗 MongoDB Connection */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

/* 🧪 Test Route */
app.get("/", (req, res) => {
  res.send("Backend + MongoDB working");
});


//post api

app.post("/add-memory", auth , async (req, res) => {
  try {
    const newMemory = new Memory(req.body);
    const savedMemory = await newMemory.save();
    res.json(savedMemory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* 📝 REGISTER API */
app.post("/register", async (req, res) => {
  try {
    const { name, dob, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ msg: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      dob,
      email,
      password: hashedPassword
    });

    await user.save();

    app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // generate token
    const token = jwt.sign(
      { id: user._id },
      "secretkey",
      { expiresIn: "1d" }
    );

    res.json({ token });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

  const auth = (req, res, next) => {
  try {
    const token = req.headers["authorization"];

    if (!token) {
      return res.status(401).json({ msg: "No token" });
    }

    const verified = jwt.verify(token, "secretkey");
    req.user = verified;

    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

    // create token
    const token = jwt.sign({ id: user._id }, "secretkey", { expiresIn: "1d" });

    res.json({ token });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* 🔑 LOGIN API */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      "secretkey",
      { expiresIn: "1d" }
    );

    res.json({ token });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* 🧠 ADD MEMORY (PROTECTED) */
app.post("/add-memory", auth, async (req, res) => {
  try {
    const newMemory = new Memory({
      ...req.body,
      userId: req.user.id   // connect memory to user
    });

    const savedMemory = await newMemory.save();
    res.json(savedMemory);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* 🚀 SERVER START */
app.listen(5000, () => {
  console.log("Server running on port 5000");
});