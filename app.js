const path = require("path");

const express = require("express");

const app = express();

const multer = require("multer");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

const catalogRoutes = require("./routes/catalog");
const blogRoutes = require("./routes/blog");
const MMRoutes = require("./routes/mm");

app.use(catalogRoutes);

app.use(blogRoutes);

app.use(MMRoutes);

app.listen(3000);
