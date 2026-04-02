import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { IconSearch, IconUser, IconShield, IconChevronDown } from "../../components/icons"
import axios from "axios"

const API = import.meta.env.VITE_API_URL


const AdminUsers = () => {
    const { userInfo } = useSelector(state => state.auth)
    const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } }
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await axios.get(`${API}/admin/users`, config)
                setUsers(data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchUsers()
    }, [])

    const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.name.toLowerCase().includes(search.toLowerCase()))

    const handleRoleChange = async (userId, newRole) => {
        try {
            await axios.put(`${API}/admin/users/${userId}`, { role: newRole }, config)
            setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u))
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="p-8">
            <div className="mb-8 text-left ms-1">
                <h1 className="text-2xl font-bold text-gray-800">Manage Users</h1>
                <p className="text-gray-500 text-sm mt-1">Total: {users.length} users</p>
            </div>

            <div className="relative mb-6 max-w-sm">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <IconSearch className="!w-4 !h-4 text-gray-400" />
                </div>
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search By Name Or Email"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-green-500"
                />
            </div>

            <div>
                {loading ? (
                    <div>
                        {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse"></div>)}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-6 py-4 ps-15 text-xs font-semibold text-gray-500 uppercase tracking-wide">User Name</th>
                                    <th className="text-left px-6 py-4 ps-20 text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                                    <th className="text-left px-6 py-4 ps-15 text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone Number</th>
                                    <th className="text-left px-6 py-4 ps-13 text-xs font-semibold text-gray-500 uppercase tracking-wide">Created Date</th>
                                    <th className="text-right px-6 py-4 pe-25 text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map(user => (
                                    <tr key={user._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                                                    <IconUser className="!w-4 !h-4 text-green-600" />
                                                </div>
                                                <p className="font-medium text-gray-800">{user.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                        <td className="px-6 py-4 text-gray-500">{user.phone || '-'}</td>
                                        <td className="px-6 py-4 text-gray-400 text-xs">
                                            {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="px-6 py-4">
                                            {user._id === userInfo._id ? (
                                                <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 text-xs font-medium px-4 py-2 rounded-full">
                                                    <IconShield className="!w-3.5 !h-3.5" />
                                                    Admin ( You )
                                                </span>
                                            ) : (
                                                <div className="relative">
                                                    <select
                                                        value={user.role}
                                                        onChange={e => handleRoleChange(user._id, e.target.value)}
                                                        className={`appearance-none w-25 px-4 py-2 text-left border rounded-full text-xs font-medium outline-none cursor-pointer
                                                            ${user.role === 'admin'
                                                                ? 'border-green-300 text-green-700 bg-green-50'
                                                                : 'border-gray-300 text-gray-600 bg-white'
                                                            }`}
                                                    >
                                                        <option value="user">User</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                    <div className='absolute z-50  top-2.5 right-12 flex items-center pointer-events-none text-gray-500'>
                                                        <IconChevronDown className='!w-3.5 !h-3.5' />
                                                    </div>
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