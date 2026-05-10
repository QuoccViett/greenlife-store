import { useEffect, useState, useMemo } from "react"
import { useSelector } from "react-redux"
import { IconSearch, IconUser, IconShield, IconChevronDown } from "../../components/icons"
import axios from "axios"
import { useLang } from '../../context/LangContext'

const API = import.meta.env.VITE_API_URL

const AdminUsers = () => {
    const { userInfo } = useSelector(state => state.auth)
    const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } }
    const { t } = useLang()
    
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
        return users.filter(u => 
            u.name?.toLowerCase().includes(query) || 
            u.email?.toLowerCase().includes(query)
        )
    }, [users, search])

    const handleRoleChange = async (userId, newRole) => {
        try {
            await axios.put(`${API}/admin/users/${userId}`, { role: newRole }, config)
            setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u))
        } catch (err) {
            console.error("Failed to update role:", err)
            // Optional: Add a toast notification here to inform the admin of the failure
        }
    }

    return (
        <div className="p-8">
            <div className="mb-8 text-left">
                <h1 className="text-2xl font-bold text-gray-800">{t('admin.users.title')}</h1>
                <p className="text-gray-500 text-sm mt-1">
                    {t('admin.users.showing', { shown: filteredUsers.length, total: users.length })}
                </p>
            </div>

            <div className="relative mb-6 max-w-sm">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <IconSearch className="w-4 h-4 text-gray-400" />
                </div>
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder={t('admin.users.search_placeholder')}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-green-500 transition-all"
                    />
            </div>

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
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">User</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Contact</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Joined</th>
                                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Access Level</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredUsers.map(user => (
                                    <tr key={user._id} className="hover:bg-gray-50/50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                                                    <IconUser className="w-4 h-4 text-green-600" />
                                                </div>
                                                <p className="font-medium text-gray-800">{user.name}</p>
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