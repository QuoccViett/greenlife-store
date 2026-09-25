import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from 'react-router-dom'
import { IconClipBoardList, IconUser, IconBox, IconDollarSign, IconArrowRight, IconChartBar } from "../../components/icons"
import StatCard from '../../components/admin/StatCard'
import axios from "axios"
import { useLang } from '../../context/LangContext'
import AdminFilter from '../../components/admin/AdminFilter'

const API = import.meta.env.VITE_API_URL

const AdminDashboard = () => {
    const { t, lang } = useLang()
    const L = (vi, en) => (lang === 'vi' ? vi : en)
    const money = n => `${(n || 0) < 0 ? '-' : ''}$${Math.abs(n || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`
    const { userInfo } = useSelector(state => state.auth)
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [recentOrders, setRecentOrders] = useState([])
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    useEffect(() => {
        if (!userInfo) return

        const fetchData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } }
                const dateParams = startDate && endDate
                    ? `?startDate=${startDate}&endDate=${endDate}`
                    : ''
                const [statsRes, ordersRes] = await Promise.all([
                    axios.get(`${API}/admin/stats${dateParams}`, config),
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
    }, [userInfo, startDate, endDate])

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

    return (
        <div className="p-8">
            <div className="mb-8 text-left">
                <h1 className="text-2xl font-bold text-gray-800">{t('admin.dashboard.title')}</h1>
                <p className="text-gray-500 text-sm mt-1">{t('admin.dashboard.welcome', { name: userInfo?.name })}</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
                <AdminFilter
                    dateFrom={startDate}
                    dateTo={endDate}
                    onDateFrom={setStartDate}
                    onDateTo={setEndDate}
                    showReset={!!(startDate || endDate)}
                    onReset={() => { setStartDate(''); setEndDate('') }}
                />
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
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 text-left">
                    <StatCard icon={<IconUser className='!w-5 !h-5 text-white' />} label={t('admin.stats.users')} value={stats?.totalUsers || 0} color={'bg-blue-500'} />
                    <StatCard icon={<IconClipBoardList className='!w-5 !h-5 text-white' />} label={t('admin.stats.orders')} value={stats?.totalOrders || 0} color={'bg-purple-500'} />
                    <StatCard icon={<IconBox className='!w-5 !h-5 text-white' />} label={t('admin.stats.products')} value={stats?.totalProducts || 0} color={'bg-green-500'} />
                    <StatCard icon={<IconDollarSign className='!w-5 !h-5 text-white' />} label={t('admin.stats.revenue')} value={`$${(stats?.totalRevenue || 0).toLocaleString('en-US')}`} color={'bg-orange-500'} />
                </div>
            )}

            {!loading && (() => {
                const rev = stats?.totalRevenue || 0
                const cogs = stats?.costOfGoodsSold || 0
                const profit = stats?.grossProfit || 0
                const cogsPct = rev > 0 ? Math.min(100, Math.max(0, (cogs / rev) * 100)) : 0
                const profitPct = rev > 0 ? Math.max(0, 100 - cogsPct) : 0
                return (
                    <div className="mb-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-left">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">{L('Doanh thu & Lợi nhuận', 'Revenue & Profit')}</h2>
                                <p className="text-xs text-gray-400 mt-0.5">{L('Tính trên các đơn đã thanh toán, không tính đơn đã hủy', 'Based on paid, non-cancelled orders')}</p>
                            </div>
                            <Link to="/admin/purchases" className="text-sm text-green-600 hover:underline flex items-center gap-1">
                                {L('Xem nhập hàng', 'View purchases')} <IconArrowRight className="!w-3 !h-3" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard icon={<IconDollarSign className='!w-5 !h-5 text-white' />} color="bg-orange-500"
                                label={L('Doanh thu bán hàng', 'Sales revenue')} value={money(rev)} />
                            <StatCard icon={<IconBox className='!w-5 !h-5 text-white' />} color="bg-red-500"
                                label={L('Chi phí nhập hàng', 'Purchase cost')} value={money(stats?.totalImportCost)}
                                sub={L(`${stats?.purchaseCount || 0} phiếu nhập`, `${stats?.purchaseCount || 0} receipts`)} />
                            <StatCard icon={<IconDollarSign className='!w-5 !h-5 text-white' />} color="bg-sky-500"
                                label={L('Tiền còn lại (DT − Nhập hàng)', 'Cash left (Rev − Purchases)')} value={money(stats?.netCash)}
                                valueClass={(stats?.netCash || 0) < 0 ? 'text-red-600' : 'text-gray-800'} />
                            <StatCard icon={<IconChartBar className='!w-5 !h-5 text-white' />} color="bg-emerald-600"
                                label={L('Lợi nhuận gộp', 'Gross profit')} value={money(profit)}
                                sub={L(`Biên lợi nhuận ${stats?.profitMargin || 0}%`, `Margin ${stats?.profitMargin || 0}%`)}
                                valueClass={profit < 0 ? 'text-red-600' : 'text-emerald-700'} />
                        </div>

                        <div className="mt-6">
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                                <span>{L('Cơ cấu doanh thu', 'Revenue breakdown')}</span>
                                <span>{L('Giá vốn', 'COGS')} {money(cogs)} · {L('Lợi nhuận', 'Profit')} {money(profit)}</span>
                            </div>
                            <div className="h-3 rounded-full bg-gray-100 overflow-hidden flex">
                                <div className="bg-gray-400 h-full transition-all" style={{ width: `${cogsPct}%` }} title={L('Giá vốn hàng bán', 'Cost of goods sold')} />
                                <div className="bg-emerald-500 h-full transition-all" style={{ width: `${profitPct}%` }} title={L('Lợi nhuận gộp', 'Gross profit')} />
                            </div>
                            <div className="flex gap-4 mt-2 text-[11px] text-gray-500">
                                <span className="flex items-center gap-1.5"><i className="w-2.5 h-2.5 rounded-sm bg-gray-400 inline-block" />{L('Giá vốn hàng bán', 'Cost of goods sold')}</span>
                                <span className="flex items-center gap-1.5"><i className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />{L('Lợi nhuận gộp', 'Gross profit')}</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-4">
                            {L('Lợi nhuận gộp = Σ (giá bán − giá vốn) × số lượng đã bán. Giá vốn tính bình quân gia quyền theo các phiếu nhập.', 'Gross profit = Σ (sale price − cost) × quantity sold. Cost is a weighted average of purchase receipts.')}
                        </p>
                    </div>
                )
            })()}

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold text-gray-800">{t('admin.recent_orders.title')}</h2>
                    <Link
                        to={'/admin/orders'}
                        className="flex items-center gap-1 text-sm text-green-600 hover:underline"
                    >
                        <span>{t('admin.recent_orders.view_all')}</span>
                        <IconArrowRight className="!w-3 !h-3" />
                    </Link>
                </div>

                {loading ? (
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                ) : recentOrders.length === 0 ? (
                    <p className="text-center text-gray-400 py-8">{t('admin.table.none')}</p>
                ) : (
                    <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
                        <table className="w-full text-sm table-fixed">
                            <thead className="bg-gray-100">
                                <tr className="text-center">
                                    <th className="px-4 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">{t('admin.table.order_id')}</th>
                                    <th className="px-4 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">{t('admin.table.customer')}</th>
                                    <th className="px-4 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide ">{t('admin.table.total')}</th>
                                    <th className="px-4 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">{t('admin.table.status')}</th>
                                    <th className="px-4 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">{t('admin.table.date')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map(order => {
                                    const status = statusLabel[order.orderStatus] || statusLabel.pending
                                    return (
                                        <tr key={order._id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition">
                                            <td className="px-4 py-2 font-mono text-xs text-gray-600">#{order._id.slice(-8).toUpperCase()}</td>
                                            <td className="px-4 py-2 text-gray-700">{order.user?.name || 'Guest'}</td>
                                            <td className="px-4 py-2 font-semibold text-green-700">${order.totalPrice.toLocaleString('en-US')}</td>
                                            <td className="px-4 py-2">
                                                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${status.color}`}>
                                                    {status.text}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 text-gray-500 text-xs">
                                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                )}
            </div>
        </div>
    )
}

export default AdminDashboard