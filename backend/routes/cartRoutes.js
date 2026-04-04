const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const addToCartController = require("../controllers/addToCartController");
const countAddToCartProduct = require("../controllers/countAddToCartProduct");
const addToCartViewProduct = require("../controllers/addToCartViewProduct");
const updateAddToCartProduct = require("../controllers/updateAddToCartProduct");
const deleteAddToCartProduct = require("../controllers/deleteAddToCartProduct");

router.post("/addtocart", protect, addToCartController);
router.get("/count", protect, countAddToCartProduct);
router.get("/view", protect, addToCartViewProduct);
router.post("/update", protect, updateAddToCartProduct);
router.post("/delete", protect, deleteAddToCartProduct);

module.exports = router;
