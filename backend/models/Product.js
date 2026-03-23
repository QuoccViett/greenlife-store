

const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    salePrice: { type: Number },
    stock: { type: Number, default: 0 },
    image: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    isFeatured: {type: Boolean, default: 0},
    sold: { type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model('Product', productSchema)