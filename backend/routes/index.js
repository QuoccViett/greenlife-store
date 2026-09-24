const express = require("express");
const router = express.Router();

router.use("/auth", require("./authRoutes"));
router.use("/products", require("./productRoutes"));
router.use("/categories", require("./categoryRoutes"));
router.use("/orders", require("./orderRoutes"));
router.use("/cart", require("./cartRoutes"));
router.use("/admin", require("./adminRoutes"));
router.use("/payment", require("./paymentRoutes"));
router.use("/suppliers", require("./supplierRoutes"));
router.use("/purchases", require("./purchaseRoutes"));

module.exports = router;
