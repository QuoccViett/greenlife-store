import { useEffect, useState, useMemo } from "react"
import { useSelector } from "react-redux"
import { IconSearch, IconUser, IconShield, IconChevronDown } from "../../components/icons"
import axios from "axios"
import { useLang } from '../../context/LangContext'
import AdminFilter from '../../components/admin/AdminFilter'

const API = import.meta.env.VITE_API_URL

const AdminUsers = () => {
    const { userInfo } = useSelector(state => state.auth)
    const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } }
    const { t } = useLang()
    const [filterRole, setFilterRole] = useState('')
    const [filterStatus, setFilterStatus] = useState('')
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await axios.get(`${API}/admin/users`, config)
                setUsers(data)
            } catch (err) {
                console.error("Failed to fetch users:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchUsers()
    }, [])

    // Optimized search logic covering both name and email
    const filteredUsers = useMemo(() => {
        const query = search.toLowerCase().trim()
        return users.filter(u => {
            const matchSearch =
                u.name?.toLowerCase().includes(query) ||
                u.email?.toLowerCase().includes(query)
            const matchRole = filterRole ? u.role === filterRole : true
            const matchStatus = filterStatus === 'active' ? u.isActive !== false
                : filterStatus === 'locked' ? u.isActive === false
                    : true
            return matchSearch && matchRole && matchStatus
        })
    }, [users, search, filterRole, filterStatus])

    const handleRoleChange = async (userId, newRole) => {
        try {
            await axios.put(`${API}/admin/users/${userId}`, { role: newRole }, config)
            setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u))
        } catch (err) {
            console.error("Failed to update role:", err)
            // Optional: Add a toast notification here to inform the admin of the failure
        }
    }

    const handleToggleStatus = async (userId, currentStatus) => {
        if (!window.confirm(`Xác nhận ${currentStatus ? 'khóa' : 'mở khóa'} tài khoản này?`)) return
        try {
            const { data } = await axios.put(`${API}/admin/users/${userId}/toggle`, {}, config)
            setUsers(users.map(u => u._id === userId ? { ...u, isActive: !currentStatus } : u))
            alert(data.message)
        } catch (err) {
            alert(err.response?.data?.message || 'Có lỗi xảy ra')
        }
    }

    const handleResetPassword = async (userId, userName) => {
        if (!window.confirm(`Reset mật khẩu cho "${userName}"?\nMật khẩu mới sẽ gửi qua email.`)) return
        try {
            const { data } = await axios.put(`${API}/admin/users/${userId}/reset-password`, {}, config)
            alert(`✅ ${data.message}`)
        } catch (err) {
            alert(err.response?.data?.message || 'Có lỗi xảy ra')
        }
    }

    return (
        <div className="p-8">
            <div className="mb-8 text-left">
                <h1 className="text-2xl font-bold text-gray-800">{t('admin.users.title')}</h1>
                <p className="text-gray-500 text-sm mt-1">
                    {t('admin.users.showing', { shown: filteredUsers?.length || 0, total: users?.length || 0 })}
                </p>
            </div>

            <AdminFilter
                search={search}
                onSearch={setSearch}
                searchPlaceholder={t('admin.users.search_placeholder')}
                dropdowns={[
                    {
                        value: filterRole,
                        onChange: setFilterRole,
                        placeholder: 'All Roles',
                        options: [
                            { value: 'user', label: 'User' },
                            { value: 'admin', label: 'Admin' },
                        ]
                    },
                    {
                        value: filterStatus,
                        onChange: setFilterStatus,
                        placeholder: 'All Status',
                        options: [
                            { value: 'active', label: 'Active' },
                            { value: 'locked', label: 'Locked' },
                        ]
                    }
                ]}
                showReset={!!(search || filterRole || filterStatus)}
                onReset={() => {
                    setSearch('')
                    setFilterRole('')
                    setFilterStatus('')
                }}
            />

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                {loading ? (
                    <div className="p-6 space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="p-20 text-center text-gray-400">
                        {t('admin.users.none', { query: search })}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm table-fixed">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('admin.users.table.user')}</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('admin.users.table.contact')}</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('admin.users.table.joined')}</th>
                                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('admin.users.table.access_lv')}</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('admin.users.table.action')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredUsers.map(user => (
                                    <tr key={user._id} className="hover:bg-gray-50/50 transition">
                                        <td className="px-3 py-4 flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${user.isActive !== false ? 'bg-green-100' : 'bg-red-100'
                                                }`}>
                                                <IconUser className={`!w-4 !h-4 ${user.isActive !== false ? 'text-green-600' : 'text-red-400'}`} />
                                            </div>
                                            <div className="flex flex-col justify-center">
                                                <p className="font-semibold text-gray-800 leading-none">{user.name}</p>
                                                {user.isActive === false && (
                                                    <span className="text-xs text-red-500 font-medium">Đã khóa</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-gray-700">{user.email}</span>
                                                <span className="text-gray-400 text-xs">{user.phone || t('admin.users.no_phone')}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-xs">
                                            {new Date(user.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {user._id === userInfo._id ? (
                                                <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-tighter">
                                                    <IconShield className="w-3.5 h-3.5" />
                                                    {t('admin.users.current_admin')}
                                                </span>
                                            ) : (
                                                <div className="relative inline-block text-left">
                                                    <select
                                                        value={user.role}
                                                        onChange={e => handleRoleChange(user._id, e.target.value)}
                                                        className={`appearance-none pl-4 pr-10 py-1.5 border rounded-full text-xs font-bold uppercase outline-none cursor-pointer transition-colors
                                                            ${user.role === 'admin'
                                                                ? 'border-green-300 text-green-700 bg-green-50'
                                                                : 'border-gray-300 text-gray-600 bg-white hover:border-gray-400'
                                                            }`}
                                                    >
                                                        <option value="user">{t('admin.users.role_user')}</option>
                                                        <option value="admin">{t('admin.users.role_admin')}</option>
                                                    </select>
                                                    <IconChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none text-gray-400" />
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {/* Toggle status */}
                                                {user._id !== userInfo._id && (
                                                    <button
                                                        onClick={() => handleToggleStatus(user._id, user.isActive)}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${user.isActive
                                                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                                                            }`}
                                                    >
                                                        {user.isActive ? 'Khóa' : 'Mở khóa'}
                                                    </button>
                                                )}
                                                {/* Reset password */}
                                                <button
                                                    onClick={() => handleResetPassword(user._id, user.name)}
                                                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                                                >
                                                    Reset pass
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminUsers