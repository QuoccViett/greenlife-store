import { useState } from "react"
import { useSelector } from "react-redux"
import { Link, useNavigate } from 'react-router-dom'
import {
    IconLeaf, IconCart, IconUser, IconSearch,
    IconMenu, IconClose, IconHome, IconStore
} from './icons/index'
import { useLang } from '../context/LangContext'

const Navbar = () => {
    const { lang, toggleLang, t } = useLang()
    const [menuOpen, setMenuOpen] = useState(false)
    const [searchText, setSearchText] = useState('')
    const navigate = useNavigate()
    const cartItems = useSelector(state => state.cart.items)
    const { userInfo } = useSelector(state => state.auth)

    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0)

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchText.trim()) {
            navigate(`/products?search=${searchText}`)
            setSearchText('')
        }
    }

    return (
        <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="w-full px-6">
                <div className="px-4 py-3 flex items-center justify-between gap-4">
                    {/* Logo */}
                    <Link to='/' className="flex items-center gap-2 flex-shrink-0">
                        <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center">
                            <IconLeaf className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-green-700 font-bold text-lg hidden sm:block">Green Life</span>
                    </Link>

                    {/* Desktop Search */}
                    <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:flex">
                        <div className="flex w-full border border-gray-300 rounded-full overflow-hidden">
                            <input
                                type="text"
                                value={searchText}
                                onChange={e => setSearchText(e.target.value)}
                                placeholder={t('nav.search_placeholder')}
                                className="flex-1 px-4 py-2 text-sm outline-none"
                            />
                            <button type="submit" className="bg-green-700 px-4 text-white text-sm hover:bg-green-800 flex items-center gap-2">
                                <IconSearch className="w-4 h-4" />
                                <span>{t('nav.search')}</span>
                            </button>
                        </div>
                    </form>

                    {/* Right Icons */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleLang}
                            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-full text-xs font-semibold text-gray-600 hover:border-green-500 hover:text-green-600 transition"
                        >
                            <span>{lang === 'vi' ? '🇻🇳 VI' : '🇬🇧 EN'}</span>
                        </button>

                        <Link to='/cart' className='relative p-2 hover:bg-gray-200 rounded-full transition'>
                            <IconCart className="w-6 h-6 text-gray-700" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        {userInfo ? (
                            <Link to='/profile' className='hidden sm:flex items-center gap-1.5 text-sm text-gray-700 hover:text-green-600 transition font-medium'>
                                <IconUser className="w-4 h-4" />
                                {userInfo.name}
                            </Link>
                        ) : (
                            <Link to='/login' className="hidden sm:flex items-center gap-1.5 text-sm bg-green-700 text-white px-4 py-2 rounded-full hover:bg-green-800 transition">
                                <IconUser className="w-4 h-4" />
                                {t('nav.login')}
                            </Link>
                        )}

                        {userInfo?.role === 'admin' && (
                            <Link to='/admin' className="hidden sm:block text-sm text-white bg-green-800 px-3 py-1.5 rounded-full hover:bg-green-900 transition">
                                {t('nav.admin')}
                            </Link>
                        )}

                        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
                            {menuOpen ? <IconClose className="w-5 h-5 text-gray-700" /> : <IconMenu className="w-5 h-5 text-gray-700" />}
                        </button>
                    </div>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:block border-t border-gray-100 bg-white">
                    <div className="px-4 flex items-center justify-center gap-1">
                        <Link to='/' className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:text-green-700 whitespace-nowrap">
                            <IconHome className="w-4 h-4 mr-2" />
                            <span>{t('nav.home')}</span>
                        </Link>
                        <Link to='/products' className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:text-green-700 whitespace-nowrap">
                            <IconStore className="w-4 h-4 mr-2" />
                            <span>{t('nav.products')}</span>
                        </Link>
                        <Link to='/learn' className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-green-700 whitespace-nowrap">
                            {t('nav.learn')}
                        </Link>
                        <Link to="/about" className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-green-700 whitespace-nowrap transition">
                            {t('nav.about')}
                        </Link>
                        <Link to="/contact" className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-green-700 whitespace-nowrap transition">
                            {t('nav.contact')}
                        </Link>
                    </div>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden px-4 pb-4 flex flex-col gap-3 border-t border-gray-100">
                        <form onSubmit={handleSearch} className="mt-3 flex border border-gray-300 rounded-full overflow-hidden">
                            <input
                                type="text"
                                value={searchText}
                                onChange={e => setSearchText(e.target.value)}
                                placeholder={t('nav.search_placeholder')}
                                className="flex-1 px-4 py-2 text-sm outline-none"
                            />
                            <button type="submit" className="bg-green-600 px-4 text-white text-sm">
                                <IconSearch className="w-4 h-4" />
                            </button>
                        </form>

                        <Link to='/' onClick={() => setMenuOpen(false)} className="py-2 text-sm font-medium text-gray-700 border-b border-gray-50 flex items-center">
                            <IconHome className="w-4 h-4 mr-2 text-green-600" /> {t('nav.home')}
                        </Link>
                        <Link to='/products' onClick={() => setMenuOpen(false)} className="py-2 text-sm font-medium text-gray-700 border-b border-gray-50 flex items-center">
                            <IconStore className="w-4 h-4 mr-2 text-green-600" /> {t('nav.products')}
                        </Link>
                        {/* Các link khác tương tự... */}
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar