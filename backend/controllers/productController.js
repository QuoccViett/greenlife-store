const Category = require('../models/Category')
const Product = require('../models/Product')

const getProducts = async (req, res) => {
    console.log('Query params:', req.query);
    try {
        const { category, search, featured, sub } = req.query

        let filter = {}
        if (featured) filter.isFeatured = true
        if (search) filter.name = { $regex: search, $options: 'i' }
        if (category) {
            const cat = await Category.findOne({ slug: category })
            if (cat) filter.category = cat._id
        }
        if (sub) {
            const subCat = await Category.findOne({ slug: sub })
            if (subCat) filter.sub = subCat._id
        }

        const products = await Product.find(filter)
            .populate('category', 'name slug')
            .populate('sub', 'name slug')
        res.json(products)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name slug')
        if (!product) return res.status(404).json({ message: 'Khong tim thay san pham' })
        res.json(product)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body)
        res.status(201).json(product)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!product) return res.status(404).json({ message: 'Khong tim thay san pham' })
        res.json(product)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id, req.body, { new: true })
        if (!product) return res.status(404).json({ message: 'Khong tim thay san pham' })
        res.json({ message: 'Da xoa san pham thanh cong' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct }