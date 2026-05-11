import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useLang } from '../../context/LangContext';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const OrderStatusChart = ({ data }) => {
    const { t } = useLang();

    const chartData = [
        { name: t('admin.chart.pending') || 'Pending', value: data.find(d => d._id === 'pending')?.count || 0 },
        { name: t('admin.chart.processing') || 'Processing', value: data.find(d => d._id === 'processing')?.count || 0 },
        { name: t('admin.chart.shipping') || 'Shipping', value: data.find(d => d._id === 'shipping')?.count || 0 },
        { name: t('admin.chart.delivered') || 'Delivered', value: data.find(d => d._id === 'delivered')?.count || 0 },
        { name: t('admin.chart.cancelled') || 'Cancelled', value: data.find(d => d._id === 'cancelled')?.count || 0 }
    ];

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{t('admin.chart.order_status') || 'Orders by Status'}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

const RevenueStatusChart = ({ data }) => {
    const { t } = useLang();

    const chartData = [
        { name: t('admin.chart.pending') || 'Pending', value: data.find(d => d._id === 'pending')?.total || 0 },
        { name: t('admin.chart.processing') || 'Processing', value: data.find(d => d._id === 'processing')?.total || 0 },
        { name: t('admin.chart.shipping') || 'Shipping', value: data.find(d => d._id === 'shipping')?.total || 0 },
        { name: t('admin.chart.delivered') || 'Delivered', value: data.find(d => d._id === 'delivered')?.total || 0 },
        { name: t('admin.chart.cancelled') || 'Cancelled', value: data.find(d => d._id === 'cancelled')?.total || 0 }
    ];

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{t('admin.chart.revenue_status') || 'Revenue by Status'}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                    <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

const MonthlyRevenueChart = ({ data }) => {
    const { t } = useLang();

    const chartData = data.map(item => ({
        month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
        revenue: item.total,
        orders: item.count
    })).reverse();

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{t('admin.chart.monthly_revenue') || 'Monthly Revenue'}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                    <Bar dataKey="revenue" fill="#ffc658" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

const TopProductsChart = ({ data }) => {
    const { t } = useLang();

    const chartData = data.slice(0, 5).map((product, index) => ({
        name: product.name.length > 20 ? product.name.substring(0, 20) + '...' : product.name,
        sold: product.totalSold,
        revenue: product.totalRevenue
    }));

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{t('admin.chart.top_products') || 'Top Products'}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={120} />
                    <Tooltip formatter={(value) => [value, 'Sold']} />
                    <Bar dataKey="sold" fill="#ff7c7c" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

const CategoryStatsChart = ({ data }) => {
    const { t } = useLang();

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{t('admin.chart.category_distribution') || 'Category Distribution'}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export { OrderStatusChart, RevenueStatusChart, MonthlyRevenueChart, TopProductsChart, CategoryStatsChart };