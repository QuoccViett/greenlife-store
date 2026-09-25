const Supplier = require('../models/Supplier')
const PurchaseOrder = require('../models/PurchaseOrder')

// Danh sách NCC kèm tổng tiền đã nhập & số phiếu
const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 }).lean()
    const totals = await PurchaseOrder.aggregate([
      { $group: { _id: '$supplier', total: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
    ])
    const map = new Map(totals.map(t => [String(t._id), t]))
    res.json(
      suppliers.map(s => ({
        ...s,
        totalPurchased: map.get(String(s._id))?.total || 0,
        purchaseCount: map.get(String(s._id))?.count || 0,
      }))
    )
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const createSupplier = async (req, res) => {
  try {
    const { name, phone, email, address, note } = req.body
    if (!name?.trim()) return res.status(400).json({ message: 'Tên nhà cung cấp là bắt buộc' })
    const supplier = await Supplier.create({ name, phone, email, address, note })
    res.status(201).json(supplier)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateSupplier = async (req, res) => {
  try {
    const { name, phone, email, address, note, isActive } = req.body
    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      { name, phone, email, address, note, isActive },
      { new: true, runValidators: true }
    )
    if (!supplier) return res.status(404).json({ message: 'Không tìm thấy nhà cung cấp' })
    res.json(supplier)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteSupplier = async (req, res) => {
  try {
    const used = await PurchaseOrder.exists({ supplier: req.params.id })
    if (used) {
      return res.status(400).json({
        message: 'Nhà cung cấp đã có phiếu nhập, không thể xóa. Hãy chuyển sang "Ngừng hợp tác".',
      })
    }
    const supplier = await Supplier.findByIdAndDelete(req.params.id)
    if (!supplier) return res.status(404).json({ message: 'Không tìm thấy nhà cung cấp' })
    res.json({ message: 'Đã xóa nhà cung cấp' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getSuppliers, createSupplier, updateSupplier, deleteSupplier }
