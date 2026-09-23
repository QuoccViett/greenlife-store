const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tên sản phẩm là bắt buộc'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Mô tả sản phẩm là bắt buộc']
  },
  price: {
    type: Number,
    required: [true, 'Giá bán là bắt buộc'],
    min: [0, 'Giá bán không được âm']
  },
  costPrice: {
    type: Number,
    default: 0,
    min: [0, 'Giá vốn không được âm']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Danh mục là bắt buộc']
  },
  stock: {
    type: Number,
    required: [true, 'Số lượng kho là bắt buộc'],
    min: [0, 'Số lượng kho không được âm'],
    default: 0
  },
  images: [{
    type: String
  }],
  featured: {
    type: Boolean,
    default: false
  },
  isEco: {
    type: Boolean,
    default: true
  },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);