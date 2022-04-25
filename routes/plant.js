const express = require("express");

const router = express.Router();

const isAuth = require("../middleware/is-auth");
const plantController = require("../controllers/plant");

router.get("/add-plant", isAuth, plantController.getAddPlant);

router.post("/add-plant", isAuth, plantController.postAddPlant);

router.get("/add-inventory", isAuth, plantController.getAddInventory);

router.post("/add-inventory", isAuth, plantController.postAddInventory);

router.get("/", plantController.getPlants);
router.get("/plants", plantController.getPlants);

router.get("/plant-detail/:plantId", plantController.details);

module.exports = router;
