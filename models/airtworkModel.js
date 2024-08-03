//* 3rd-Party Modules

const mongoose = require("mongoose");

//* Schema & Model

const airtworkSchema = new mongoose.Schema({
  title: {
    type: String,
    require: [true, "An airtwork must have a name."],
    unique: true,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "An airtwork must have a price."],
  },
  summary: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, "An airtwork must have a cover image"],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Airtwork = mongoose.model("Airtwork", airtworkSchema);

//* Exports

module.exports = Airtwork;
