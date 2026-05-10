import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { IconUser, IconBox, IconShield, IconArrowRight, IconMail, IconMapPin, IconPhone } from '../components/icons/index'
import { useEffect, useState } from 'react'
import { setCredentials, logout } from '../store/authSlice'
import { clearCart } from '../store/cartSlice'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

const menu = [
    { key: 'profile', label: 'Personal Information', icon: IconUser },
    { key: 'orders', label: 'My Orders', icon: IconBox },
]

const ProfilePage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { userInfo } = useSelector(state => state.auth)

    const [tab, setTab] = useState('profile')
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        name: userInfo?.name || '',
        phone: userInfo?.phone || '',
        address: userInfo?.address || '',
    })

    useEffect(() => {
        setForm({
            name: userInfo?.name || '',
            phone: userInfo?.phone || '',
            address: userInfo?.address || '',
        })
    }, [userInfo])

    const handleLogout = () => {
        dispatch(logout())
        dispatch(clearCart())
        navigate('/')
    }

    const handleUpdate = async e => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } }
            const { data } = await axios.put(`${API}/auth/profile`, form, config)
            dispatch(setCredentials({ ...userInfo, ...data }))
            setSuccess('Profile updated successfully!')
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-sm">
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-green-100">
                                    <IconUser className='!w-8 !h-8 text-green-600' />
                                </div>
                                <p className='font-bold text-gray-800 text-lg'>{userInfo?.name}</p>
                                <p className='text-xs text-gray-400 mt-1'>{userInfo?.email}</p>
                                {userInfo?.role === 'admin' && (
                                    <span className='inline-block mt-3 bg-green-100 text-green-700 text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full'>
                                        Administrator
                                    </span>
                                )}
                            </div>

                            <nav className='space-y-1.5'>
                                {menu?.map(item => (
                                    <button
                                        key={item.key}
                                        onClick={() => setTab(item.key)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all
                                                ${tab === item.key
                                                ? 'bg-green-600 text-white font-semibold shadow-md shadow-green-100'
                                                : 'text-gray-500 hover:bg-gray-50 hover:text-green-600'
                                            }`}
                                    >
                                        <item.icon className="!w-4 !h-4" />
                                        <span>{item.label}</span>
                                    </button>
                                ))}

                                {userInfo?.role === 'admin' && (
                                    <Link
                                        to={'/admin'}
                                        className='w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-500 hover:bg-gray-50 hover:text-green-600 transition-all'
                                    >
                                        <IconShield className='w-4 h-4' />
                                        <span>Admin Dashboard</span>
                                    </Link>
                                )}

                                <div className="pt-4 mt-4 border-t border-gray-100">
                                    <button
                                        onClick={handleLogout}
                                        className='w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-all'
                                    >
                                        <IconArrowRight className='!w-4 !h-4' />
                                        <span className='font-medium'>Sign Out</span>
                                    </button>
                                </div>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className='lg:col-span-3'>
                        {tab === 'profile' && (
                            <div className='bg-white rounded-2xl border border-gray-100 p-8 shadow-sm'>
                                <div className="mb-8">
                                    <h2 className='text-xl font-bold text-gray-800'>Account Settings</h2>
                                    <p className='text-sm text-gray-400 mt-1'>Update your personal details and contact information.</p>
                                </div>

                                {success && (
                                    <div className='bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl mb-6 flex items-center gap-2'>
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                        {success}
                                    </div>
                                )}

                                {error && (
                                    <div className='bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-6'>
                                        {error}
                                    </div>
                                )}

                                <form className='space-y-6' onSubmit={handleUpdate}>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className='space-y-2 text-left'>
                                            <label className='text-sm font-semibold text-gray-700 ml-1'>Email Address</label>
                                            <div className='relative'>
                                                <div className='absolute inset-y-0 left-3 flex items-center pointer-events-none'>
                                                    <IconMail className='!w-4 !h-4 text-gray-400' />
                                                </div>
                                                <input
                                                    type='email'
                                                    value={userInfo?.email}
                                                    disabled
                                                    className='w-full pl-10 pr-4 py-3 border border-gray-100 rounded-xl text-sm bg-gray-50 text-gray-400 cursor-not-allowed italic mt-1'
                                                />
                                            </div>
                                            <p className='text-[11px] text-gray-400 ml-1 italic'>* Email cannot be modified</p>
                                        </div>

                                        <div className='space-y-2 text-left'>
                                            <label className='text-sm font-semibold text-gray-700 ml-1'>Full Name</label>
                                            <div className='relative'>
                                                <div className='absolute inset-y-0 left-3 flex items-center pointer-events-none'>
                                                    <IconUser className='!w-4 !h-4 text-gray-400' />
                                                </div>
                                                <input
                                                    type='text'
                                                    name='name'
                                                    value={form?.name}
                                                    onChange={handleChange}
                                                    placeholder='Enter your full name'
                                                    className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none mt-1'
                                                />
                                            </div>
                                        </div>

                                        <div className='space-y-2 text-left'>
                                            <label className='text-sm font-semibold text-gray-700 ml-1'>Phone Number</label>
                                            <div className='relative'>
                                                <div className='absolute inset-y-0 left-3 flex items-center pointer-events-none'>
                                                    <IconPhone className='!w-4 !h-4 text-gray-400' />
                                                </div>
                                                <input
                                                    type='tel'
                                                    name='phone'
                                                    value={form?.phone}
                                                    onChange={handleChange}
                                                    placeholder='Enter your phone number'
                                                    className='mt-1 w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none'
                                                />
                                            </div>
                                        </div>

                                        <div className='space-y-2 text-left'>
                                            <label className='text-sm font-semibold text-gray-700 ml-1'>Shipping Address</label>
                                            <div className='relative'>
                                                <div className='absolute inset-y-0 left-3 flex items-center pointer-events-none'>
                                                    <IconMapPin className='!w-4 !h-4 text-gray-400' />
                                                </div>
                                                <input
                                                    type='text'
                                                    name='address'
                                                    value={form?.address}
                                                    onChange={handleChange}
                                                    placeholder='Enter your detailed address'
                                                    className='mt-1 w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none'
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-50 flex justify-center">
                                        <button
                                            type='submit'
                                            disabled={loading}
                                            className='bg-green-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-green-700 disabled:opacity-60 transition-all shadow-lg shadow-green-100'
                                        >
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {tab === 'orders' && (
                            <OrdersTab userInfo={userInfo} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

const OrdersTab = ({ userInfo }) => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } }
                const { data } = await axios.get(`${API}/orders/myorders`, config)
                setOrders(data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
    }, [userInfo.token])

    const statusLabel = {
        pending: { text: 'Pending', color: 'bg-yellow-50 text-yellow-600 border border-yellow-100' },
        processing: { text: 'Processing', color: 'bg-blue-50 text-blue-600 border border-blue-100' },
        shipping: { text: 'Shipping', color: 'bg-purple-50 text-purple-600 border border-purple-100' },
        delivered: { text: 'Delivered', color: 'bg-green-50 text-green-600 border border-green-100' },
        cancelled: { text: 'Cancelled', color: 'bg-red-50 text-red-600 border border-red-100' },
    }

    if (loading) return (
        <div className='bg-white rounded-2xl border border-gray-100 p-8'>
            <div className='space-y-4 animate-pulse'>
                {[...Array(3)].map((_, i) => (
                    <div key={i} className='h-32 bg-gray-50 rounded-2xl'></div>
                ))}
            </div>
        </div>
    )

    if (orders.length === 0) return (
        <div className='bg-white rounded-2xl border border-gray-100 p-12 text-center'>
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <IconBox className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-gray-800 font-bold text-lg">No orders yet</h3>
            <p className="text-gray-400 text-sm mt-1">Looks like you haven't made any purchases yet.</p>
            <Link to="/products" className="inline-block mt-6 text-green-600 font-bold text-sm hover:underline">Start Shopping</Link>
        </div>
    )

    return (
        <div className='space-y-4'>
            {orders.map(order => {
                const status = statusLabel[order.orderStatus] || statusLabel.pending
                return (
                    <div key={order._id} className='bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow'>
                        <div className='flex flex-wrap items-center justify-between gap-4 mb-6'>
                            <div>
                                <p className='text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1'>Order ID</p>
                                <p className='text-sm font-mono font-bold text-gray-700'>#{order._id.slice(-8).toUpperCase()}</p>
                            </div>
                            <div className='flex items-center gap-4 text-right'>
                                <div className="hidden sm:block">
                                    <p className='text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1'>Date</p>
                                    <p className='text-xs text-gray-600 font-medium'>
                                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                                <span className={`text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-lg ${status.color}`}>
                                    {status.text}
                                </span>
                            </div>
                        </div>

                        <div className='space-y-3 mb-6'>
                            {order.items.map((item, i) => (
                                <div key={i} className='flex items-center gap-4 bg-gray-50/50 p-2 rounded-xl'>
                                    <img
                                        src={item.image || 'https://placehold.co/48x48/e8f5e9/2e7d32?text=GL'}
                                        alt={item.name}
                                        className='w-12 h-12 object-cover rounded-lg border border-white'
                                    />
                                    <div className='flex-1 min-w-0'>
                                        <p className='text-sm font-semibold text-gray-800 line-clamp-1'>{item.name}</p>
                                        <p className='text-xs text-gray-400 font-medium'>Qty: {item.quantity} • ${item.price.toLocaleString('en-US')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className='flex items-center justify-between border-t border-gray-50 pt-4'>
                            <div className='flex items-center gap-2'>
                                <span className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Payment:</span>
                                <span className='text-xs font-bold text-gray-600'>
                                    {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit Card'}
                                    <span className={`ml-2 px-2 py-0.5 rounded text-[9px] ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                        {order.isPaid ? 'PAID' : 'PENDING'}
                                    </span>
                                </span>
                            </div>
                            <div className='text-right'>
                                <span className='text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5'>Total Amount</span>
                                <p className='font-black text-green-700 text-lg'>${order.totalPrice.toLocaleString('en-US')}</p>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default ProfilePage;