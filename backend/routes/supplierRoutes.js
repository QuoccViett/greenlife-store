const express = require('express');
const router = express.Router();
const {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
} = require('../controllers/supplierController');

// Lấy đúng middleware bảo vệ tài khoản admin
const { protect, admin, adminOnly } = require('../middleware/authMiddleware');

// Kiểm tra xem dự án của bạn dùng 'admin' hay 'adminOnly'
const requireAdmin = admin || adminOnly;

router.route('/')
  .get(protect, requireAdmin, getSuppliers)
  .post(protect, requireAdmin, createSupplier);

router.route('/:id')
  .get(protect, requireAdmin, getSupplierById)
  .put(protect, requireAdmin, updateSupplier)
  .delete(protect, requireAdmin, deleteSupplier);

module.exports = router;