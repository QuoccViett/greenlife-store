// import React from 'react';
// import { useEffect } from "react"
// import { IconArrowRight, IconLeaf, IconUser, IconChartBar, IconBox, IconEcoHome, IconClipBoardList, } from "../icons"
// import { Link, useLocation, useNavigate } from 'react-router-dom'
// import { useDispatch, useSelector } from "react-redux"
// import { logout } from "../../store/authSlice"
// import { useLang } from '../../context/LangContext'
// import { 
//   FaTachometerAlt, 
//   FaBox, 
//   FaList, 
//   FaShoppingCart, 
//   FaUsers, 
//   FaTruckLoading, 
//   FaAddressBook 
// } from 'react-icons/fa';


// const AdminSidebar = () => {
//     const { lang, toggleLang, t } = useLang()
//     const { userInfo } = useSelector(state => state.auth)
//     const navigate = useNavigate()
//     const dispatch = useDispatch()
//     const location = useLocation()

//     useEffect(() => {
//         if (!userInfo || userInfo.role !== 'admin') navigate('/login')
//     }, [userInfo])

//     const links = [
//         {
//             to: '/admin',
//             label: 'Dashboard',
//             icon: IconChartBar,
//         },
//         {
//             to: '/admin/products',
//             label: 'Products',
//             icon: IconBox,
//         },
//         {
//             to: '/admin/orders',
//             label: 'Orders',
//             icon: IconClipBoardList,
//         },
//         {
//             to: '/admin/users',
//             label: 'Users',
//             icon: IconUser,
//         },
//     ]

//     return (
//         <aside className="w-64 bg-green-900 h-screen flex flex-col shrink-0">

//             <div className="flex items-center justify-center border-b border-green-700">
//                 <Link to={'/'} className="flex items-center gap-2 px-6 py-5 ">
//                     <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
//                         <IconLeaf className="w-4 h-4 text-green-700" />
//                     </div>
//                     <span className="text-white font-bold text-lg">GreenLife</span>
//                 </Link>
//                 <button
//                     onClick={toggleLang}
//                     className="sm:flex items-center gap-1.5 px-3 py-1.5 border rounded-full text-xs font-semibold border-green-500 text-green-600 transition"
//                 >
//                     <span>{lang === 'vi' ? '🇻🇳 VI' : '🇬🇧 EN'}</span>
//                 </button>
//             </div>


//             <div className="px-4 py-4 border-b border-green-700">
//                 <p className="text-white text-xs mb-1">Sign in with {userInfo?.name}</p>
//             </div>

//             <nav className="flex-1 px-4 py-4 space-y-1">
//                 {links.map(l => (
//                     <Link
//                         to={l.to}
//                         key={l.to}
//                         className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition
//                                 ${location.pathname === l.to
//                                 ? 'bg-green-700 text-white font-medium'
//                                 : 'text-green-300 hover:bg-green-800 hover:text-white'
//                             }`}
//                     >
//                         <l.icon className='!w-4 !h-4' />
//                         <span>{l.label}</span>
//                     </Link>
//                 ))}
//             </nav>

//             <div className="px-4 py-4 border-t border-green-800">
//                 <button
//                     onClick={() => { navigate(('/')) }}
//                     className="w-full flex items-center justify-start gap-3 px-3 py-2.5 rounded-xl text-sm text-green-300 hover:text-white hover:bg-green-800 transition"
//                 >
//                     <IconEcoHome className='!w-4 !h-4' />
//                     <span>Back To Home</span>
//                 </button>

//                 <button
//                     onClick={() => { dispatch(logout()); navigate(('/login')) }}
//                     className="w-full flex items-center justify-start gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-green-800 transition mt-1"
//                 >
//                     <IconArrowRight className="w-4 h-4" />
//                     <span>Log out</span>
//                 </button>
//             </div>
//         </aside>
//     )
// }

