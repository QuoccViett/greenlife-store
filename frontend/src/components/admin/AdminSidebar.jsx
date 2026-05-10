import { useEffect } from "react"
import { IconArrowRight, IconLeaf, IconUser, IconChartBar, IconBox, IconEcoHome, IconClipBoardList, } from "../icons"
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../../store/authSlice"
import { useLang } from '../../context/LangContext'


const AdminSidebar = () => {
    const { lang, toggleLang, t } = useLang()
    const { userInfo } = useSelector(state => state.auth)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()

    useEffect(() => {
        if (!userInfo || userInfo.role !== 'admin') navigate('/login')
    }, [userInfo])

    const links = [
        {
            to: '/admin',
            label: 'Dashboard',
            icon: IconChartBar,
        },
        {
            to: '/admin/products',
            label: 'Products',
            icon: IconBox,
        },
        {
            to: '/admin/orders',
            label: 'Orders',
            icon: IconClipBoardList,
        },
        {
            to: '/admin/users',
            label: 'Users',
            icon: IconUser,
        },
    ]

    return (
        <aside className="w-64 bg-green-900 h-screen flex flex-col shrink-0">

            <div className="flex items-center justify-center border-b border-green-700">
                <Link to={'/'} className="flex items-center gap-2 px-6 py-5 ">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <IconLeaf className="w-4 h-4 text-green-700" />
                    </div>
                    <span className="text-white font-bold text-lg">GreenLife</span>
                </Link>
                <button
                    onClick={toggleLang}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-full text-xs font-semibold text-gray-600 hover:border-green-500 hover:text-green-600 transition"
                >
                    <span>{lang === 'vi' ? '🇻🇳 VI' : '🇬🇧 EN'}</span>
                </button>
            </div>


            <div className="px-4 py-4 border-b border-green-700">
                <p className="text-white text-xs mb-1">Sign in with {userInfo?.name}</p>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1">
                {links.map(l => (
                    <Link
                        to={l.to}
                        key={l.to}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition
                                ${location.pathname === l.to
                                ? 'bg-green-700 text-white font-medium'
                                : 'text-green-300 hover:bg-green-800 hover:text-white'
                            }`}
                    >
                        <l.icon className='!w-4 !h-4' />
                        <span>{l.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="px-4 py-4 border-t border-green-800">
                <button
                    onClick={() => { navigate(('/')) }}
                    className="w-full flex items-center justify-start gap-3 px-3 py-2.5 rounded-xl text-sm text-green-300 hover:text-white hover:bg-green-800 transition"
                >
                    <IconEcoHome className='!w-4 !h-4' />
                    <span>Back To Home</span>
                </button>

                <button
                    onClick={() => { dispatch(logout()); navigate(('/login')) }}
                    className="w-full flex items-center justify-start gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-green-800 transition mt-1"
                >
                    <IconArrowRight className="w-4 h-4" />
                    <span>Log out</span>
                </button>
            </div>
        </aside>
    )
}

export default AdminSidebar