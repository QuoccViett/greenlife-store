const express = require('express')
const router = express.Router()
const { createPurchase, getPurchases, getPurchaseById } = require('../controllers/purchaseController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

router.use(protect, adminOnly)
router.get('/', getPurchases)
router.get('/:id', getPurchaseById)
router.post('/', createPurchase)

module.exports = router
