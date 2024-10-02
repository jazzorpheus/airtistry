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
  },
  slug: String,
  price: {
    type: Number,
    required: [true, "An airtwork must have a price."],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
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
  console.log("IN PRE MIDDLEWARE");
  // "this" will point to the currently processed document
  this.slug = slugify(this.title, { lower: true });
  console.log("SLUG CREATED");
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
  console.log(docs);
  // Log time taken to complete query
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

const Airtwork = mongoose.model("Airtwork", airtworkSchema);

//* Exports

module.exports = Airtwork;