// export default AdminSidebar
import { useEffect } from "react"
import { IconArrowRight, IconLeaf, IconUser, IconChartBar, IconBox, IconEcoHome, IconClipBoardList, IconTruck, IconStore } from "../icons"
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../../store/authSlice"
import { useLang } from '../../context/LangContext'

const AdminSidebar = () => {
    const { lang, toggleLang } = useLang()
    const L = (vi, en) => (lang === 'vi' ? vi : en)
    const { userInfo } = useSelector(state => state.auth)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()

    useEffect(() => {
        if (!userInfo || userInfo.role !== 'admin') navigate('/login')
    }, [userInfo, navigate])

    const groups = [
        {
            title: L('Tổng quan', 'Overview'),
            links: [{ to: '/admin', label: 'Dashboard', icon: IconChartBar }],
        },
        {
            title: L('Bán hàng', 'Sales'),
            links: [
                { to: '/admin/orders', label: L('Đơn hàng', 'Orders'), icon: IconClipBoardList },
                { to: '/admin/products', label: L('Sản phẩm', 'Products'), icon: IconBox },
            ],
        },
        {
            title: L('Kho & nhập hàng', 'Inventory'),
            links: [
                { to: '/admin/purchases', label: L('Nhập hàng', 'Purchases'), icon: IconStore },
                { to: '/admin/suppliers', label: L('Nhà cung cấp', 'Suppliers'), icon: IconTruck },
            ],
        },
        {
            title: L('Hệ thống', 'System'),
            links: [{ to: '/admin/users', label: L('Người dùng', 'Users'), icon: IconUser }],
        },
    ]

    const isActive = to => (to === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(to))

    return (
        <aside className="w-64 bg-gradient-to-b from-green-900 to-green-950 h-screen flex flex-col shrink-0 shadow-xl">
            <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
                <Link to="/" className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow">
                        <IconLeaf className="w-4 h-4 text-green-700" />
                    </div>
                    <span className="text-white font-bold text-lg tracking-tight">GreenLife</span>
                </Link>
                <button
                    onClick={toggleLang}
                    className="px-2.5 py-1 border rounded-full text-[11px] font-semibold border-white/30 text-green-100 hover:bg-white/10 transition"
                >
                    {lang === 'vi' ? '🇻🇳 VI' : '🇬🇧 EN'}
                </button>
            </div>

            <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-green-700 text-white flex items-center justify-center text-sm font-bold">
                    {(userInfo?.name || 'A').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 text-left">
                    <p className="text-white text-sm font-semibold truncate">{userInfo?.name}</p>
                    <p className="text-green-300 text-[11px]">{L('Quản trị viên', 'Administrator')}</p>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
                {groups.map(g => (
                    <div key={g.title}>
                        <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-green-400/80 text-left">{g.title}</p>
                        <div className="space-y-1">
                            {g.links.map(l => (
                                <Link
                                    to={l.to}
                                    key={l.to}
                                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all
                                        ${isActive(l.to)
                                            ? 'bg-white/15 text-white font-semibold shadow-inner'
                                            : 'text-green-200 hover:bg-white/10 hover:text-white'}`}
                                >
                                    {isActive(l.to) && <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-green-300" />}
                                    <l.icon className="!w-4 !h-4" />
                                    <span>{l.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="px-3 py-4 border-t border-white/10 space-y-1">
                <button
                    onClick={() => navigate('/')}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-green-200 hover:text-white hover:bg-white/10 transition"
                >
                    <IconEcoHome className="!w-4 !h-4" />
                    <span>{L('Về trang chủ', 'Back to home')}</span>
                </button>
                <button
                    onClick={() => { dispatch(logout()); navigate('/login') }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-300 hover:bg-red-500/10 transition"
                >
                    <IconArrowRight className="!w-4 !h-4" />
                    <span>{L('Đăng xuất', 'Log out')}</span>
                </button>
            </div>
        </aside>
    )
}

export default AdminSidebar
