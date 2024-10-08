//* 3rd-Party Modules

const mongoose = require("mongoose");
const slugify = require("slugify");

//* Schema & Model

const airtworkSchema = new mongoose.Schema({
  title: {
    type: String,
    require: [true, "An airtwork must have a name."],
    unique: true,
    trim: true,
    minLength: [1, "Airtwork title must be 1 or more characters in length."],
    maxLength: [
      99,
      "Airtwork title must be less than 100 characters in length.",
    ],
  },
  slug: String,
  price: {
    type: Number,
    required: [true, "An airtwork must have a price."],
    min: [0.01, "Price must be at least $0.01!"],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, "Rating must be 1 or more."],
    max: [5, "Rating must be 5 or less."],
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
    min: [0, "Ratings quantity must be 0 or more."],
  },
  summary: {
    type: String,
    trim: true,
    minLength: [10, "Summary must be at least 10 characters in length."],
    maxLength: [299, "Summary must be less than 300 characters in length."],
  },
  description: {
    type: String,
    trim: true,
    minLength: [50, "Summary must be at least 50 characters in length."],
    maxLength: [999, "Summary must be less than 1000 characters in length."],
  },
  imageCover: {
    type: String,
    required: [true, "An airtwork must have a cover image"],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    // Can set to false and won't be returned on request
    select: true,
  },
  forSale: {
    type: Boolean,
    default: true,
  },
});

//! DOCUMENT MIDDLEWARE: Runs before or after single document is validated,
//! saved/created, updated, deleted, or init'd!
// pre() runs before .save() and .create() commands
// NOTE 1: will not run before .insertMany() !
// NOTE 2: there is a post() as well as pre() method!
airtworkSchema.pre("save", function (next) {
  // "this" will point to the currently processed document
  this.slug = slugify(this.title, { lower: true });
  next();
});

//! QUERY MIDDLEWARE: Runs before or after a query is sent, e.g. to count,
//! deleteMany, updateMany, estimatedDocumentCount, etc.
// "find" is a type of hook: use regExp to cover all hooks that start with "find"
// NOTE: "this" now points at the current query, not a document.
airtworkSchema.pre(/^find/, function (next) {
  // Only return airtworks that are currently for sale!
  this.find({ forSale: { $ne: false } });
  // Store time of query (so can log time taken, see below)
  this.start = Date.now();
  next();
});

airtworkSchema.post(/^find/, function (docs, next) {
  // Log time taken to complete query
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

//! AGGREGATION MIDDLEWARE: Runs before or after an aggregation executed
// Use "aggregate" hook
airtworkSchema.pre("aggregate", function (next) {
  // "this" points to the current aggregation object
  this.pipeline().unshift({ $match: { forSale: { $ne: false } } });
  next();
});

// Create model from schema
const Airtwork = mongoose.model("Airtwork", airtworkSchema);

//* Exports

module.exports = Airtwork;
