import { useState, useEffect, useMemo } from "react"
import { useSelector } from "react-redux"
import axios from "axios"
import { IconSearch, IconChevronDown } from "../../components/icons"
import { useLang } from '../../context/LangContext'
import AdminFilter from '../../components/admin/AdminFilter'

const API = import.meta.env.VITE_API_URL

const statusOptionsBase = [
    { value: 'pending', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'processing', color: 'bg-blue-100 text-blue-700' },
    { value: 'shipping', color: 'bg-purple-100 text-purple-700' },
    { value: 'delivered', color: 'bg-green-100 text-green-700' },
    { value: 'cancelled', color: 'bg-red-100 text-red-700' },
]

const AdminOrders = () => {
    const { userInfo } = useSelector(state => state.auth)
    const { t } = useLang()
    const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } }
    const [dateFrom, setDateFrom] = useState('')
    const [dateTo, setDateTo] = useState('')
    const [filterPayment, setFilterPayment] = useState('')
    const [advStats, setAdvStats] = useState(null)
    const [orders, setOrders] = useState([])
    const [search, setSearch] = useState('')
    const [filterStatus, setFilterStatus] = useState('')
    const [loading, setLoading] = useState(true)
    const [expandedOrder, setExpandedOrder] = useState(null)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await axios.get(`${API}/admin/orders`, config)
                setOrders(data)
            } catch (err) {
                console.error("Fetch orders failed:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
    }, [orders.orderStatus])

    const fetchAdvancedStats = async () => {
        try {
            const params = new URLSearchParams()
            if (dateFrom) params.append('startDate', dateFrom)
            if (dateTo) params.append('endDate', dateTo)
            if (filterStatus) params.append('orderStatus', filterStatus)
            if (filterPayment) params.append('paymentStatus', filterPayment)
            const { data } = await axios.get(`${API}/admin/stats/advanced?${params}`, config)
            setAdvStats(data)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        fetchAdvancedStats()
    }, [dateFrom, dateTo, filterStatus, filterPayment])

    const handleStatusChange = async (orderID, newStatus) => {
        try {
            await axios.put(`${API}/admin/orders/${orderID}`, { orderStatus: newStatus }, config)
            setOrders(orders.map(o => o._id === orderID ? { ...o, orderStatus: newStatus } : o))
        } catch (err) {
            console.error("Update status failed:", err)
        }
    }

    // Use memoization for performance on larger lists
    const filteredOrders = useMemo(() => {
        return orders.filter(o => {
            const searchTerm = search.toLowerCase()
            const matchSearch =
                o._id?.toLowerCase().includes(searchTerm) ||
                o.user?.name?.toLowerCase().includes(searchTerm)

            const matchStatus = filterStatus ? o.orderStatus === filterStatus : true
            const matchPayment = filterPayment ? o.paymentStatus === filterPayment : true

            const orderDate = new Date(o.createdAt)
            const matchDateFrom = dateFrom ? orderDate >= new Date(dateFrom) : true
            const matchDateTo = dateTo ? orderDate <= new Date(new Date(dateTo).setHours(23, 59, 59, 999)) : true

            return matchSearch && matchStatus && matchPayment && matchDateFrom && matchDateTo
        })
    }, [orders, search, filterStatus, filterPayment, dateFrom, dateTo])

    const getStatusDetails = (value) => statusOptions.find(s => s.value === value) || statusOptions[0]

    const statusOptions = statusOptionsBase.map(s => ({ ...s, label: t(`admin.status.${s.value}`) }))

    return (
        <div className="p-8">
            <div className="mb-8 text-left">
                <h1 className="text-2xl font-bold text-gray-800">{t('admin.orders.title')}</h1>
                <p className="text-gray-500 text-sm mt-1">{t('admin.orders.total', { count: orders?.length })}</p>
                {/* Stats cards */}
                {advStats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {[
                            { label: 'Tổng đơn', value: advStats.totalOrders, color: 'bg-blue-50 text-blue-700' },
                            { label: 'Tổng doanh thu', value: `$${advStats.totalRevenue.toLocaleString('en-US')}`, color: 'bg-green-50 text-green-700' },
                            { label: 'Đã thanh toán', value: `$${advStats.revenueByStatus.paid.toLocaleString('en-US')}`, color: 'bg-purple-50 text-purple-700' },
                            { label: 'Tổng tiền đơn đã hủy', value: `$${advStats.revenueByStatus?.cancelled.toLocaleString('en-US')}`, color: 'bg-red-50 text-red-700' },
                        ].map((s, i) => (
                            <div key={i} className={`rounded-2xl p-4 ${s.color}`}>
                                <p className="text-2xl font-bold">{s.value}</p>
                                <p className="text-xs font-medium mt-0.5 opacity-80">{s.label}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Thống kê theo trạng thái đơn */}
                {advStats && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
                        <p className="text-sm font-semibold text-gray-700 !mb-3">Số đơn theo trạng thái</p>
                        <div className="flex flex-wrap gap-3">
                            {Object.entries(advStats.byOrderStatus).map(([status, count]) => {
                                const s = statusOptions.find(o => o.value === status)
                                return (
                                    <span key={status} className={`px-3 py-1.5 rounded-full text-xs font-medium ${s?.color || 'bg-gray-100 text-gray-600'}`}>
                                        {s?.label || status}: <strong>{count}</strong>
                                    </span>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>

            <AdminFilter
                search={search}
                onSearch={setSearch}
                searchPlaceholder="Search by order ID or customer name..."
                dateFrom={dateFrom}
                dateTo={dateTo}
                onDateFrom={setDateFrom}
                onDateTo={setDateTo}
                dropdowns={[
                    {
                        value: filterStatus,
                        onChange: setFilterStatus,
                        placeholder: 'All Order Status',
                        options: statusOptions.map(s => ({ value: s.value, label: s.label }))
                    },
                    {
                        value: filterPayment,
                        onChange: setFilterPayment,
                        placeholder: 'All Payment Status',
                        options: [
                            { value: 'pending', label: 'Unpaid' },
                            { value: 'paid', label: 'Paid' },
                            { value: 'failed', label: 'Failed' },
                        ]
                    }
                ]}
                showReset={!!(search || dateFrom || dateTo || filterStatus || filterPayment)}
                onReset={() => {
                    setSearch('')
                    setDateFrom('')
                    setDateTo('')
                    setFilterStatus('')
                    setFilterPayment('')
                }}
            />
            <div className="space-y-3">
                {loading ? (
                    [...Array(5)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse h-24"></div>
                    ))
                ) : filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
                        {t('admin.orders.none')}
                    </div>
                ) : (
                    filteredOrders.map(order => {
                        const status = getStatusDetails(order.orderStatus)
                        const isExpanded = expandedOrder === order._id
                        return (
                            <div key={order._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                                <div
                                    className="flex items-center p-5 cursor-pointer hover:bg-gray-50 transition gap-4"
                                    onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                                >
                                    {/* Chia làm 5 cột đều nhau */}
                                    <div className="grid grid-cols-5 gap-4 text-left flex-1 items-center">
                                        {/* Cột 1: ID */}
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">{t('admin.table.order_id')}</p>
                                            <p className="font-mono text-sm font-medium text-gray-700">#{order._id.slice(-8).toUpperCase()}</p>
                                        </div>

                                        {/* Cột 2: Khách hàng */}
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">{t('admin.table.customer')}</p>
                                            <p className="text-sm font-medium text-gray-700 truncate">{order.user?.name || 'Guest'}</p>
                                        </div>

                                        {/* Cột 3: Tổng tiền */}
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">{t('admin.table.total')}</p>
                                            <p className="text-sm font-bold text-green-600">${order.totalPrice.toLocaleString('en-US')}</p>
                                        </div>

                                        {/* Cột 4: Ngày tháng */}
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">{t('admin.table.date')}</p>
                                            <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString('en-US')}</p>
                                        </div>

                                        {/* Cột 5: Trạng thái (Nằm trong Grid để cố định vị trí) */}
                                        <div className="flex justify-end">
                                            <span className={`text-[10px] uppercase font-bold px-3 py-1 rounded-full whitespace-nowrap ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Icon mũi tên tách biệt hoàn toàn ở cuối */}
                                    <div className="flex-shrink-0">
                                        <IconChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="border-t border-gray-100 bg-gray-50/50 p-6">
                                        <div className="grid md:grid-cols-2 gap-8">
                                            {/* Items List */}
                                            <div className="space-y-4">
                                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('admin.orders.items_title')}</h3>
                                                {order.items.map((item, i) => (
                                                    <div key={i} className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100">
                                                        <img
                                                            src={item.image || 'https://placehold.co/60x60/f3f4f6/9ca3af?text=Product'}
                                                            alt={item.name}
                                                            className="w-16 h-16 object-cover rounded-lg"
                                                        />
                                                        <div className="flex-1 text-left">
                                                            <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                                                            <p className="text-xs text-gray-500">{t('admin.orders.item_qty', { qty: item.quantity, price: item.price })}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Shipping & Actions */}
                                            <div className="text-left space-y-6">
                                                <div>
                                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{t('admin.orders.shipping_address')}</h3>
                                                    <div className="text-sm text-gray-600 bg-white p-4 rounded-xl border border-gray-100 space-y-1">
                                                        <p className="font-bold text-gray-800">{order.shippingAddress?.fullname}</p>
                                                        <p>{order.shippingAddress?.phone}</p>
                                                        <p>{order.shippingAddress?.address}</p>
                                                        <p>{order.shippingAddress?.city}, {order.shippingAddress?.country || 'N/A'}</p>
                                                    </div>
                                                </div>

                                                {/* Thêm trạng thái thanh toán */}
                                                <div className="flex items-center gap-2 mb-4">
                                                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Thanh toán:</p>
                                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700'
                                                        : order.paymentStatus === 'failed' ? 'bg-red-100 text-red-600'
                                                            : 'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {order.paymentStatus === 'paid' ? 'Đã thanh toán'
                                                            : order.paymentStatus === 'failed' ? 'Thất bại'
                                                                : 'Chưa thanh toán'}
                                                    </span>
                                                </div>

                                                <div>
                                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{t('admin.orders.update_status')}</h3>
                                                    <div className="relative max-w-[200px]">
                                                        <select
                                                            value={order.orderStatus}
                                                            onChange={e => handleStatusChange(order._id, e.target.value)}
                                                            className="appearance-none w-full px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-green-500 bg-white"
                                                        >
                                                            {statusOptions.map(s => (
                                                                <option key={s.value} value={s.value}>{s.label}</option>
                                                            ))}
                                                        </select>
                                                        <div className='absolute top-2.5 right-3 pointer-events-none text-gray-500'>
                                                            <IconChevronDown className='w-4 h-4' />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}

export default AdminOrders