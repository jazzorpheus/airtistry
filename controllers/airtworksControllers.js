//* My Modules

// Mongoose models
const Airtwork = require("../models/airtworkModel");

// Utilities
const buildQuery = require("../utils/buildQuery");

//* Airtworks Handlers

exports.getAllAirtworks = async (req, res) => {
  try {
    //! Build Query
    const builtQuery = new buildQuery(Airtwork.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    //! Execute Query
    // Get airtworks based on query incl. filtering, sorting, limiting
    const airtworks = await builtQuery.query;

    //! Send Response
    res.status(200).json({
      status: "success",
      results: airtworks.length,
      data: {
        airtworks,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getAirtwork = async (req, res) => {
  try {
    // [Works the same way as Airtwork.findOne({_id: req.params.id})]
    const airtwork = await Airtwork.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        airtwork,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createAirtwork = async (req, res) => {
  try {
    console.log("IN CREATE AIRTWORK");
    const newAirtwork = await Airtwork.create(req.body);
    console.log("AIRTWORK CREATED");

    // 200 - "Okay", 201 - "Created"
    res.status(201).json({
      status: "success",
      data: {
        newAirtwork,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateAirtwork = async (req, res) => {
  // Update airtwork based on id
  try {
    const updatedAirtwork = await Airtwork.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        // Ensures updated doc is sent back, rather than original (default is false)
        new: true,
        // Makes sure updated doc is run against schema validators
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: {
        updatedAirtwork,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "Invalid data sent!",
    });
  }
};

exports.deleteAirtwork = async (req, res) => {
  try {
    const deletedAirtwork = await Airtwork.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "success",
      deletedAirtwork,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

// The "Aggregation Pipeline" is a MongoDB feature that is used to process documents
// Each stage performs an operation on the input docs, e.g. filter, group, calculate.
// The docs output from one stage are passed as input to the next stage.
exports.getAirtworkStats = async (req, res) => {
  try {
    // In Mongoose, the aggregation pipeline syntax is similar to using a regular query.
    // Pass in an array of different "stages" to the aggregate() method.
    const stats = await Airtwork.aggregate([
      {
        // Only aggregate those with ratingsAverage >= 4.5
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          // Group by ratingsAverage
          _id: "$ratingsAverage",
          // For each doc that goes through pipeline, add 1 to numAirtworks
          numAirtworks: { $sum: 1 },
          // Find total quantity of ratings across group
          numRatings: { $sum: "$ratingsQuantity" },
          // Find avg rating within group (same as group type)
          avgRating: { $avg: "$ratingsAverage" },
          // Find avg price
          avgPrice: { $avg: "$price" },
          // Find min price
          minPrice: { $min: "$price" },
          // Find max price
          maxPrice: { $max: "$price" },
        },
      },
      {
        // Sort by avgRating descending
        $sort: { avgRating: -1 },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
