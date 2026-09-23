const express = require("express");
const router = express.Router();

router.use("/auth", require("./authRoutes"));
router.use("/products", require("./productRoutes"));
router.use("/categories", require("./categoryRoutes"));
router.use("/orders", require("./orderRoutes"));
router.use("/cart", require("./cartRoutes"));
router.use("/admin", require("./adminRoutes"));
router.use("/payment", require("./paymentRoutes"));
router.use('/api/suppliers', require('./routes/supplierRoutes'));
router.use('/api/purchases', require('./routes/purchaseRoutes'));
module.exports = router;
