//***************************************************************************
//* A basic script to import the airtworks-simple data into MongoDB database
//***************************************************************************

//* Core Modules

const fs = require("fs");

//* 3rd-Party Modules

const dotenv = require("dotenv");
const mongoose = require("mongoose");

//* My Modules

// Mongoose models
const Airtwork = require("../../models/airtworkModel");

//* Top-Level Code

dotenv.config({ path: "./config.env" });

//* Database

const DB = process.env.DB.replace("<PASSWORD>", process.env.DB_PASS);
mongoose.connect(DB).then(() => console.log("MongoDB connection successful!"));

// *********************** Import/Delete ************************

// READ JSON FILE
const airtworks = JSON.parse(
  fs.readFileSync(`${__dirname}/airtworks-simple.json`, "utf-8")
);

// IMPORT DATA INTO DATABASE
const importData = async () => {
  try {
    await Airtwork.create(airtworks);
    console.log("Data successfully loaded!");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// DELETE ALL CURRENT DATA FROM AIRTWORKS COLLECTION
const deleteData = async () => {
  try {
    await Airtwork.deleteMany();
    console.log("Data successfully deleted!");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

console.log(process.argv);
