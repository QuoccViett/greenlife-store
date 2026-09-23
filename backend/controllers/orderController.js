const Order = require('../models/Order');
const Product = require('../models/Product');

// 1. Tạo đơn hàng mới
exports.createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Đơn hàng chưa có sản phẩm nào' });
    }

    // Lấy thông tin giá vốn hiện tại từ database gán vào order items
    const itemsWithCostPrice = await Promise.all(
      orderItems.map(async (item) => {
        const product = await Product.findById(item.product);
        return {
          ...item,
          costPrice: product ? (product.costPrice || 0) : 0
        };
      })
    );

    const order = new Order({
      user: req.user._id,
      orderItems: itemsWithCostPrice,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice
    });

    const createdOrder = await order.save();

    // Giảm tồn kho sản phẩm
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    res.status(201).json({ success: true, order: createdOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Lấy chi tiết 1 đơn hàng theo ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Lấy danh sách đơn hàng của người dùng đang đăng nhập
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Lấy toàn bộ danh sách đơn hàng (Dành cho Admin)
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'id name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Cập nhật trạng thái đơn hàng (Dành cho Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }

    order.orderStatus = status;

    if (status === 'delivered') {
      order.deliveredAt = Date.now();
      // Nếu là thanh toán COD thì tự động ghi nhận đã thu tiền
      if (order.paymentMethod === 'COD') {
        order.paymentStatus = 'paid';
        order.paidAt = Date.now();
      }
    }

    await order.save();
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};