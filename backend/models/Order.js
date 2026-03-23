

const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
    name: { type: String, required: true },
    image: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
})

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    shippingAddress: {
        fullname: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
    },
    totalPrice: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['cod', 'vnpay', 'momo'], default: 'cod' },
    paymentStatus: { type: String, enum: ['pending', 'processing', 'shipping', 'delivered', 'cancelled'], default: 'pending'},
    paidAt: {type: Date},
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)