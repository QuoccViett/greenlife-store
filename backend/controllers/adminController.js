const { sendOrderStatusEmail } = require('../utils/sendMail')
const User = require('../models/User')
const Order = require('../models/Order')
const Product = require('../models/Product')
const bcrypt = require('bcryptjs')

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password')
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateUserRole = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    ).select('-password')
    if (!user) return res.status(404).json({ message: 'Khong tim thay nguoi dung' })
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
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
    res.status(500).json({ message: error.message })
  }
}

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: req.body.orderStatus },
      { new: true }
    ).populate('user', 'email name')

    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' })

    // Gửi email thông báo trạng thái
    try {
      if (order.user?.email) {
        await sendOrderStatusEmail({
          to: order.user.email,
          order,
          newStatus: req.body.orderStatus
        })
      }
    } catch (e) {
      console.log('Email error:', e.message)
    }

    res.json(order)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


const getDashboardStats = async (req, res) => {
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
      { $match: { paymentStatus: 'paid', ...dateFilter } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
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
      totalProducts: totalProduct,
      totalRevenue: revenue[0]?.total || 0,
      orderCountByStatus,
      revenueByStatus
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
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
    res.status(500).json({ message: error.message })
  }
}

// Khóa / mở khóa tài khoản
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' })
    if (user.role === 'admin') return res.status(403).json({ message: 'Không thể khóa tài khoản admin' })

    user.isActive = !user.isActive
    await user.save()
    res.json({ message: user.isActive ? 'Đã mở khóa tài khoản' : 'Đã khóa tài khoản', isActive: user.isActive })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Reset mật khẩu
const resetUserPassword = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' })

    const newPassword = Math.random().toString(36).slice(-8)
    user.password = await bcrypt.hash(newPassword, 10)
    await user.save()

    try {
      await sendNewPasswordEmail({ to: user.email, name: user.name, newPassword })
    } catch (e) {
      console.log('Email error:', e.message)
    }

    res.json({ message: `Reset thành công. Mật khẩu mới: ${newPassword}`, newPassword })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Thống kê nâng cao
const getAdvancedStats = async (req, res) => {
  try {
    const { startDate, endDate, orderStatus, paymentStatus } = req.query
    let filter = {}

    if (startDate || endDate) {
      filter.createdAt = {}
      if (startDate) filter.createdAt.$gte = new Date(startDate)
      if (endDate) {
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)
        filter.createdAt.$lte = end
      }
    }
    if (orderStatus) filter.orderStatus = orderStatus
    if (paymentStatus) filter.paymentStatus = paymentStatus

    const orders = await Order.find(filter)

    res.json({
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, o) => sum + o.totalPrice, 0),
      byOrderStatus: {
        pending: orders.filter(o => o.orderStatus === 'pending').length,
        processing: orders.filter(o => o.orderStatus === 'processing').length,
        shipping: orders.filter(o => o.orderStatus === 'shipping').length,
        delivered: orders.filter(o => o.orderStatus === 'delivered').length,
        cancelled: orders.filter(o => o.orderStatus === 'cancelled').length,
      },
      revenueByStatus: {
        paid: orders.filter(o => o.paymentStatus === 'paid').reduce((s, o) => s + o.totalPrice, 0),
        pending: orders.filter(o => o.paymentStatus === 'pending').reduce((s, o) => s + o.totalPrice, 0),
        failed: orders.filter(o => o.paymentStatus === 'failed').reduce((s, o) => s + o.totalPrice, 0),
        cancelled: orders.filter(o => o.orderStatus === 'cancelled').reduce((s, o) => s + o.totalPrice, 0),
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getUsers, updateUserRole, getAllOrders, updateOrderStatus, getDashboardStats, toggleUserStatus, resetUserPassword, getAdvancedStats }
