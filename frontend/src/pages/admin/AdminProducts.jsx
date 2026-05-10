import { useEffect, useState } from "react"
import { IconCheck, IconClose, IconPen, IconPlus, IconSearch, IconTrash, IconChevronDown } from "../../components/icons"
import axios from "axios"
import { useSelector } from "react-redux"
import { useLang } from '../../context/LangContext'

const API = import.meta.env.VITE_API_URL

const AdminProducts = () => {
    const { userInfo } = useSelector(state => state.auth)
    const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } }

    const { t } = useLang()
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [editProduct, setEditProduct] = useState(null)
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        salePrice: '',
        stock: '',
        image: '',
        category: '',
        isFeatured: false
    })
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetchProducts()
        fetchCategories()
    }, [])

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get(`${API}/products`)
            setProducts(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get(`${API}/categories`)
            setCategories(data)
        } catch (err) {
            console.log(err)
        }
    }

    const openCreate = () => {
        setEditProduct(null)
        setForm({ name: '', description: '', price: '', salePrice: '', stock: '', image: '', category: '', isFeatured: false })
        setShowModal(true)
    }

    const openEdit = (product) => {
        setEditProduct(product)
        setForm({
            name: product.name,
            description: product.description || '',
            price: product.price,
            salePrice: product.salePrice || '',
            stock: product.stock,
            image: product.image || '',
            category: product.category?._id || '',
            isFeatured: product.isFeatured || false,
        })
        setShowModal(true)
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return
        try {
            await axios.delete(`${API}/products/${id}`, config)
            setProducts(products.filter(p => p._id !== id))
        } catch (err) {
            console.error(err)
        }
    }

    const handleSave = async e => {
        e.preventDefault()
        setSaving(true)
        try {
            const payload = {
                ...form,
                price: Number(form.price),
                salePrice: form.salePrice ? Number(form.salePrice) : null,
                stock: Number(form.stock),
            }

            if (editProduct) {
                await axios.put(`${API}/products/${editProduct._id}`, payload, config)
            } else {
                await axios.post(`${API}/products`, payload, config)
            }
            setShowModal(false)
            fetchProducts()
        } catch (err) {
            console.error("ERROR:", err.response?.data || err.message)
        } finally {
            setSaving(false)
        }
    }

    const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{t('admin.products.title')}</h1>
                    <p className="text-gray-500 text-sm mt-1 text-left">{t('admin.products.total', {count: products.length})}</p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-green-700 transition"
                >
                    <IconPlus className="!w-4 !h-4" />
                    {t('admin.products.add')}
                </button>
            </div>

            <div className="relative mb-6 max-w-sm">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <IconSearch className="w-4 h-4 text-gray-400" />
                </div>
                <input type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder={t('admin.products.search_placeholder')}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:border-green-500 transition"
                />
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden text-left">
                {loading ? (
                    <div className="p-6 space-y-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">{t('admin.products.table.product')}</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">{t('admin.products.table.category')}</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">{t('admin.products.table.price')}</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">{t('admin.products.table.stock')}</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">{t('admin.products.table.featured')}</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">{t('admin.products.table.actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map(product => (
                                    <tr key={product._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={product.image || 'https://placehold.co/48x48/e8f5e9/2e7d32?text=GL'}
                                                    alt={product.name}
                                                    className="w-12 h-12 object-cover rounded-lg shrink-0"
                                                />
                                                <div>
                                                    <p className="font-medium text-gray-800">{product.name}</p>
                                                    <p className="text-xs text-gray-500">{t('admin.products.items_sold', {count: product.sold || 0})}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {product.category?.name || 'Uncategorized'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {product.salePrice ? (
                                                <div>
                                                    <p className='font-semibold text-green-700'>${product.salePrice}</p>
                                                    <p className='text-xs text-gray-400 line-through'>${product.price}</p>
                                                </div>
                                            ) : (
                                                <p className="font-semibold text-gray-700">${product.price}</p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full
                                                ${product.stock > 10 ? 'bg-green-100 text-green-700'
                                                : product.stock > 0 ? 'bg-yellow-100 text-yellow-700'
                                                : 'bg-red-100 text-red-600'}`}>
                                                {product.stock > 0 ? `${product.stock} ${t('admin.products.in_stock')}` : t('admin.products.out_of_stock')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {product.isFeatured ? (
                                                <IconCheck className="!w-4 !h-4 text-green-600" />
                                            ) : (
                                                <IconClose className="!w-4 !h-4 text-gray-300" />
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => openEdit(product)} className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg">
                                                    <IconPen className="!w-4 !h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(product._id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                                    <IconTrash className="!w-4 !h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)}></div>
                    <div className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-800">
                                {editProduct ? t('admin.products.edit') : t('admin.products.add')}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <IconClose className="!w-5 !h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-4 text-left">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('admin.products.form.name')} *</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    required
                                    placeholder={t('admin.products.form.name_placeholder')}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:border-green-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('admin.products.form.description')}</label>
                                <textarea
                                    value={form.description}
                                    rows={3}
                                    placeholder={t('admin.products.form.description_placeholder')}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:border-green-500 outline-none resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('admin.products.table.price')} ($) *</label>
                                    <input
                                        type="number"
                                        value={form.price}
                                        required
                                        min={0}
                                        step="0.01"
                                        onChange={e => setForm({ ...form, price: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Sale Price ($)</label>
                                    <input
                                        type="number"
                                        value={form.salePrice}
                                        min={0}
                                        step="0.01"
                                        onChange={e => setForm({ ...form, salePrice: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('admin.products.table.stock')} *</label>
                                    <input
                                        type="number"
                                        value={form.stock}
                                        required
                                        min={0}
                                        onChange={e => setForm({ ...form, stock: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none"
                                    />
                                </div>
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('admin.products.table.category')}</label>
                                    <select
                                        value={form.category}
                                        onChange={e => setForm({ ...form, category: e.target.value })}
                                        className="appearance-none w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none"
                                    >
                                        <option value=''>Select category</option>
                                        {categories.map(cat => (
                                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    <IconChevronDown className='absolute right-4 top-10 !w-4 !h-4 text-gray-500 pointer-events-none' />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL</label>
                                <input
                                    type="text"
                                    value={form.image}
                                    onChange={e => setForm({ ...form, image: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none"
                                />
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.isFeatured}
                                    onChange={e => setForm({ ...form, isFeatured: e.target.checked })}
                                    className="accent-green-600 w-4 h-4"
                                />
                                <span className="text-sm text-gray-700">{t('admin.products.table.featured')}</span>
                            </label>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 border border-gray-300 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50"
                                >
                                    {t('admin.products.form.cancel') || 'Cancel'}
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 disabled:opacity-60"
                                >
                                    {saving ? '...' : editProduct ? t('admin.products.update') || 'Update' : t('admin.products.create') || 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminProducts;