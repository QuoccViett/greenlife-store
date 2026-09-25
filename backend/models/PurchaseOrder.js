const mongoose = require('mongoose')

// Một dòng hàng trên phiếu nhập. importPrice là giá NCC quy định, ghi trên phiếu.
const purchaseItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    importPrice: { type: Number, required: true, min: 0 },
})

const purchaseOrderSchema = new mongoose.Schema({
    code: { type: String, unique: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    supplierName: { type: String },
    items: {
        type: [purchaseItemSchema],
        validate: v => Array.isArray(v) && v.length > 0,
    },
    totalAmount: { type: Number, required: true, min: 0 },
    importDate: { type: Date, default: Date.now },
    note: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

purchaseOrderSchema.index({ importDate: -1 })
purchaseOrderSchema.index({ supplier: 1, importDate: -1 })

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema)
