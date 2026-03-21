const mongoose = require("mongoose");

const memorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    poem: {
      type: String,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Memory", memorySchema);