

const express = require('express')
const router = express.Router()
const { getUsers, updateUserRole, getAllOrders, updateOrderStatus, getDashboardStatus } = require('../controllers/adminController')
const { protect, adminOnly }  = require('../middleware/authMiddleware')

router.get('/status', protect, adminOnly, getDashboardStatus)
router.get('/users', protect, adminOnly, getUsers)
router.put('/users/:id', protect, adminOnly, updateUserRole)
router.get('/orders', protect, adminOnly, getAllOrders)
router.put('/orders/:id', protect, adminOnly, updateOrderStatus)

module.exports = router
