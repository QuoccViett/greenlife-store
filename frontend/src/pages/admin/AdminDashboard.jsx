import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUsers, faBoxOpen, faClipboardList,
  faDollarSign, faArrowUp, faArrowRight,
  faChartLine, faChartPie
} from '@fortawesome/free-solid-svg-icons'
import { useLang } from '../../context/LangContext'

const API = import.meta.env.VITE_API_URL

const COLORS = ['#16a34a', '#0891b2', '#7c3aed', '#ea580c', '#db2777']

const StatCard = ({ icon, label, value, color, trend }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-6">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <FontAwesomeIcon icon={icon} className="w-5 h-5 text-white" />
      </div>
      <span className="flex items-center gap-1 text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
        <FontAwesomeIcon icon={faArrowUp} className="w-3 h-3" />
        {trend}
      </span>
    </div>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
    <p className="text-sm text-gray-500 mt-0.5">{label}</p>
  </div>
)

const AdminDashboard = () => {
  const { userInfo } = useSelector(state => state.auth)
  const { t } = useLang()
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } }
        const [statsRes, ordersRes, productsRes] = await Promise.all([
          axios.get(`${API}/admin/stats`, config),
          axios.get(`${API}/admin/orders`, config),
          axios.get(`${API}/products`, config),
        ])
        setStats(statsRes.data)
        setOrders(ordersRes.data)
        setProducts(productsRes.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Dữ liệu biểu đồ doanh thu 7 ngày
  const revenueData = (() => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
      const dayOrders = orders.filter(o => {
        const orderDate = new Date(o.createdAt)
        return orderDate.toDateString() === date.toDateString()
      })
      days.push({
        date: dateStr,
        revenue: dayOrders.reduce((sum, o) => sum + o.totalPrice, 0),
        orders: dayOrders.length,
      })
    }
    return days
  })()

  // Dữ liệu biểu đồ trạng thái đơn hàng
  const orderStatusData = [
    { name: 'Chờ xác nhận', value: orders.filter(o => o.orderStatus === 'pending').length },
    { name: 'Đang xử lý', value: orders.filter(o => o.orderStatus === 'processing').length },
    { name: 'Đang giao', value: orders.filter(o => o.orderStatus === 'shipping').length },
    { name: 'Đã giao', value: orders.filter(o => o.orderStatus === 'delivered').length },
    { name: 'Đã hủy', value: orders.filter(o => o.orderStatus === 'cancelled').length },
  ].filter(d => d.value > 0)

  // Dữ liệu biểu đồ top sản phẩm bán chạy
  const topProducts = [...products]
    .sort((a, b) => (b.sold || 0) - (a.sold || 0))
    .slice(0, 5)
    .map(p => ({ name: p.name.length > 20 ? p.name.slice(0, 20) + '...' : p.name, sold: p.sold || 0 }))

  // Dữ liệu biểu đồ sản phẩm theo danh mục
  const categoryData = products.reduce((acc, p) => {
    const cat = p.category?.name || 'Khác'
    const existing = acc.find(a => a.name === cat)
    if (existing) existing.value++
    else acc.push({ name: cat, value: 1 })
    return acc
  }, [])

  const statusLabel = {
    pending: { text: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-700' },
    processing: { text: 'Đang xử lý', color: 'bg-blue-100 text-blue-700' },
    shipping: { text: 'Đang giao', color: 'bg-purple-100 text-purple-700' },
    delivered: { text: 'Đã giao', color: 'bg-green-100 text-green-700' },
    cancelled: { text: 'Đã hủy', color: 'bg-red-100 text-red-700' },
  }

  if (loading) return (
    <div className="p-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse h-32" />
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse h-64" />
        ))}
      </div>
    </div>
  )

  return (
    <div className="p-8 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">{t('admin.dashboard.title')}</h1>
        <p className="text-gray-500 text-sm mt-1">{t('admin.dashboard.welcome', { name: userInfo?.name })}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={faUsers} label={t('admin.stats.users')} value={stats?.totalUsers || 0} color="bg-blue-500" trend="+12%" />
        <StatCard icon={faClipboardList} label={t('admin.stats.orders')} value={stats?.totalOrders || 0} color="bg-purple-500" trend="+8%" />
        <StatCard icon={faBoxOpen} label={t('admin.stats.products')} value={stats?.totalProducts || 0} color="bg-green-500" trend="+3%" />
        <StatCard icon={faDollarSign} label={t('admin.stats.revenue')} value={`$${(stats?.totalRevenue || 0).toLocaleString('en-US')}`} color="bg-orange-500" trend="+15%" />
      </div>

      {/* Charts row 1 */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">

        {/* Revenue line chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <FontAwesomeIcon icon={faChartLine} className="w-4 h-4 text-green-600" />
            <h3 className="font-bold text-gray-800">{t('admin.charts.revenue_7_days')}</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(value, name) => [
                  name === 'revenue' ? `$${value}` : value,
                  name === 'revenue' ? 'Doanh thu' : 'Đơn hàng'
                ]}
              />
              <Legend formatter={v => v === 'revenue' ? 'Doanh thu ($)' : 'Số đơn'} />
              <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="orders" stroke="#0891b2" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Order status pie chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <FontAwesomeIcon icon={faChartPie} className="w-4 h-4 text-green-600" />
            <h3 className="font-bold text-gray-800">{t('admin.charts.order_status')}</h3>
          </div>
          {orderStatusData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
              Chưa có đơn hàng nào
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%" cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {orderStatusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">

        {/* Top products bar chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-5">{t('admin.charts.top_products')}</h3>
          {topProducts.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
              Chưa có dữ liệu
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={120} />
                <Tooltip formatter={v => [`${v} đã bán`, 'Số lượng']} />
                <Bar dataKey="sold" fill="#16a34a" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Products by category pie */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-5">{t('admin.charts.products_by_category')}</h3>
          {categoryData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
              Chưa có dữ liệu
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%" cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  dataKey="value"
                  paddingAngle={3}
                >
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [v, n]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent orders table */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-800">{t('admin.recent_orders.title')}</h3>
          <Link to="/admin/orders" className="flex items-center gap-1 text-sm text-green-600 hover:underline">
            <span>{t('admin.recent_orders.view_all')}</span>
            <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {[t('admin.table.order_id'), t('admin.table.customer'), t('admin.table.total'), t('admin.table.payment'), t('admin.table.status'), t('admin.table.date')].map(h => (
                  <th key={h} className="text-left py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.slice(0, 6).map(order => {
                const status = statusLabel[order.orderStatus] || statusLabel.pending
                return (
                  <tr key={order._id} className="hover:bg-gray-50 transition">
                    <td className="py-3 pr-4 font-mono text-xs text-gray-600">#{order._id.slice(-8).toUpperCase()}</td>
                        <td className="py-3 pr-4 text-gray-700">{order.user?.name || 'N/A'}</td>
                    <td className="py-3 pr-4 font-semibold text-green-700">${order.totalPrice.toLocaleString('en-US')}</td>
                        <td className="py-3 pr-4">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        order.paymentStatus === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.paymentStatus === 'paid' ? t('admin.payment.paid') : t('admin.payment.unpaid')}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.color}`}>
                        {status.text}
                      </span>
                    </td>
                    <td className="py-3 text-gray-400 text-xs">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard