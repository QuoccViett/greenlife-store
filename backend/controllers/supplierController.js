const Supplier = require('../models/Supplier');
const PurchaseOrder = require('../models/PurchaseOrder');

// Lấy danh sách nhà cung cấp
exports.getSuppliers = async (req, res) => {
  try {
    const { search, isActive } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (isActive !== undefined && isActive !== '') {
      query.isActive = isActive === 'true';
    }

    const suppliers = await Supplier.find(query).sort({ createdAt: -1 });

    // Thống kê số lần nhập & tổng số tiền nhập từng NCC
    const suppliersWithStats = await Promise.all(
      suppliers.map(async (supplier) => {
        const stats = await PurchaseOrder.aggregate([
          { $match: { supplier: supplier._id } },
          {
            $group: {
              _id: null,
              totalOrders: { $sum: 1 },
              totalSpent: { $sum: '$totalAmount' }
            }
          }
        ]);

        const supplierObj = supplier.toObject();
        supplierObj.totalOrders = stats[0] ? stats[0].totalOrders : 0;
        supplierObj.totalSpent = stats[0] ? stats[0].totalSpent : 0;
        return supplierObj;
      })
    );

    res.json({
      success: true,
      count: suppliersWithStats.length,
      suppliers: suppliersWithStats
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy chi tiết nhà cung cấp
exports.getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy nhà cung cấp' });
    }
    res.json({ success: true, supplier });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Tạo nhà cung cấp mới
exports.createSupplier = async (req, res) => {
  try {
    const { name, phone, email, address, note } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập tên nhà cung cấp' });
    }

    const supplier = await Supplier.create({
      name,
      phone,
      email,
      address,
      note
    });

    res.status(201).json({ success: true, supplier });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật nhà cung cấp
exports.updateSupplier = async (req, res) => {
  try {
    const { name, phone, email, address, note, isActive } = req.body;
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy nhà cung cấp' });
    }

    supplier.name = name || supplier.name;
    supplier.phone = phone !== undefined ? phone : supplier.phone;
    supplier.email = email !== undefined ? email : supplier.email;
    supplier.address = address !== undefined ? address : supplier.address;
    supplier.note = note !== undefined ? note : supplier.note;
    if (isActive !== undefined) supplier.isActive = isActive;

    await supplier.save();

    res.json({ success: true, supplier });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa hoặc ngưng hoạt động nhà cung cấp
exports.deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy nhà cung cấp' });
    }

    // Kiểm tra xem đã có phiếu nhập từ NCC này chưa
    const hasPurchases = await PurchaseOrder.findOne({ supplier: supplier._id });
    if (hasPurchases) {
      // Nếu đã có phiếu nhập, chỉ chuyển trạng thái ngưng hoạt động
      supplier.isActive = false;
      await supplier.save();
      return res.json({
        success: true,
        message: 'Nhà cung cấp đã có phiếu nhập hàng. Đã chuyển trạng thái sang "Ngưng hoạt động".',
        supplier
      });
    }

    await supplier.deleteOne();
    res.json({ success: true, message: 'Xóa nhà cung cấp thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};