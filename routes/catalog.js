const express = require("express");

const router = express.Router();

const catalogController = require("../controllers/catalog");

// example of using routes
// router.get("/plants", catalogController.getPlants);

module.exports = router;
