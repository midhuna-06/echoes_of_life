const express = require("express");
const mongoose = require("mongoose");
const Memory = require("./models/Memory");
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