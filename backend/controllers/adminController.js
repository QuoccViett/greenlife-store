

const User = require('../models/User')
const Order = require('../models/Order')
const Product = require('../models/Product')

const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password')
        res.json(users)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const updateUserRole = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role: req.body.role },
            { new: true }
        ).select('-password')
        if (!user) return res.status(404).json({message: 'Khong tim thay nguoi dung'})
        res.json(user)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const getAllOrders = async (req, res) => {
    try {
        const orders = (await Order.find().populate('user', 'name email')).sort({ createdAt: -1 })
        res.json(orders)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { orderStatus: req.body.orderStatus },
            { new: true }
        ) 
        if (!order) return res.status(404).json({massage: 'Khong tim thay trong don hang'})
        res.json(orders)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const getDashboardStatus = async (req, res) => {
    try { 
        const totalUsers = await User.countDocuments({ role: 'user' })
        const totalOrders = await Order.countDocuments()
        const totalProduct = await Product.countDocuments()
        const revuene = await Order.aggregate([
            { $match: { paymentStatus: 'paid' }},
            { $group: { _id: null, total: { $sum: '$totalPrice'}}}
        ])
        res.json({
            totalUsers,
            totalOrders,
            totalProduct,
            totalRevenoue: revuene[0]?.total || 0
        })
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

module.exports = { getUsers, updateUserRole, getAllOrders, updateOrderStatus, getDashboardStatus}
