// Thẻ thống kê dùng chung cho các trang admin
const StatCard = ({ icon, label, value, sub, color = 'bg-green-500', valueClass = 'text-gray-800' }) => {
    return (
        <div className="group bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 text-left">
                    <p className="text-xs font-medium text-gray-500 leading-snug">{label}</p>
                    <p className={`text-2xl font-bold mt-2 truncate ${valueClass}`}>{value}</p>
                    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
                </div>
                <div className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center shadow-sm ${color}`}>
                    {icon}
                </div>
            </div>
        </div>
    )
}

export default StatCard
