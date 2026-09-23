const express = require('express');
const router = express.Router();
const {
  getPurchaseOrders,
  getPurchaseOrderById,
  createPurchaseOrder
} = require('../controllers/purchaseController');

const { protect, admin, adminOnly } = require('../middleware/authMiddleware');
const requireAdmin = admin || adminOnly;

router.route('/')
  .get(protect, requireAdmin, getPurchaseOrders)
  .post(protect, requireAdmin, createPurchaseOrder);

router.route('/:id')
  .get(protect, requireAdmin, getPurchaseOrderById);

module.exports = router;