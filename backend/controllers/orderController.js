const { sendOrderConfirmEmail } = require('../utils/sendMail')
const User = require('../models/User');
const Order = require('../models/Order')
const Product = require('../models/Product')

const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, notifyEmail } = req.body

    if (!items || items.length === 0)
      return res.status(400).json({ message: 'Không có sản phẩm trong đơn hàng' })

    let totalPrice = 0
    const orderItems = []

    for (const item of items) {
      const product = await Product.findById(item.product)
      if (!product) return res.status(404).json({ message: `Không tìm thấy sản phẩm` })
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.salePrice || product.price,
        quantity: item.quantity,
      })
      totalPrice += (product.salePrice || product.price) * item.quantity
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
    })
    try {
        const user = await User.findById(req.user._id)
        const emailTo = notifyEmail || user.email
        console.log(order)
      await sendOrderConfirmEmail({ to: emailTo, order })
    } catch (emailErr) {
      console.log('Email error (non-critical):', emailErr.message)
    }

    res.status(201).json(order)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
        res.json(orders)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email')
        if (!order) return res.status(404).json({message: 'Khong tim thay don hang'})

        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin')
            return rs.status(403).json({message: 'Khong co quyen xem don hang'})

        res.json(order)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

module.exports = { createOrder, getMyOrders, getOrderById }