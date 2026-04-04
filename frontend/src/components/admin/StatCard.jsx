import { IconArrowUp } from "../icons"


const StatCard  = ({ icon, label, value, sub, color}) => {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                    {icon}
                </div>
                <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                    <IconArrowUp className='!w-3 !h-3'/>
                    Active
                </span>
            </div>
            <p className="text-2xl font-bold text-gray-800 !ms-1">{value}</p>
            <p className="text-sm text-gray-500 mt-0.5 !ms-1">{label}</p>
            {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
    )
}

export default StatCard 