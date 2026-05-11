import { IconSearch, IconChevronDown } from '../icons'

const AdminFilter = ({
  // Search
  search, onSearch, searchPlaceholder = 'Search...',
  // Date range
  dateFrom, dateTo, onDateFrom, onDateTo,
  // Dropdowns — mảng [{ value, label, options: [{value, label}] }]
  dropdowns = [],
  // Reset
  onReset,
  showReset,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
      <div className="flex flex-wrap items-center gap-3">

        {/* Search */}
        {onSearch !== undefined && (
          <div className="relative min-w-52">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <IconSearch className="!w-4 !h-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={search}
              onChange={e => onSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-green-500 transition"
            />
          </div>
        )}

        {/* Date range */}
        {onDateFrom && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateFrom}
              onChange={e => onDateFrom(e.target.value)}
              className="px-3 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-green-500 transition"
            />
            <span className="text-gray-400 text-sm">→</span>
            <input
              type="date"
              value={dateTo}
              onChange={e => onDateTo(e.target.value)}
              className="px-3 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-green-500 transition"
            />
          </div>
        )}

        {/* Dropdowns */}
        {dropdowns.map((d, i) => (
          <div key={i} className="relative">
            <select
              value={d.value}
              onChange={e => d.onChange(e.target.value)}
              className="appearance-none pl-4 pr-9 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-green-500 transition text-gray-700 bg-white"
            >
              <option value="">{d.placeholder || 'All'}</option>
              {d.options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <IconChevronDown className="!w-3.5 !h-3.5 text-gray-400" />
            </div>
          </div>
        ))}

        {/* Reset button */}
        {showReset && (
          <button
            onClick={onReset}
            className="px-4 py-2.5 text-sm text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  )
}

export default AdminFilter