import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useLang } from '../../context/LangContext'
import { IconPlus, IconTrash, IconClose, IconChevronDown, IconStore } from '../../components/icons'
import AdminFilter from '../../components/admin/AdminFilter'
import StatCard from '../../components/admin/StatCard'

const API = import.meta.env.VITE_API_URL
const money = n => `$${(n || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`
const today = () => new Date().toISOString().slice(0, 10)
const emptyLine = () => ({ product: '', quantity: 1, importPrice: '' })

const AdminPurchases = () => {
    const { lang } = useLang()
    const L = (vi, en) => (lang === 'vi' ? vi : en)
    const { userInfo } = useSelector(state => state.auth)
    const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } }

    const [purchases, setPurchases] = useState([])
    const [suppliers, setSuppliers] = useState([])
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [expanded, setExpanded] = useState(null)

    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [filterSupplier, setFilterSupplier] = useState('')

    const [showModal, setShowModal] = useState(false)
    const [supplier, setSupplier] = useState('')
    const [importDate, setImportDate] = useState(today())
    const [note, setNote] = useState('')
    const [lines, setLines] = useState([emptyLine()])
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    const fetchPurchases = async () => {
        try {
            const params = new URLSearchParams()
            if (startDate) params.append('startDate', startDate)
            if (endDate) params.append('endDate', endDate)
            if (filterSupplier) params.append('supplier', filterSupplier)
            const { data } = await axios.get(`${API}/purchases?${params}`, config)
            setPurchases(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { if (userInfo) fetchPurchases() }, [userInfo, startDate, endDate, filterSupplier])

    useEffect(() => {
        if (!userInfo) return
        const cfg = { headers: { Authorization: `Bearer ${userInfo.token}` } }
        axios.get(`${API}/suppliers`, cfg).then(r => setSuppliers(r.data)).catch(console.error)
        axios.get(`${API}/products`).then(r => setProducts(r.data)).catch(console.error)
    }, [userInfo])

    const total = useMemo(
        () => lines.reduce((s, l) => s + (Number(l.quantity) || 0) * (Number(l.importPrice) || 0), 0),
        [lines]
    )
    const listTotal = purchases.reduce((s, p) => s + p.totalAmount, 0)
    const listQty = purchases.reduce((s, p) => s + p.items.reduce((a, i) => a + i.quantity, 0), 0)
    const lowStock = products.filter(p => p.stock <= 5).length

    const openCreate = () => {
        setSupplier(''); setImportDate(today()); setNote(''); setLines([emptyLine()]); setError(''); setShowModal(true)
    }

    const updateLine = (i, patch) => setLines(lines.map((l, idx) => (idx === i ? { ...l, ...patch } : l)))

    // Chọn sản phẩm -> gợi ý giá nhập = giá vốn hiện tại (admin sửa lại theo giá NCC trên phiếu)
    const pickProduct = (i, productId) => {
        const p = products.find(x => x._id === productId)
        updateLine(i, { product: productId, importPrice: p?.costPrice ? p.costPrice : lines[i].importPrice })
    }

    const handleSave = async e => {
        e.preventDefault()
        setError('')
        if (!supplier) return setError(L('Vui lòng chọn nhà cung cấp', 'Please choose a supplier'))
        if (lines.some(l => !l.product || Number(l.quantity) < 1 || l.importPrice === ''))
            return setError(L('Vui lòng điền đủ sản phẩm, số lượng và giá nhập ở mọi dòng', 'Fill product, quantity and import price on every line'))
        setSaving(true)
        try {
            await axios.post(`${API}/purchases`, {
                supplier, note, importDate,
                items: lines.map(l => ({ product: l.product, quantity: Number(l.quantity), importPrice: Number(l.importPrice) })),
            }, config)
            setShowModal(false)
            fetchPurchases()
            axios.get(`${API}/products`).then(r => setProducts(r.data))
        } catch (err) {
            setError(err.response?.data?.message || err.message)
        } finally {
            setSaving(false)
        }
    }

    const inputCls = 'w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:border-green-500 outline-none'

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div className="text-left">
                    <h1 className="text-2xl font-bold text-gray-800">{L('Nhập hàng', 'Purchases')}</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {L(`${purchases.length} phiếu nhập · Tổng chi ${money(listTotal)}`, `${purchases.length} receipts · Total spent ${money(listTotal)}`)}
                    </p>
                </div>
                <button onClick={openCreate} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-green-700 transition">
                    <IconPlus className="!w-4 !h-4" />
                    {L('Tạo phiếu nhập', 'New receipt')}
                </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard color="bg-red-500" icon={<IconStore className="!w-5 !h-5 text-white" />} label={L('Tổng chi nhập hàng', 'Total spent')} value={money(listTotal)} />
                <StatCard color="bg-blue-500" icon={<IconStore className="!w-5 !h-5 text-white" />} label={L('Số phiếu nhập', 'Receipts')} value={purchases.length} />
                <StatCard color="bg-purple-500" icon={<IconStore className="!w-5 !h-5 text-white" />} label={L('Số lượng đã nhập', 'Units purchased')} value={listQty.toLocaleString('en-US')} />
                <StatCard color="bg-amber-500" icon={<IconStore className="!w-5 !h-5 text-white" />} label={L('Sản phẩm sắp hết (≤5)', 'Low stock (≤5)')} value={lowStock} sub={L('Cân nhắc nhập thêm', 'Consider restocking')} />
            </div>

            <AdminFilter
                dateFrom={startDate}
                dateTo={endDate}
                onDateFrom={setStartDate}
                onDateTo={setEndDate}
                dropdowns={[{
                    value: filterSupplier,
                    onChange: setFilterSupplier,
                    placeholder: L('Tất cả nhà cung cấp', 'All suppliers'),
                    options: suppliers.map(s => ({ value: s._id, label: s.name })),
                }]}
                showReset={!!(startDate || endDate || filterSupplier)}
                onReset={() => { setStartDate(''); setEndDate(''); setFilterSupplier('') }}
            />

            <div className="space-y-3 text-left">
                {loading ? (
                    [...Array(3)].map((_, i) => <div key={i} className="h-16 bg-white rounded-2xl border border-gray-100 animate-pulse" />)
                ) : purchases.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">{L('Chưa có phiếu nhập', 'No receipts yet')}</div>
                ) : purchases.map(p => (
                    <div key={p._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                        <button onClick={() => setExpanded(expanded === p._id ? null : p._id)} className="w-full flex items-center justify-between gap-4 px-6 py-4 hover:bg-gray-50 text-left">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                                <div><p className="text-[10px] font-bold text-gray-400 uppercase">{L('Mã phiếu', 'Code')}</p><p className="font-mono text-sm text-gray-700">{p.code}</p></div>
                                <div><p className="text-[10px] font-bold text-gray-400 uppercase">{L('Nhà cung cấp', 'Supplier')}</p><p className="text-sm text-gray-700">{p.supplier?.name || p.supplierName}</p></div>
                                <div><p className="text-[10px] font-bold text-gray-400 uppercase">{L('Ngày nhập', 'Date')}</p><p className="text-sm text-gray-700">{new Date(p.importDate).toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US')}</p></div>
                                <div><p className="text-[10px] font-bold text-gray-400 uppercase">{L('Tổng tiền', 'Total')}</p><p className="text-sm font-bold text-red-600">{money(p.totalAmount)}</p></div>
                            </div>
                            <IconChevronDown className={`!w-4 !h-4 text-gray-400 transition ${expanded === p._id ? 'rotate-180' : ''}`} />
                        </button>
                        {expanded === p._id && (
                            <div className="px-6 pb-5 border-t border-gray-100">
                                <table className="w-full text-sm mt-3">
                                    <thead>
                                        <tr className="text-xs text-gray-400 uppercase">
                                            <th className="text-left py-2">{L('Sản phẩm', 'Product')}</th>
                                            <th className="text-right py-2">{L('SL', 'Qty')}</th>
                                            <th className="text-right py-2">{L('Giá nhập', 'Unit cost')}</th>
                                            <th className="text-right py-2">{L('Thành tiền', 'Amount')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {p.items.map(it => (
                                            <tr key={it._id} className="border-t border-gray-50">
                                                <td className="py-2 text-gray-700">{it.name}</td>
                                                <td className="py-2 text-right">{it.quantity}</td>
                                                <td className="py-2 text-right">{money(it.importPrice)}</td>
                                                <td className="py-2 text-right font-medium">{money(it.quantity * it.importPrice)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {p.note && <p className="text-xs text-gray-500 mt-3">{L('Ghi chú', 'Note')}: {p.note}</p>}
                                <p className="text-xs text-gray-400 mt-1">{L('Người lập', 'Created by')}: {p.createdBy?.name || '—'}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
                    <div className="relative bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-800">{L('Tạo phiếu nhập hàng', 'New purchase receipt')}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><IconClose className="!w-5 !h-5" /></button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-5 text-left">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{L('Nhà cung cấp', 'Supplier')} *</label>
                                    <select className={inputCls} value={supplier} onChange={e => setSupplier(e.target.value)} required>
                                        <option value="">{L('-- Chọn nhà cung cấp --', '-- Select supplier --')}</option>
                                        {suppliers.filter(s => s.isActive).map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{L('Ngày nhập', 'Import date')}</label>
                                    <input type="date" className={inputCls} value={importDate} onChange={e => setImportDate(e.target.value)} />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-700">{L('Mặt hàng nhập (giá theo phiếu của NCC)', 'Items (price per supplier invoice)')}</label>
                                    <button type="button" onClick={() => setLines([...lines, emptyLine()])} className="text-sm text-green-600 hover:underline flex items-center gap-1">
                                        <IconPlus className="!w-3 !h-3" />{L('Thêm dòng', 'Add line')}
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <div className="hidden md:grid grid-cols-12 gap-2 text-[10px] font-bold text-gray-400 uppercase px-1">
                                        <span className="col-span-5">{L('Sản phẩm', 'Product')}</span>
                                        <span className="col-span-2">{L('Số lượng', 'Qty')}</span>
                                        <span className="col-span-2">{L('Giá nhập ($)', 'Unit cost ($)')}</span>
                                        <span className="col-span-2 text-right">{L('Thành tiền', 'Amount')}</span>
                                    </div>
                                    {lines.map((l, i) => (
                                        <div key={i} className="grid grid-cols-12 gap-2 items-center">
                                            <select className={`${inputCls} col-span-12 md:col-span-5`} value={l.product} onChange={e => pickProduct(i, e.target.value)}>
                                                <option value="">{L('-- Chọn sản phẩm --', '-- Select product --')}</option>
                                                {products.map(p => <option key={p._id} value={p._id}>{p.stock <= 5 ? '⚠ ' : ''}{p.name} ({L('tồn', 'stock')}: {p.stock})</option>)}
                                            </select>
                                            <input type="number" min={1} step={1} className={`${inputCls} col-span-4 md:col-span-2`} value={l.quantity} onChange={e => updateLine(i, { quantity: e.target.value })} />
                                            <input type="number" min={0} step="0.01" className={`${inputCls} col-span-4 md:col-span-2`} value={l.importPrice} onChange={e => updateLine(i, { importPrice: e.target.value })} />
                                            <span className="col-span-3 md:col-span-2 text-right text-sm font-medium text-gray-700">{money((Number(l.quantity) || 0) * (Number(l.importPrice) || 0))}</span>
                                            <button type="button" disabled={lines.length === 1} onClick={() => setLines(lines.filter((_, idx) => idx !== i))} className="col-span-1 p-2 text-gray-400 hover:text-red-600 disabled:opacity-30">
                                                <IconTrash className="!w-4 !h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">{L('Ghi chú', 'Note')}</label>
                                <input className={inputCls} value={note} onChange={e => setNote(e.target.value)} />
                            </div>

                            <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                                <span className="text-sm text-gray-600">{L('Tổng tiền phiếu nhập', 'Receipt total')}</span>
                                <span className="text-lg font-bold text-red-600">{money(total)}</span>
                            </div>
                            <p className="text-xs text-gray-400">{L('Khi lưu: tồn kho được cộng thêm, giá vốn sản phẩm được tính lại theo bình quân gia quyền, và tiền nhập được trừ vào doanh thu ở Dashboard.', 'On save: stock is increased, product cost is recalculated (weighted average) and the amount is deducted from revenue on the Dashboard.')}</p>

                            {error && <p className="text-sm text-red-500">{error}</p>}

                            <div className="flex gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-gray-300 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">{L('Hủy', 'Cancel')}</button>
                                <button type="submit" disabled={saving} className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 disabled:opacity-60">
                                    {saving ? '...' : L('Lưu phiếu nhập', 'Save receipt')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminPurchases
