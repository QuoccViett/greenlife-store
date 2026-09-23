const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const PurchaseOrder = require('../models/PurchaseOrder');
const bcrypt = require('bcryptjs');

// 1. Thống kê Dashboard cơ bản
exports.getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });

    // Doanh thu từ đơn hàng ĐÃ THANH TOÁN
    const paidOrders = await Order.find({ paymentStatus: 'paid' });
    const totalRevenue = paidOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

    // Giá vốn hàng bán (COGS)
    let totalCOGS = 0;
    paidOrders.forEach(order => {
      order.orderItems.forEach(item => {
        const itemCost = item.costPrice || 0;
        totalCOGS += itemCost * item.quantity;
      });
    });

    // Lợi nhuận gộp = Doanh thu - COGS
    const grossProfit = totalRevenue - totalCOGS;

    // Chi phí nhập hàng
    const purchases = await PurchaseOrder.find();
    const totalPurchaseCost = purchases.reduce((sum, po) => sum + (po.totalAmount || 0), 0);

    // Tiền còn lại (Dòng tiền) = Doanh thu - Chi phí nhập hàng
    const netCash = totalRevenue - totalPurchaseCost;

    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalOrders,
        totalProducts,
        totalUsers,
        totalRevenue,
        totalPurchaseCost,
        netCash,
        totalCOGS,
        grossProfit
      },
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Thống kê nâng cao
exports.getAdvancedStats = async (req, res) => {
  try {
    const orders = await Order.find({ paymentStatus: 'paid' });
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    res.json({ success: true, stats: { totalRevenue, totalOrders: orders.length } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Lấy danh sách người dùng
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Cập nhật vai trò người dùng (User / Admin)
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });

    user.role = role || user.role;
    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Khóa / Mở khóa tài khoản
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });

    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, message: 'Cập nhật trạng thái tài khoản thành công', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Reset mật khẩu người dùng
exports.resetUserPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword || '123456', salt);
    await user.save();

    res.json({ success: true, message: 'Đặt lại mật khẩu thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 7. Lấy toàn bộ danh sách đơn hàng
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 8. Cập nhật trạng thái đơn hàng
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });

    order.orderStatus = status;
    if (status === 'delivered') {
      order.deliveredAt = Date.now();
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