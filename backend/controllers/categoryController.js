

const Category = require('../models/Category')

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find()
        res.json(categories)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const getSubCategory = async (req, res) => {
    try {
        const { slug } = req.params
        const category = await Category.findOne({ slug })
        if (!category) return res.status(404).json({ message: 'Khong tim thay san pham'})
        res.json(category.sub)
    } catch (err) {
        res.status(500).json({ message: error.message })
    }
}

const createCategory = async (req, res) => {
    try {
        const { name, slug, description, image } = req.body
        const exists = await Category.findOne({ slug })
        if (exists) return res.status(400).json({ message: 'Slug da ton tai' })

        const category = await Category.create({ name, slug, description, image })
        res.status(201).json(category)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!category) return res.status(404).json({ message: 'Khong tim thay danh muc' })
        res.json(category)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id)
        if (!category) return res.status(404).json({message: 'Khong tim thay danh muc'})
        res,json({message: 'Da xoa danh muc'})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

module.exports = {getCategories, getSubCategory, createCategory, updateCategory, deleteCategory}