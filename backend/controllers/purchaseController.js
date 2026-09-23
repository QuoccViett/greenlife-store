const PurchaseOrder = require('../models/PurchaseOrder');
const Product = require('../models/Product');
const Supplier = require('../models/Supplier');

// Lấy danh sách phiếu nhập
exports.getPurchaseOrders = async (req, res) => {
  try {
    const { startDate, endDate, supplierId } = req.query;
    let query = {};

    if (supplierId) {
      query.supplier = supplierId;
    }

    if (startDate || endDate) {
      query.importDate = {};
      if (startDate) query.importDate.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.importDate.$lte = end;
      }
    }

    const purchases = await PurchaseOrder.find(query)
      .populate('supplier', 'name phone email')
      .populate('createdBy', 'name email')
      .sort({ importDate: -1, createdAt: -1 });

    res.json({ success: true, count: purchases.length, purchases });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy chi tiết phiếu nhập
exports.getPurchaseOrderById = async (req, res) => {
  try {
    const purchase = await PurchaseOrder.findById(req.params.id)
      .populate('supplier', 'name phone email address')
      .populate('createdBy', 'name email')
      .populate('items.product', 'name price costPrice stock');

    if (!purchase) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiếu nhập hàng' });
    }

    res.json({ success: true, purchase });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Tạo phiếu nhập hàng mới & tính giá vốn bình quân gia quyền
exports.createPurchaseOrder = async (req, res) => {
  try {
    const { supplierId, items, note, importDate } = req.body;

    if (!supplierId) {
      return res.status(400).json({ success: false, message: 'Vui lòng chọn nhà cung cấp' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Vui lòng chọn ít nhất 1 sản phẩm nhập' });
    }

    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Nhà cung cấp không tồn tại' });
    }

    // Tạo mã phiếu nhập tự động (PN-YYYYMMDD-XXXX)
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const countToday = await PurchaseOrder.countDocuments({
      createdAt: {
        $gte: new Date(today.setHours(0,0,0,0)),
        $lte: new Date(today.setHours(23,59,59,999))
      }
    });
    const code = `PN-${dateStr}-${String(countToday + 1).padStart(4, '0')}`;

    let totalAmount = 0;
    const processedItems = [];

    // Xử lý từng sản phẩm trong phiếu nhập
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Không tìm thấy sản phẩm ID ${item.productId}` });
      }

      const qty = Number(item.quantity);
      const importPrice = Number(item.importPrice);

      if (qty <= 0 || importPrice < 0) {
        return res.status(400).json({ success: false, message: `Số lượng hoặc giá nhập của sản phẩm "${product.name}" không hợp lệ` });
      }

      const itemTotal = qty * importPrice;
      totalAmount += itemTotal;

      processedItems.push({
        product: product._id,
        productName: product.name,
        quantity: qty,
        importPrice: importPrice,
        totalPrice: itemTotal
      });

      // TÍNH GIÁ VỐN BÌNH QUÂN GIA QUYỀN VÀ CẬP NHẬT KHO HÀNG
      const oldStock = product.stock || 0;
      const oldCostPrice = product.costPrice || 0;
      const newStock = oldStock + qty;

      // Công thức: ((StockCũ * GiáCũ) + (SLMới * GiáMới)) / StockMới
      let newCostPrice = oldCostPrice;
      if (newStock > 0) {
        newCostPrice = Math.round(((oldStock * oldCostPrice) + (qty * importPrice)) / newStock);
      }

      product.stock = newStock;
      product.costPrice = newCostPrice;
      await product.save();
    }

    // Tạo phiếu nhập
    const purchaseOrder = await PurchaseOrder.create({
      code,
      supplier: supplierId,
      items: processedItems,
      totalAmount,
      note,
      importDate: importDate || Date.now(),
      createdBy: req.user ? req.user._id : null
    });

    const populatedPurchase = await PurchaseOrder.findById(purchaseOrder._id)
      .populate('supplier', 'name phone')
      .populate('createdBy', 'name');

    res.status(201).json({
      success: true,
      message: 'Tạo phiếu nhập hàng thành công. Đã cập nhật tồn kho và giá vốn sản phẩm.',
      purchase: populatedPurchase
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};