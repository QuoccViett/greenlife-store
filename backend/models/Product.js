

const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    salePrice: { type: Number },
    // Giá vốn bình quân gia quyền - tự cập nhật mỗi lần nhập hàng
    costPrice: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    image: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    sub: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    isFeatured: {type: Boolean, default: false},
    sold: { type: Number, default: 0 },
}, { timestamps: true })

productSchema.index({ category: 1, createdAt: -1 })
productSchema.index({ sub: 1 })
productSchema.index({ isFeatured: 1 })
productSchema.index({ name: 1 })

module.exports = mongoose.model('Product', productSchema)