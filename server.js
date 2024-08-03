//* 3rd-Party Modules

// Enables access to config.env to set ENV variables
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

// Mongoose ODM (Object Data Modeling) Library for MongoDB
const mongoose = require("mongoose");

//* My Modules

const app = require("./app");

//* Database Connect

const DB = process.env.DB.replace("<PASSWORD>", process.env.DB_PASS);
mongoose
  .connect(DB)
  .then(() => console.log("MongoDB connection successful!"))
  .catch((err) => console.error(err));

//* Server Connect

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
