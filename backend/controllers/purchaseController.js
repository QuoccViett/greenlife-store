const PurchaseOrder = require('../models/PurchaseOrder')
const Supplier = require('../models/Supplier')
const Product = require('../models/Product')

const round2 = n => Math.round(n * 100) / 100

const makeCode = () => {
  const d = new Date()
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  return `PN-${ymd}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
}

// Tạo phiếu nhập: cộng tồn kho + cập nhật giá vốn bình quân gia quyền
// giá vốn mới = (tồn cũ × giá vốn cũ + SL nhập × giá nhập) / (tồn cũ + SL nhập)
const createPurchase = async (req, res) => {
  try {
    const { supplier: supplierId, items, note, importDate } = req.body

    const supplier = await Supplier.findById(supplierId)
    if (!supplier) return res.status(400).json({ message: 'Vui lòng chọn nhà cung cấp hợp lệ' })
    if (!supplier.isActive) return res.status(400).json({ message: 'Nhà cung cấp này đã ngừng hợp tác' })
    if (!Array.isArray(items) || items.length === 0)
      return res.status(400).json({ message: 'Phiếu nhập cần ít nhất 1 mặt hàng' })

    // Gộp các dòng trùng (cùng sản phẩm + cùng giá nhập) và kiểm tra dữ liệu
    const merged = new Map()
    for (const it of items) {
      const quantity = Number(it.quantity)
      const importPrice = Number(it.importPrice)
      if (!it.product) return res.status(400).json({ message: 'Có dòng chưa chọn sản phẩm' })
      if (!Number.isInteger(quantity) || quantity < 1)
        return res.status(400).json({ message: 'Số lượng nhập phải là số nguyên ≥ 1' })
      if (!Number.isFinite(importPrice) || importPrice < 0)
        return res.status(400).json({ message: 'Giá nhập không hợp lệ' })

      const key = `${it.product}|${importPrice}`
      const cur = merged.get(key)
      if (cur) cur.quantity += quantity
      else merged.set(key, { product: it.product, quantity, importPrice })
    }

    const found = await Product.find({ _id: { $in: [...new Set([...merged.values()].map(l => l.product))] } })
      .select('name').lean()
    const nameMap = new Map(found.map(p => [String(p._id), p.name]))
    const lines = []
    for (const line of merged.values()) {
      if (!nameMap.has(String(line.product)))
        return res.status(404).json({ message: `Không tìm thấy sản phẩm ${line.product}` })
      lines.push({ ...line, name: nameMap.get(String(line.product)) })
    }

    const totalAmount = round2(lines.reduce((s, l) => s + l.quantity * l.importPrice, 0))

    const purchase = await PurchaseOrder.create({
      code: makeCode(),
      supplier: supplier._id,
      supplierName: supplier.name,
      items: lines,
      totalAmount,
      note,
      importDate: importDate ? new Date(importDate) : new Date(),
      createdBy: req.user._id,
    })

    // Cập nhật kho + giá vốn bình quân trong MỘT câu lệnh nguyên tử cho từng sản phẩm
    // (dùng update pipeline nên không bị lệch khi vừa nhập vừa có đơn bán cùng lúc)
    await Product.bulkWrite(lines.map(l => ({
      updateOne: {
        filter: { _id: l.product },
        update: [{
          $set: {
            costPrice: {
              $round: [{
                $divide: [
                  { $add: [
                    { $multiply: [{ $max: [{ $ifNull: ['$stock', 0] }, 0] }, { $ifNull: ['$costPrice', 0] }] },
                    l.quantity * l.importPrice,
                  ] },
                  { $add: [{ $max: [{ $ifNull: ['$stock', 0] }, 0] }, l.quantity] },
                ],
              }, 2],
            },
            stock: { $add: [{ $ifNull: ['$stock', 0] }, l.quantity] },
          },
        }],
      },
    })))

    res.status(201).json(purchase)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getPurchases = async (req, res) => {
  try {
    const { startDate, endDate, supplier } = req.query
    const filter = {}
    if (supplier) filter.supplier = supplier
    if (startDate || endDate) {
      filter.importDate = {}
      if (startDate) filter.importDate.$gte = new Date(startDate)
      if (endDate) {
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)
        filter.importDate.$lte = end
      }
    }
    const purchases = await PurchaseOrder.find(filter)
      .populate('supplier', 'name phone')
      .populate('createdBy', 'name')
      .sort({ importDate: -1, createdAt: -1 })
      .lean()
    res.json(purchases)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getPurchaseById = async (req, res) => {
  try {
    const purchase = await PurchaseOrder.findById(req.params.id)
      .populate('supplier', 'name phone email address')
      .populate('createdBy', 'name')
    if (!purchase) return res.status(404).json({ message: 'Không tìm thấy phiếu nhập' })
    res.json(purchase)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { createPurchase, getPurchases, getPurchaseById }
