const { sendOrderStatusEmail } = require('../utils/sendMail')
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
        const { status } = req.query
        let filter = {}
        if (status) {
            filter.orderStatus = status
        }
        const orders = await Order.find(filter)
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
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
      { returnDocument: true }
    ).populate('user', 'email name')

    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' })

    try {
      const emailTo = order.user?.email
      if (emailTo) {
        await sendOrderStatusEmail({
          to: emailTo,
          order,
          newStatus: req.body.orderStatus
        })
      }
    } catch (emailErr) {
      console.log('Email error (non-critical):', emailErr.message)
    }

    res.json(order)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


const getDashboardStatus = async (req, res) => {
    try { 
        const { startDate, endDate } = req.query
        
        let dateFilter = {}
        if (startDate && endDate) {
            dateFilter = {
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            }
        }
        
        const totalUsers = await User.countDocuments({ role: 'user' })
        const totalOrders = await Order.countDocuments(dateFilter)
        const totalProduct = await Product.countDocuments()
        const revenue = await Order.aggregate([
            { $match: { paymentStatus: 'paid', ...dateFilter }},
            { $group: { _id: null, total: { $sum: '$totalPrice'}}}
        ])
        const orderCountByStatus = await Order.aggregate([
            { $match: dateFilter },
            { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
        ])
        const revenueByStatus = await Order.aggregate([
            { $match: { paymentStatus: 'paid', ...dateFilter } },
            { $group: { _id: '$orderStatus', total: { $sum: '$totalPrice' } } }
        ])
        res.json({
            totalUsers,
            totalOrders,
            totalProduct,
            totalRevenue: revenue[0]?.total || 0,
            orderCountByStatus,
            revenueByStatus
        })
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const cancelOverdueOrders = async (req, res) => {
    try {
        const overdueTime = new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 hours ago
        const result = await Order.updateMany(
            { orderStatus: 'pending', createdAt: { $lt: overdueTime } },
            { orderStatus: 'cancelled' }
        )
        res.json({ message: `Cancelled ${result.modifiedCount} overdue orders` })
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

module.exports = { getUsers, updateUserRole, getAllOrders, updateOrderStatus, getDashboardStatus, cancelOverdueOrders}
