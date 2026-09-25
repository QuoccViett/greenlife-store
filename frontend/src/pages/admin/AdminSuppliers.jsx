import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useLang } from '../../context/LangContext'
import { IconPen, IconPlus, IconTrash, IconClose, IconTruck } from '../../components/icons'
import AdminFilter from '../../components/admin/AdminFilter'
import StatCard from '../../components/admin/StatCard'

const API = import.meta.env.VITE_API_URL
const emptyForm = { name: '', phone: '', email: '', address: '', note: '', isActive: true }
const money = n => `$${(n || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`

const AdminSuppliers = () => {
    const { lang } = useLang()
    const L = (vi, en) => (lang === 'vi' ? vi : en)
    const { userInfo } = useSelector(state => state.auth)
    const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } }

    const [suppliers, setSuppliers] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState(emptyForm)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    const fetchSuppliers = async () => {
        try {
            const { data } = await axios.get(`${API}/suppliers`, config)
            setSuppliers(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { if (userInfo) fetchSuppliers() }, [userInfo])

    const openCreate = () => { setEditing(null); setForm(emptyForm); setError(''); setShowModal(true) }
    const openEdit = s => {
        setEditing(s)
        setForm({ name: s.name, phone: s.phone || '', email: s.email || '', address: s.address || '', note: s.note || '', isActive: s.isActive })
        setError('')
        setShowModal(true)
    }

    const handleSave = async e => {
        e.preventDefault()
        setSaving(true)
        setError('')
        try {
            if (editing) await axios.put(`${API}/suppliers/${editing._id}`, form, config)
            else await axios.post(`${API}/suppliers`, form, config)
            setShowModal(false)
            fetchSuppliers()
        } catch (err) {
            setError(err.response?.data?.message || err.message)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async s => {
        if (!window.confirm(L(`Xóa nhà cung cấp "${s.name}"?`, `Delete supplier "${s.name}"?`))) return
        try {
            await axios.delete(`${API}/suppliers/${s._id}`, config)
            fetchSuppliers()
        } catch (err) {
            window.alert(err.response?.data?.message || err.message)
        }
    }

    const filtered = suppliers.filter(s =>
        `${s.name} ${s.phone || ''} ${s.email || ''}`.toLowerCase().includes(search.toLowerCase())
    )

    const inputCls = 'w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:border-green-500 outline-none'

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div className="text-left">
                    <h1 className="text-2xl font-bold text-gray-800">{L('Nhà cung cấp', 'Suppliers')}</h1>
                    <p className="text-gray-500 text-sm mt-1">{L(`Tổng: ${suppliers.length} nhà cung cấp`, `Total: ${suppliers.length} suppliers`)}</p>
                </div>
                <button onClick={openCreate} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-green-700 transition">
                    <IconPlus className="!w-4 !h-4" />
                    {L('Thêm nhà cung cấp', 'Add supplier')}
                </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <StatCard color="bg-green-600" icon={<IconTruck className="!w-5 !h-5 text-white" />} label={L('Đang hợp tác', 'Active suppliers')} value={suppliers.filter(s => s.isActive).length} sub={L(`${suppliers.length} nhà cung cấp`, `${suppliers.length} suppliers`)} />
                <StatCard color="bg-blue-500" icon={<IconTruck className="!w-5 !h-5 text-white" />} label={L('Tổng số phiếu nhập', 'Total receipts')} value={suppliers.reduce((s, x) => s + (x.purchaseCount || 0), 0)} />
                <StatCard color="bg-red-500" icon={<IconTruck className="!w-5 !h-5 text-white" />} label={L('Tổng tiền đã nhập', 'Total purchased')} value={money(suppliers.reduce((s, x) => s + (x.totalPurchased || 0), 0))} />
            </div>

            <AdminFilter
                search={search}
                onSearch={setSearch}
                searchPlaceholder={L('Tìm theo tên, SĐT, email...', 'Search name, phone, email...')}
                showReset={!!search}
                onReset={() => setSearch('')}
            />

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden text-left">
                {loading ? (
                    <div className="p-6 space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}</div>
                ) : filtered.length === 0 ? (
                    <p className="text-center text-gray-400 py-10">{L('Chưa có nhà cung cấp', 'No suppliers yet')}</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    {[L('Nhà cung cấp', 'Supplier'), L('Liên hệ', 'Contact'), L('Số phiếu nhập', 'Receipts'), L('Tổng tiền đã nhập', 'Total purchased'), L('Trạng thái', 'Status'), ''].map((h, i) => (
                                        <th key={i} className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map(s => (
                                    <tr key={s._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-800">{s.name}</p>
                                            {s.address && <p className="text-xs text-gray-500">{s.address}</p>}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 text-xs">
                                            <p>{s.phone || '—'}</p>
                                            <p>{s.email || ''}</p>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">{s.purchaseCount}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-800">{money(s.totalPurchased)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${s.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                {s.isActive ? L('Đang hợp tác', 'Active') : L('Ngừng hợp tác', 'Inactive')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => openEdit(s)} className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg"><IconPen className="!w-4 !h-4" /></button>
                                                <button onClick={() => handleDelete(s)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><IconTrash className="!w-4 !h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
                    <div className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-800">{editing ? L('Sửa nhà cung cấp', 'Edit supplier') : L('Thêm nhà cung cấp', 'Add supplier')}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><IconClose className="!w-5 !h-5" /></button>
                        </div>
                        <form onSubmit={handleSave} className="space-y-4 text-left">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">{L('Tên nhà cung cấp', 'Supplier name')} *</label>
                                <input className={inputCls} required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{L('Số điện thoại', 'Phone')}</label>
                                    <input className={inputCls} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                                    <input type="email" className={inputCls} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">{L('Địa chỉ', 'Address')}</label>
                                <input className={inputCls} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">{L('Ghi chú', 'Note')}</label>
                                <textarea rows={2} className={`${inputCls} resize-none`} value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
                            </div>
                            {editing && (
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="accent-green-600 w-4 h-4" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />
                                    <span className="text-sm text-gray-700">{L('Đang hợp tác', 'Active')}</span>
                                </label>
                            )}
                            {error && <p className="text-sm text-red-500">{error}</p>}
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-gray-300 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">{L('Hủy', 'Cancel')}</button>
                                <button type="submit" disabled={saving} className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 disabled:opacity-60">
                                    {saving ? '...' : editing ? L('Cập nhật', 'Update') : L('Tạo mới', 'Create')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminSuppliers
