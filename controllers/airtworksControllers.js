//* My Modules

// Mongoose models
const Airtwork = require("../models/airtworkModel");

//* Airtworks Handlers

exports.getAllAirtworks = async (req, res) => {
  try {
    // Get all airtworks using Airtwork model
    const airtworks = await Airtwork.find();

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
    const newAirtwork = await Airtwork.create(req.body);

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
