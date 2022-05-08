const express = require("express");

const router = express.Router();

const cartController = require("../controllers/cart");
const isAuth = require("../middleware/is-auth");

router.get("/cart", isAuth, cartController.getCart);

router.post("/cart", cartController.postCart);

router.post("/edit-quantity", cartController.postQuantity);

router.get("/cart/:IPID/:user_id", cartController.getDeleteItem);

module.exports = router;
