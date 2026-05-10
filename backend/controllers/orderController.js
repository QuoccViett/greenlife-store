const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User"); // LỖI 1: Thêm require User
const { sendOrderConfirmEmail } = require("../utils/sendMail"); // LỖI 2: Thêm require mail util

const createOrder = async (req, res) => {
  try {
    // LỖI 3: Lấy thêm notifyEmail từ req.body
    const { items, shippingAddress, paymentMethod, notifyEmail } = req.body;

    if (!items || items.length === 0)
      return res.status(404).json({ message: "Khong co san pham trong gio hang" });

    let totalPrice = 0;
    const orderItems = []; // Thống nhất dùng chữ I viết hoa

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product)
        return res.status(404).json({ message: `Khong tim thay san pham ${item.product}` });

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Sản phẩm "${product.name}" chỉ còn ${product.stock} trong kho`
        })
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.salePrice || product.price,
        quantity: item.quantity,
      });

      totalPrice += (product.salePrice || product.price) * item.quantity;
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems, // Đã sửa khớp tên biến
      shippingAddress,
      paymentMethod,
      totalPrice,
    })

    // Cập nhật kho hàng
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, sold: item.quantity }
      })
    }
    
    // Gửi email xác nhận
    try {
      const user = await User.findById(req.user._id);
      // Nếu khách nhập email thông báo riêng thì dùng, không thì dùng email tài khoản
      const emailTo = notifyEmail || user.email; 
      
      if (emailTo) {
        await sendOrderConfirmEmail({ to: emailTo, order });
      }
    } catch (emailErr) {
      console.log('Email error (non-critical):', emailErr.message);
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Khong tim thay don hang" });

    // Kiểm tra quyền xem đơn hàng
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin")
      return res.status(403).json({ message: "Khong co quyen xem don hang" });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getOrderById };