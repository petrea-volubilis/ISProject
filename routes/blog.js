const express = require("express");

const router = express.Router();

const blogController = require("../controllers/blog");

// example of using routes
// router.get("/articles", blogController.getAddArticle);

module.exports = router;
