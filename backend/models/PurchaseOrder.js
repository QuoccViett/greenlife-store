const mongoose = require('mongoose');

const purchaseOrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Số lượng nhập phải lớn hơn 0']
  },
  importPrice: {
    type: Number,
    required: true,
    min: [0, 'Giá nhập không được âm']
  },
  totalPrice: {
    type: Number,
    required: true
  }
});

const purchaseOrderSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: [true, 'Nhà cung cấp là bắt buộc']
  },
  items: [purchaseOrderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    default: 0
  },
  importDate: {
    type: Date,
    default: Date.now
  },
  note: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);