const express = require("express");

const router = express.Router();

const isAuth = require("../middleware/is-auth");
const plantController = require("../controllers/plant");

router.get("/add-plant", isAuth, plantController.getAddPlant);

router.post("/add-plant", isAuth, plantController.postAddPlant);

router.get("/add-inventory", isAuth, plantController.getAddInventory);

router.post("/add-inventory", isAuth, plantController.postAddInventory);

router.get("/manage-plant", plantController.getManagePlant);

router.post("/manage-plant", plantController.getEditPlant);

router.post("/edit-plant", isAuth, plantController.postEditPlant);

// router.get("/edit-plant", isAuth, plantController.getEditPlant);

router.get("/manage", plantController.getManage);

router.get(
  "/edit-inventory/:plantId",
  isAuth,
  plantController.getEditInventory
);

router.post("/edit-inventory", isAuth, plantController.postEditInventory);

router.get("/", plantController.home);
router.get("/plants", plantController.getPlants);

router.get("/plant-detail/:plantId", plantController.details);

module.exports = router;
