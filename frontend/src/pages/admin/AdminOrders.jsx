import { useState, useEffect } from "react"
import { IconSearch } from "../../components/icons"
import { useSelector } from "react-redux"
import axios from "axios"
import { IconChevronDown } from '../../components/icons/index'

const API = import.meta.env.VITE_API_URL

const statusOption = [
    {
        value: 'pending',
        label: 'Pending',
        color: 'bg-yellow-100 text-yellow-700',
    },
    {
        value: 'processing',
        label: 'Processing',
        color: 'bg-blue-100 text-blue-700',
    },
    {
        value: 'shipping',
        label: 'Shipping',
        color: 'bg-purple-100 text-purple-700',
    },
    {
        value: 'delivered',
        label: 'Delivered',
        color: 'bg-green-100 text-green-700',
    },
    {
        value: 'cancelled',
        label: 'Cancelled',
        color: 'bg-red-100 text-red-700',
    },
]

const AdminOrders = () => {
    const { userInfo } = useSelector(state => state.auth)
    const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } }
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
                console.log(err)
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
    }, [])

    const handleStatusChange = async (orderID, newStatus) => {
        try {
            await axios.put(`${API}/admin/orders/${orderID}`, { orderStatus: newStatus }, config)
            setOrders(orders.map(o => o._id === orderID ? { ...o, orderStatus: newStatus } : o))
        } catch (err) {
            console.error(err)
        }
    }

    const filtered = orders.filter(o => {
        const matchSearch = o._id.includes(search) || o.user?.name?.toLowerCase().includes(search.toLowerCase())
        const matchStatus = filterStatus ? o.orderStatus === filterStatus : true
        return matchSearch && matchStatus
    })

    const getStatus = (value) => statusOption.find(s => s.value === value) || statusOption[0]

    return (
        <div className="p-8">
            <div className="mb-8 text-left">
                <h1 className="text-2xl font-bold text-gray-800">Manage Orders</h1>
                <p className="text-gray-500 text-sm mt-1">Total: {orders?.length} orders</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1 max-w-sm">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <IconSearch className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search By Order ID Or Customer Name..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-e-gray-500"
                    />
                </div>
                <div className="relative">
                    <select
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                        className="appearance-none w-50 px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-green-500 text-gray-700"
                    >
                        <option value="">All status</option>
                        {statusOption?.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                    <div className='absolute z-50  top-3 right-4 flex items-center pointer-events-none text-gray-500'>
                        <IconChevronDown className='!w-4 !h-4' />
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                {loading ? (
                    [...Array(5)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse h-20"></div>
                    ))
                ) : filtered.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
                        No orders found
                    </div>
                ) : (
                    filtered.map(order => {
                        const status = getStatus(order.orderStatus)
                        const isExpanded = expandedOrder === order._id
                        return (
                            <div key={order._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                                <div
                                    className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition"
                                    onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                                >
                                    <div className="flex items-center gap-4 text-left px-1 py-1">
                                        <div className="me-20 ">
                                            <p className="text-xs text-gray-400 !mb-2">Order ID</p>
                                            <p className="font-mono text-sm font-medium">#{order._id.slice(-8).toUpperCase()}</p>
                                        </div>
                                        <div className="me-20 ">
                                            <p className="text-xs text-gray-400 !mb-2">Customer</p>
                                            <p className="font-mono text-sm font-medium">{order.user?.name}</p>
                                        </div>
                                        <div className="me-20 ">
                                            <p className="text-xs text-gray-400 !mb-2">Total Amount</p>
                                            <p className="font-mono text-sm font-medium">${order.totalPrice.toLocaleString('en-US')}</p>
                                        </div>
                                        <div className="me-20 ">
                                            <p className="text-xs text-gray-400 !mb-2">Order Date</p>
                                            <p className="font-mono text-sm font-medium">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.color}`}>
                                            {status.label}
                                        </span>
                                        <IconChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />

                                    </div>
                                </div>


                                {isExpanded && (
                                    <div className="border-t border-gray-100">
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div>
                                                <div className="space-y-2">

                                                    {order.items.map((item, i) => (
                                                        <div key={i} className="flex items-center gap-3 ">
                                                            <img
                                                                src={item.image || 'https://placehold.co/40x40/e8f5e9/2e7d32?text=GL'}
                                                                alt={item.name}
                                                                className="!w-50 !h-50 object-cover rounded-lg ms-4 mb-4 mt-4"
                                                            />
                                                            <div className="flex-1 min-w-0 text-left ms-5 ">
                                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide !mb-3">Product</p>
                                                                <p className="text-sm text-gray-700 line-clamp-1 !mb-3">{item.name}</p>
                                                                <p className="text-xs text-gray-400 !mb-2">Quantity: {item.quantity}</p>
                                                                <p className="text-xs text-gray-400">Price: ${item.price}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-center mt-4">
                                                <div className="text-left">
                                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-4 !ms-1 !mb-2">Shipping</p>
                                                    <div className="text-sm text-gray-600 space-y-1">
                                                        <p className="!mb-2 !ms-1">Recipient's Full Name:  <span className="font-medium">{order.shippingAddress?.fullname}</span></p>
                                                        <p className="!mb-2 !ms-1">Phone Number: <span className="font-medium">{order.shippingAddress?.phone}</span></p>
                                                        <p className="!mb-2 !ms-1">Recipient's Address: <span className="font-medium">{order.shippingAddress?.address}</span></p>
                                                        <p className="!mb-2 !ms-1">Country: <span className="font-medium">{order.shippingAddress?.city}</span></p>
                                                    </div>
                                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide !mb-2 !ms-1">Update Status</p>
                                                    <div className="relative">
                                                        <select
                                                            value={order.orderStatus}
                                                            onChange={e => handleStatusChange(order._id, e.target.value)}
                                                            className="appearance-none w-50 !px-4 !py-2.5 !mb-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-green-500"
                                                        >
                                                            {statusOption.map(s => (
                                                                <option key={s.value} value={s.value}>{s.label}</option>
                                                            ))}
                                                        </select>

                                                        <div className='absolute z-50  top-3 right-4 flex items-center pointer-events-none text-gray-500'>
                                                            <IconChevronDown className='!w-4 !h-4' />
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