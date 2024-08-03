//* 3rd-Party Modules

const express = require("express");

//* My Modules

const {
  getAllAirtworks,
  getAirtwork,
  createAirtwork,
  updateAirtwork,
  deleteAirtwork,
} = require("../controllers/airtworksControllers");

//* Top-Level Code

// express.Router class creates modular, mountable route handlers. A Router instance
// is a complete middleware and routing system; hence often referred to as a “mini-app”.
const router = express.Router();

//* Airtworks Routes

// GET: Get summary of all airtworks
// POST: Add new airtwork
router.route("/").get(getAllAirtworks).post(createAirtwork);

// GET: Get single airtwork
// PATCH: Update airtwork
// DELETE: Delete airtwork
router
  .route("/:id")
  .get(getAirtwork)
  .patch(updateAirtwork)
  .delete(deleteAirtwork);

//* Exports

module.exports = router;
