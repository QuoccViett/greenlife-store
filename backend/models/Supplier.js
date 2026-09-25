const mongoose = require('mongoose')

const supplierSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true },
    address: { type: String, trim: true },
    note: { type: String },
    isActive: { type: Boolean, default: true },
}, { timestamps: true })

supplierSchema.index({ name: 1 })

module.exports = mongoose.model('Supplier', supplierSchema)
