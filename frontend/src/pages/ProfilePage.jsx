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
    const [loading, setLoading] = useState('')
    const [form, setForm] = useState({
        name: userInfo?.name || '',
        phone: userInfo?.phone || '',
        address: userInfo?.address || '',
    })


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
            const config = { headers: { Authrization: `Bearer ${userInfo.token}` } }
            const { data } = await axios.put(`${API}/auth/profile`, form, config)
            dispatch(setCredentials({ ...userInfo, ...data }))
            setSuccess('Information Updated Successfully!')
        } catch (err) {
            setError(err.response?.data?.message || 'Update Failed')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

    return (
        <div className="min-h-screen bg-gray-50">

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-4 gap-8">

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl !border-2 border-gray-100 p-6">

                            <div className="text-center mb-6">
                                <div className="bg-white rounded-2xl !border-2 border-gray-100 p-6">
                                    <IconUser className='!w-8 !h-8 text-green-600' />
                                </div>
                                <p className='font-semibold text-gray-800'>{userInfo?.name}</p>
                                <p className='text-xs text-gray-500 mt-0.5'>{userInfo?.email}</p>
                                {userInfo?.role === 'admin' && (
                                    <span className='inline-block mt-2 bg-green-100 text-green-700 text-xs font-medium px-2.5 py-0.5 rounded-full'>
                                        Admin
                                    </span>
                                )}
                            </div>

                            <nav className='space-y-1'>
                                {menu?.map(item => (
                                    <button
                                        key={item.key}
                                        onClick={() => setTab(item.key)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition
                                                ${tab === item.key
                                                ? 'bg-green-600 text-white font-medium'
                                                : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <item.icon className="!w-4 !h-4 me-2" />
                                        <span>{item.label}</span>
                                    </button>
                                ))}

                                {userInfo?.role === 'admin' && (
                                    <Link
                                        to={'/admin'}
                                        className='w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition'
                                    >
                                        <IconShield className='w-4 h-4' />
                                        <span>Admin Dashboard</span>
                                    </Link>
                                )}

                                <button
                                    onClick={handleLogout}
                                    className='w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition mt-4'
                                >
                                    <IconArrowRight className='!w-4 !h-4' />
                                    <span>Log Out</span>
                                </button>
                            </nav>
                        </div>
                    </div>

                    <div className='lg:col-span-3'>

                        {tab === 'profile' && (
                            <div className='bg-white rounded-2xl border border-gray-100 p-6'>
                                <h2 className='text-lg font-bold text-gray-800 !mb-6'>
                                    Personal Information
                                </h2>
                                {success && (
                                    <div className='bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg mb-5'>
                                        {success}
                                    </div>
                                )}

                                {error && (
                                    <div className='bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-5'>
                                        {error}
                                    </div>
                                )}

                                <form
                                    className='space-y-5'
                                    onSubmit={handleUpdate}
                                >
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2 ms-2 text-left'>Email</label>
                                        <div className='relative'>
                                            <div className='absolute inset-y-0 left-3 flex items-center pointer-events-none'>
                                                <IconMail className='!w-4 !h4 text-gray-400' />
                                            </div>
                                            <input
                                                type='email'
                                                value={userInfo?.email}
                                                disabled
                                                className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-500 cursor-not-allowed'
                                            />
                                        </div>
                                        <p className='text-xs text-gray-400 !ms-2 !mt-2 text-left'>Email cannot be changed</p>
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2 ms-2 text-left'>Full Name</label>
                                        <div className='relative'>
                                            <div className='absolute inset-y-0 left-3 flex items-center pointer-events-none'>
                                                <IconUser className='!w-4 !h4 text-gray-400' />
                                            </div>
                                            <input
                                                type='text'
                                                name='name'
                                                value={userInfo?.name}
                                                onChange={handleChange}
                                                placeholder='Enter Your Full Name'
                                                className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-500 focus:border-green-500 transition'
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2 ms-2 text-left'>Phone Number</label>
                                        <div className='relative'>
                                            <div className='absolute inset-y-0 left-3 flex items-center pointer-events-none'>
                                                <IconPhone className='!w-4 !h4 text-gray-400' />
                                            </div>
                                            <input
                                                type='tel'
                                                name='phone'
                                                value={userInfo?.phone}
                                                onChange={handleChange}
                                                placeholder='Enter Your Phone Name'
                                                className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-500 focus:border-green-500 transition'
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2 ms-2 text-left'>Email</label>
                                        <div className='relative'>
                                            <div className='absolute inset-y-0 left-3 flex items-center pointer-events-none'>
                                                <IconMapPin className='!w-4 !h4 text-gray-400' />
                                            </div>
                                            <input
                                                type='text'
                                                name='address'
                                                value={userInfo?.address}
                                                onChange={handleChange}
                                                placeholder='Enter Your Address'
                                                className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-500 focus:border-green-500 transition'
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type='submit'
                                        disabled={loading}
                                        className='bg-green-600 text-white px-6 py-3 !mt-1 rounded-xl font-semibold text-sm hover:bg-green-700 disabled:opacity-60'
                                    >
                                        {loading ? 'Saving...' : 'Save Change'}
                                    </button>
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

    const [orders, setOrders]  = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` }}
                const { data } = await axios.get(`${API}/orders/myorders`, config)
                setOrders(data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
    }, [])

    const statusLabel = {
        pending: {
            text: 'Pending',
            color: 'bg-yellow-100 text-yellow-700'
        },
        processing: {
            text: 'Processing',
            color: 'bg-blue-100 text-blue-700'
        },
        shipping: {
            text: 'Shipping',
            color: 'bg-purple-100 text-purple-700'
        },
        delivered: {
            text: 'Delivered',
            color: 'bg-green-100 text-green-700'
        },
        cancelled: {
            text: 'Cancelled',
            color: 'bg-red-100 text-red-700'
        },
    }

    if (loading) return (
        <div className='bg-white rounded-2xl border border-gray-100 p-6'>
            <div className='space-y-4 animate-pulse'>
                {[ ...Array(3)].map((_, i) => (
                    <div key={i} className='h-24 bg-gray-100 rounded-xl'></div>
                ))}
            </div>
        </div>
    )

    return (
        <div className='space-y-4'>
            {orders.map(order => {
                const status = statusLabel[order.orderStatus] || statusLabel.pending
                return (
                    <div key={order._id} className='bg-white rounded-2xl border border-gray-100 p-5'>
                        <div className='flex  items-center justify-between mb-4'> 
                            <div>
                                <p className='text-xs text-gray-400 !mb-1 text-left'>Order ID</p>
                                <p className='text-sm font-mono font-medium text-gray-700 text-left'>#{order._id.slice(-8).toUpperCase()}</p>
                            </div>
                            <div className='text-right'>
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.color}`}>
                                    {status.text}
                                </span>
                                <p className='text-xs text-gray-400 !mt-2'>
                                    {new Date(order.createdAt).toLocaleString('en-US')}
                                </p>
                            </div>
                        </div>

                        <div className='space-y-2 mb-4'>
                            {order.items.map((item, i) => (
                                <div key={i} className='flex items-center gap-3'>
                                    <img 
                                        src={item.image || 'https://placehold.co/48x48/e8f5e9/2e7d32?text=GL'}
                                        alt={item.name} 
                                        className='w-12 h-12 object-cover rounded-lg mb-1.5'
                                    />
                                    <div className='flex-1 min-w-0'>
                                        <p className='text-sm text-gray-700 line-clamp-1'>{item.name}</p>
                                        <p className='text-xs text-gray-400'>Amount: {item.quantity} Price: ${item.price.toLocaleString('en-US')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className='flex items-center justify-between border-t border-gray-100 pt-3'>
                            <p className='text-sm text-gray-500'>
                                {order.paymentMethod === 'cod' ? 'COD' : order.paymentMethod.toUpperCase()}
                                {' . '}
                                <span>
                                    <span>
                                        {order.paymentMethod === 'paid' ? 'Paid' : 'Unpaid'}
                                    </span>
                                </span>
                            </p>
                            <p className='font-bold text-green-700'>${order.totalPrice.toLocaleString('en-US')}</p>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default ProfilePage