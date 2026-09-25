const { sendOrderStatusEmail, sendNewPasswordEmail } = require('../utils/sendMail')
const User = require('../models/User')
const Order = require('../models/Order')
const Product = require('../models/Product')
const PurchaseOrder = require('../models/PurchaseOrder')
const { restockOrder } = require('../utils/stock')
const bcrypt = require('bcryptjs')

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 }).lean()
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
      .lean()
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateOrderStatus = async (req, res) => {
  try {
    const update = { orderStatus: req.body.orderStatus }

    // COD: giao hàng thành công thì tiền đã thu -> ghi nhận đã thanh toán (để tính vào doanh thu/lợi nhuận)
    if (req.body.orderStatus === 'delivered') {
      const current = await Order.findById(req.params.id).select('paymentMethod paymentStatus')
      if (current && current.paymentMethod === 'cod' && current.paymentStatus !== 'paid') {
        update.paymentStatus = 'paid'
        update.paidAt = new Date()
      }
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    ).populate('user', 'email name')

    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' })

    if (req.body.orderStatus === 'cancelled') await restockOrder(order._id)

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


// Tính tài chính trong kỳ:
//  - Doanh thu      = tiền bán hàng đã thu (đơn đã thanh toán, không tính đơn hủy)
//  - Chi phí nhập   = tổng tiền các phiếu nhập trong kỳ
//  - Tiền còn lại   = Doanh thu - Chi phí nhập (dòng tiền)
//  - Lợi nhuận gộp  = Σ (giá bán - giá vốn) × số lượng đã bán
const computeFinance = async ({ startDate, endDate }) => {
  const range = field => {
    if (!startDate && !endDate) return {}
    const r = {}
    if (startDate) r.$gte = new Date(startDate)
    if (endDate) {
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999)
      r.$lte = end
    }
    return { [field]: r }
  }

  const paidMatch = {
    paymentStatus: 'paid',
    orderStatus: { $ne: 'cancelled' },
    ...range('createdAt'),
  }

  // Doanh thu: cộng ở tầng DB
  const rev = await Order.aggregate([
    { $match: paidMatch },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ])

  // Giá vốn hàng bán: giá vốn snapshot trên từng dòng; đơn cũ chưa có snapshot -> dùng giá vốn hiện tại của SP
  const cg = await Order.aggregate([
    { $match: paidMatch },
    { $unwind: '$items' },
    { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'p' } },
    { $project: {
        qty: '$items.quantity',
        cost: { $ifNull: ['$items.costPrice', { $ifNull: [{ $arrayElemAt: ['$p.costPrice', 0] }, 0] }] },
    } },
    { $group: { _id: null, total: { $sum: { $multiply: ['$qty', '$cost'] } } } },
  ])

  const revenue = rev[0]?.total || 0
  const cogs = cg[0]?.total || 0

  const imp = await PurchaseOrder.aggregate([
    { $match: range('importDate') },
    { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
  ])
  const importCost = imp[0]?.total || 0
  const round2 = n => Math.round(n * 100) / 100
  const grossProfit = revenue - cogs

  return {
    totalRevenue: round2(revenue),
    totalImportCost: round2(importCost),
    purchaseCount: imp[0]?.count || 0,
    netCash: round2(revenue - importCost),
    costOfGoodsSold: round2(cogs),
    grossProfit: round2(grossProfit),
    profitMargin: revenue > 0 ? round2((grossProfit / revenue) * 100) : 0,
  }
}

const getDashboardStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query

    let dateFilter = {}
    if (startDate && endDate) {
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999)
      dateFilter = { createdAt: { $gte: new Date(startDate), $lte: end } }
    }

    const totalUsers = await User.countDocuments({ role: 'user' })
    const totalOrders = await Order.countDocuments(dateFilter)
    const totalProduct = await Product.countDocuments()
    const orderCountByStatus = await Order.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
    ])
    const revenueByStatus = await Order.aggregate([
      { $match: { paymentStatus: 'paid', ...dateFilter } },
      { $group: { _id: '$orderStatus', total: { $sum: '$totalPrice' } } }
    ])
    const finance = await computeFinance({
      startDate: startDate && endDate ? startDate : undefined,
      endDate: startDate && endDate ? endDate : undefined,
    })

    res.json({
      totalUsers,
      totalOrders,
      totalProducts: totalProduct,
      orderCountByStatus,
      revenueByStatus,
      ...finance,
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

    // Một lần aggregate ($facet) thay vì kéo toàn bộ đơn về Node
    const [r] = await Order.aggregate([
      { $match: filter },
      { $facet: {
          overall: [{ $group: { _id: null, count: { $sum: 1 }, revenue: { $sum: '$totalPrice' } } }],
          byOrder: [{ $group: { _id: '$orderStatus', count: { $sum: 1 } } }],
          byPayment: [{ $group: { _id: '$paymentStatus', total: { $sum: '$totalPrice' } } }],
          cancelled: [{ $match: { orderStatus: 'cancelled' } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }],
      } },
    ])
    const cnt = k => r.byOrder.find(x => x._id === k)?.count || 0
    const pay = k => r.byPayment.find(x => x._id === k)?.total || 0

    res.json({
      totalOrders: r.overall[0]?.count || 0,
      totalRevenue: r.overall[0]?.revenue || 0,
      byOrderStatus: {
        pending: cnt('pending'),
        processing: cnt('processing'),
        shipping: cnt('shipping') + cnt('shipped'),
        delivered: cnt('delivered'),
        cancelled: cnt('cancelled'),
      },
      revenueByStatus: {
        paid: pay('paid'),
        pending: pay('pending'),
        failed: pay('failed'),
        cancelled: r.cancelled[0]?.total || 0,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getUsers, updateUserRole, getAllOrders, updateOrderStatus, getDashboardStats, toggleUserStatus, resetUserPassword, getAdvancedStats }
