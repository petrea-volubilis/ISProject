const express = require("express");

const router = express.Router();

const cartController = require("../controllers/cart");

router.get("/cart", cartController.getCart);

router.post("/cart", cartController.postCart);

router.post("/edit-quantity", cartController.postQuantity);

router.get("/cart/:IPID/:customer_id", cartController.getDeleteItem);

module.exports = router;
