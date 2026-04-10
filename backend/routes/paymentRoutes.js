

const express = require('express')
const router = express.Router()
const { createVNPayUrl, vnpayReturn } = require('../controllers/paymentController')
const { protect } = require('../middleware/authMiddleware')

router.post('/vnpay/create', protect, createVNPayUrl)
router.get('/vnpay/return', vnpayReturn)

module.exports = router