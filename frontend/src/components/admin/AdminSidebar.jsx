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
import React, { useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import { 
  FaTachometerAlt, 
  FaBox, 
  FaShoppingCart, 
  FaUsers, 
  FaTruckLoading, 
  FaAddressBook,
  FaHome,
  FaSignOutAlt,
  FaLeaf
} from 'react-icons/fa';

const AdminSidebar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  return (
    <aside className="w-64 bg-emerald-900 text-white min-h-screen flex flex-col shrink-0">
      {/* Header Sidebar */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-emerald-700">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-emerald-800 font-bold">
          <FaLeaf />
        </div>
        <span className="text-xl font-bold text-emerald-200">GreenLife Admin</span>
      </div>

      {/* Thông tin Admin */}
      <div className="px-6 py-3 border-b border-emerald-800 text-xs text-emerald-300">
        Xin chào, <span className="font-semibold text-white">{userInfo?.name || 'Admin'}</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5 text-sm">
        <NavLink 
          to="/admin" 
          end
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive ? 'bg-emerald-700 font-bold text-white' : 'text-emerald-200 hover:bg-emerald-800 hover:text-white'}`}
        >
          <FaTachometerAlt /> Thống kê & Báo cáo
        </NavLink>

        <NavLink 
          to="/admin/products" 
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive ? 'bg-emerald-700 font-bold text-white' : 'text-emerald-200 hover:bg-emerald-800 hover:text-white'}`}
        >
          <FaBox /> Quản lý sản phẩm
        </NavLink>

        <NavLink 
          to="/admin/purchases" 
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive ? 'bg-emerald-700 font-bold text-white' : 'text-emerald-200 hover:bg-emerald-800 hover:text-white'}`}
        >
          <FaTruckLoading /> Nhập hàng & Giá vốn
        </NavLink>

        <NavLink 
          to="/admin/suppliers" 
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive ? 'bg-emerald-700 font-bold text-white' : 'text-emerald-200 hover:bg-emerald-800 hover:text-white'}`}
        >
          <FaAddressBook /> Nhà cung cấp
        </NavLink>

        <NavLink 
          to="/admin/orders" 
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive ? 'bg-emerald-700 font-bold text-white' : 'text-emerald-200 hover:bg-emerald-800 hover:text-white'}`}
        >
          <FaShoppingCart /> Đơn bán hàng
        </NavLink>

        <NavLink 
          to="/admin/users" 
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive ? 'bg-emerald-700 font-bold text-white' : 'text-emerald-200 hover:bg-emerald-800 hover:text-white'}`}
        >
          <FaUsers /> Người dùng
        </NavLink>
      </nav>

      {/* Footer Sidebar */}
      <div className="p-4 border-t border-emerald-800 space-y-1">
        <Link 
          to="/" 
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-emerald-300 hover:bg-emerald-800 hover:text-white transition"
        >
          <FaHome /> Trở về cửa hàng
        </Link>
        <button
          onClick={() => {
            dispatch(logout());
            navigate('/login');
          }}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-rose-300 hover:bg-rose-900/50 hover:text-white transition"
        >
          <FaSignOutAlt /> Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;