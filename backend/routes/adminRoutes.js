const express = require('express')
const router = express.Router()
const {
  getUsers, updateUserRole, getAllOrders, updateOrderStatus,
  getDashboardStats, toggleUserStatus, resetUserPassword, getAdvancedStats
} = require('../controllers/adminController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

router.get('/stats', protect, adminOnly, getDashboardStats)
router.get('/stats/advanced', protect, adminOnly, getAdvancedStats)
router.get('/users', protect, adminOnly, getUsers)
router.put('/users/:id/role', protect, adminOnly, updateUserRole)
router.put('/users/:id/toggle', protect, adminOnly, toggleUserStatus)
router.put('/users/:id/reset-password', protect, adminOnly, resetUserPassword)
router.get('/orders', protect, adminOnly, getAllOrders)
router.put('/orders/:id', protect, adminOnly, updateOrderStatus)

module.exports = router