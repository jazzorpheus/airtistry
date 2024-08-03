//* 3rd-Party Modules

const express = require("express");
const morgan = require("morgan");

//* My Modules

const airtworksRouter = require("./routes/airtworksRoutes");

//* Top-Level Code

const app = express();

// Morgan config
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Parses incoming requests with JSON payloads and is based on body-parser.
// A new body object containing the parsed data is populated on the request object after the
// middleware (i.e. req.body), or an empty object ({}) if there was no body to parse, the
// Content-Type is not matched, or an error occurs.
app.use(express.json());

// *** Routes ***

// Index route
app.get("/", (req, res) => {
  res.send("Welcome to AIrtistry Bazaar!");
});

//* Airtworks Routes

app.use("/api/v1/airtworks", airtworksRouter);

module.exports = app;
