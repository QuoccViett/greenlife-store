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

    // Trừ kho NGUYÊN TỬ: chỉ trừ khi còn đủ hàng -> không bán vượt tồn khi nhiều người mua cùng lúc.
    // Giá bán & giá vốn luôn lấy từ DB (không tin giá client gửi lên).
    let totalPrice = 0;
    const orderItems = [];
    const reserved = []; // để hoàn lại nếu có dòng không đủ hàng

    const rollback = async () => {
      for (const r of reserved) {
        await Product.updateOne({ _id: r.product }, { $inc: { stock: r.quantity, sold: -r.quantity } });
      }
    };

    for (const item of items) {
      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity < 1) {
        await rollback();
        return res.status(400).json({ message: "Số lượng không hợp lệ" });
      }

      const product = await Product.findOneAndUpdate(
        { _id: item.product, stock: { $gte: quantity } },
        { $inc: { stock: -quantity, sold: quantity } },
        { new: false } // lấy bản trước khi trừ để đọc giá/giá vốn
      );

      if (!product) {
        await rollback();
        const exists = await Product.findById(item.product).select("name stock").lean();
        return exists
          ? res.status(400).json({ message: `Sản phẩm "${exists.name}" chỉ còn ${exists.stock} trong kho` })
          : res.status(404).json({ message: `Khong tim thay san pham ${item.product}` });
      }

      reserved.push({ product: product._id, quantity });
      const unitPrice = product.salePrice || product.price;
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: unitPrice,
        costPrice: product.costPrice || 0, // snapshot giá vốn tại thời điểm bán
        quantity,
      });
      totalPrice += unitPrice * quantity;
    }

    let order;
    try {
      order = await Order.create({
        user: req.user._id,
        items: orderItems,
        shippingAddress,
        paymentMethod,
        totalPrice,
      });
    } catch (err) {
      await rollback();
      throw err;
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
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
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