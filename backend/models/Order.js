

const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
    name: { type: String, required: true },
    image: { type: String },
    price: { type: Number, required: true },
    // Giá vốn tại thời điểm bán (snapshot) để tính lợi nhuận đúng về sau
    costPrice: { type: Number, default: 0 },
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
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending'},
    orderStatus: { type: String, enum: ['pending', 'processing', 'shipping', 'shipped', 'delivered', 'cancelled'], default: 'pending'},
    paidAt: {type: Date},
    // Đã hoàn kho khi hủy đơn hay chưa (tránh hoàn kho 2 lần)
    restocked: { type: Boolean, default: false },
}, { timestamps: true })

// Index phục vụ các truy vấn thường dùng
orderSchema.index({ user: 1, createdAt: -1 })                 // lịch sử đơn của khách
orderSchema.index({ createdAt: -1 })                          // danh sách/ lọc theo ngày ở admin
orderSchema.index({ paymentStatus: 1, orderStatus: 1, createdAt: -1 }) // thống kê doanh thu
orderSchema.index({ paymentMethod: 1, paymentStatus: 1, createdAt: 1 }) // job tự hủy đơn quá hạn

module.exports = mongoose.model('Order', orderSchema)