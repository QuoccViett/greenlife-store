

const express = require('express')
const router = express.Router()
const { getCategories, createCategory, updateCategory, deleteCategory, getSubCategory } = require('../controllers/categoryController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

router.get('/', getCategories)
router.get('/:slug/sub', getSubCategory)
router.post('/', protect, adminOnly, createCategory)
router.put('/', protect, adminOnly, updateCategory)
router.delete('/', protect, adminOnly, deleteCategory)

module.exports = router