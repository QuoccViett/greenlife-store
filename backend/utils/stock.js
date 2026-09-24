const Order = require('../models/Order')
const Product = require('../models/Product')

// Hoàn kho cho đơn bị hủy. Idempotent: mỗi đơn chỉ hoàn kho đúng 1 lần.
const restockOrder = async (orderId) => {
  const order = await Order.findOneAndUpdate(
    { _id: orderId, restocked: { $ne: true } },
    { $set: { restocked: true } },
    { new: true }
  ).lean()
  if (!order) return false

  const ops = order.items.map(i => ({
    updateOne: {
      filter: { _id: i.product },
      update: { $inc: { stock: i.quantity, sold: -i.quantity } },
    },
  }))
  if (ops.length) await Product.bulkWrite(ops)
  return true
}

// Tự hủy đơn thanh toán online chưa trả tiền quá hạn (mặc định 30 phút) + hoàn kho
const cancelOverdueOnlineOrders = async (minutes = 30) => {
  const limit = new Date(Date.now() - minutes * 60 * 1000)
  const overdue = await Order.find({
    paymentMethod: { $in: ['vnpay', 'momo'] },
    paymentStatus: 'pending',
    orderStatus: { $in: ['pending', 'processing'] },
    createdAt: { $lt: limit },
  }).select('_id').lean()

  for (const o of overdue) {
    await Order.updateOne({ _id: o._id }, { orderStatus: 'cancelled', paymentStatus: 'failed' })
    await restockOrder(o._id)
  }
  return overdue.length
}

module.exports = { restockOrder, cancelOverdueOnlineOrders }
