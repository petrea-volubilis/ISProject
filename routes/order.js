const express = require("express");

const router = express.Router();

const orderController = require("../controllers/order");

router.get("/order", orderController.getOrders);

router.get("/order/:orderNo", orderController.getInvoice);

router.post("/order", orderController.postOrder);

module.exports = router;
