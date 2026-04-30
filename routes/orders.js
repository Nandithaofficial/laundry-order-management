const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/orderController");

router.post("/", ctrl.createOrder);
router.get("/", ctrl.getOrders);
router.get("/dashboard", ctrl.getDashboard);
router.get("/:orderId", ctrl.getOrderById);
router.patch("/:orderId/status", ctrl.updateStatus);
router.delete("/:orderId", ctrl.deleteOrder);

module.exports = router;