const express = require("express");

const router = express.Router();

const isAuth = require("../middleware/is-auth");
const plantController = require("../controllers/plant");

router.get("/add-plant", isAuth, plantController.getAddPlant);

router.post("/add-plant", isAuth, plantController.postAddPlant);

router.get("/add-inventory", isAuth, plantController.getAddInventory);

router.post("/add-inventory", isAuth, plantController.postAddInventory);

router.get("/inventory", isAuth, plantController.getInventory);

router.post("/filterByCategory", plantController.postfilterByCatgory);

router.get("/manage-plant", plantController.getManagePlant);

router.post("/manage-plant", plantController.getEditPlant);

router.post("/edit-plant", isAuth, plantController.postEditPlant);

router.get("/edit-plant", isAuth, plantController.getEditPlant);

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

router.get("/todo", plantController.getTodo);

router.post("/todo", plantController.postTodo);

router.get("/delete-todo/:_id", plantController.deleteTodo);

router.get("/blog", plantController.getBlog);

router.get("/posts/:id", plantController.getPost);

router.get("/add-post", plantController.getAddPost);

router.post("/add-post", plantController.postAddPost);

// router.delete("/post/:id", plantController.deletePost);
router.get("/delete-post/:id", plantController.removePost);

router.get("/delete-plant", plantController.getDeleteInventory);

router.post("/delete-plant", plantController.postDeleteInventory);

router.post("/blog/:id/comment", plantController.postComment);

router.get("/delete-comment/:id/:post", plantController.deleteComment);

router.get("/edit-post/:id", plantController.getUpdatePost);

router.post("/edit-post", plantController.updatePost);

router.post("/filterByCategory", plantController.filterByCategory);

module.exports = router;
