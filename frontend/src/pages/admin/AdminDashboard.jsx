import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from 'react-router-dom'
import { IconClipBoardList, IconUser, IconBox, IconDollarSign, IconArrowRight } from "../../components/icons"
import StatCard from '../../components/admin/StatCard'
import axios from "axios"

const API = import.meta.env.VITE_API_URL

const AdminDashboard = () => {
    const {userInfo} = useSelector(state => state.auth)
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [recentOrders, setRecentOrders] = useState([])

    useEffect(() => {
        if (!userInfo) return

        const fetchData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } }
                const [statsRes, ordersRes] = await Promise.all([
                    axios.get(`${API}/admin/status`, config),
                    axios.get(`${API}/admin/orders`, config),
                ])
                setStats(statsRes.data)
                setRecentOrders(ordersRes.data.slice(0, 5))
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const statusLabel = {
        pending: {
            text: 'pending',
            color: 'bg-yellow-100 text-yellow-700'
        },
        processing: {
            text: 'processing',
            color: 'bg-blue-100 text-blue-700'
        },
        shipping: {
            text: 'shipping',
            color: 'bg-purple-100 text-purple-700'
        },
        delivered: {
            text: 'delivered',
            color: 'bg-green-100 text-green-700'
        },
        cancelled: {
            text: 'cancelled',
            color: 'bg-red-100 text-red-700'
        },
    }

    return (
        <div className="p-8">
            <div className="mb-8 text-left">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-500 text-sm mt-1">Welcome back, {userInfo?.name}</p>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                            <div className="w-12 h-12 bg-gray-200 rounded-xl mb-4"></div>
                            <div className="h-7 bg-gray-200 rounded-xl w-1/2 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div  className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard  icon={<IconUser className='!w-5 !h-5 text-white'/>} label={'Users'} value={stats?.totalUsers || 0} color={'bg-blue-500'}/>
                    <StatCard  icon={<IconClipBoardList className='!w-5 !h-5 text-white'/>} label={'Orders'} value={stats?.totalOrders || 0} color={'bg-purple-500'}/>
                    <StatCard  icon={<IconBox className='!w-5 !h-5 text-white'/>} label={'Products'} value={stats?.totalProducts || 0} color={'bg-green-500'}/>
                    <StatCard  icon={<IconDollarSign className='!w-5 !h-5 text-white'/>} label={'Revenue'} value={`$${(stats?.totalRevenue || 0).toLocaleString('en-US')}`} color={'bg-orange-500'}/>
                </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold text-gray-800">Recent orders</h2>
                    <Link
                        to={'/admin/orders'}
                        className="flex items-center gap-1 text-sm text-green-600 hover:underline"
                    >
                        <span>View All</span>
                        <IconArrowRight className="!w-3 !h-3 hover:underline"/>
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse"></div>
                    ))}
                </div>
            ) : recentOrders.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No orders yet.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">Order ID</th>
                                <th className="py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer</th>
                                <th className="py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Price</th>
                                <th className="py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                                <th className="py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map(order => {
                                const status = statusLabel[order.orderStatus] || statusLabel.pending
                                return (
                                    <tr key={order._id} className="hover:bg-gray-50 transition">
                                        <td className="py-3 font-mono text-xs text-gray-600">#{order._id.slice(-8).toUpperCase()}</td>
                                        <td className="py-3 text-gray-700">{order.user?.name || 'N/A'}</td>
                                        <td className="py-3 font-semibold text-green-700">${order.totalPrice.toLocaleString('en-US')}</td>
                                        <td className="py-3">
                                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.color}`}> 
                                                {status.text}
                                            </span>
                                        </td>
                                        <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
} 

export default AdminDashboard