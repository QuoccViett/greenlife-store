import { useState } from "react"
import { useSelector } from "react-redux"
import { Link, useNavigate } from 'react-router-dom'
import {
    IconLeaf, IconCart, IconUser, IconSearch,
    IconMenu, IconClose, IconChevronDown, IconHome
} from './icons/index'


const categories = [
    {
        name: 'Eco Home & Living',
        slug: 'eco-home-living',
        sub: [
            { name: 'Bamboo Products', slug: 'bamboo-products' },
            { name: 'Kitchen Tools', slug: 'kitchen-tools' },
            { name: 'Cleaning Supplies', slug: 'cleaning-supplies' },
        ]
    },
    {
        name: 'Personal Care',
        slug: 'personal-care',
        sub: [
            { name: 'Skincare', slug: 'skincare' },
            { name: 'Soap', slug: 'soap' },
            { name: 'Shampoo Bars', slug: 'shampoo-bar' },
        ]
    },
    {
        name: 'Reusable Bags',
        slug: 'reusable-bags',
        sub: [
            { name: 'Tote Bags', slug: 'tote-bags' },
            { name: 'Shopping Bags', slug: 'shopping-bags' },
        ]
    },
    {
        name: 'Zero Waste',
        slug: 'zero-waste',
        sub: [
            { name: 'Straws', slug: 'straws' },
            { name: 'Food Wraps', slug: 'food-wraps' },
            { name: 'Storage', slug: 'storage' },
        ]
    },
    {
        name: 'Daily Essentials',
        slug: 'daily-essentials',
        sub: [
            { name: 'Water Bottles', slug: 'water-bottles' },
            { name: 'Lunch Boxes', slug: 'lunch-boxes' },
        ]
    },

]


const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [activeDropdown, setActiveDropdown] = useState(null)
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
                <div className=" px-4 py-3 flex items-center justify-between gap-4">

                    <Link to='/' className="flex items-center gap-2 flex-shrink-0">
                        <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center">
                            <IconLeaf className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-green-700 font-bold text-lg hidden sm:block">Green Life</span>
                    </Link>


                    <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:flex">
                        <div className="flex w-full border border-gray-300 rounded-full overflow-hidden">
                            <input
                                type="text"
                                value={searchText}
                                onChange={e => setSearchText(e.target.value)}
                                placeholder="Search For Products..."
                                className="flex-1 px-4 py-2 text-sm outline-none"
                            />
                            <button type="submit" className="bg-green-700 px-4 text-white text-sm hover:bg-green-700">
                                <IconSearch className="w-4 h-4 pr-2" />
                                Search
                            </button>
                        </div>
                    </form>


                    <div className="flex items-center gap-4">

                        <Link to='/cart' className='relative p-2 hover:bg-gray-200 rounded-full transition'>
                            <IconCart className="w-6 h-6 text-gray-700" />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
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
                                Login
                            </Link>
                        )}


                        {userInfo?.role === 'admin' && (
                            <Link to='/admin' className="hidden sm:block text-sm text-white bg-green-800 px-3 py-1.5 rounded-full hover:bg-green-900 transition">
                                Admin
                            </Link>
                        )}

                        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
                            {menuOpen ? <IconClose className="w-5 h-5 text-gray-700" /> : <IconMenu className="w-5 h-5 text-gray-700" />}
                        </button>
                    </div>
                </div>

                <div className="hidden md:block border-t border-gray-100 bg-white">
                    <div className=" px-4 flex items-center justify-center gap-1">
                        <Link to='/' className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-green-700 whitespace-nowrap">
                            <IconHome className="w-4 h-4 pr-2" />
                            <span>Home</span>
                        </Link>
                        {categories.map(cat => (
                            <div
                                key={cat.slug}
                                className="relative group "
                                onMouseEnter={() => setActiveDropdown(cat.slug)}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                <Link
                                    to={`/product?category=${cat.slug}`}
                                    className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-green-700 whitespace-nowrap"
                                >
                                    <span>{cat.name}</span>
                                    <IconChevronDown className="w-3 h-3 mt-0.5 pl-2" />
                                </Link>

                                {activeDropdown === cat.slug && (
                                    <div className="absolute top-full left-0 bg-white shadow-lg rounded-b-lg border border-gray-100 py-2 min-w-48 z-50">
                                        {cat.sub.map(sub => (
                                            <Link
                                                key={sub.slug}
                                                to={`/products?category=${sub.slug}`}
                                                className="block px-4 py-2 text-sm text-gray-600 hover:bg-green-50 hover:underline text-left "
                                            >
                                                {sub.name}
                                            </Link>
                                        ))}

                                        <Link to='/products' className="block ml-auto px-4 py-2 text-left text-sm text-gray-600 hover:bg-green-50 hover:underline whitespace-nowrap">
                                            All Products
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {menuOpen && (
                    <div className="md:hidden px-4 pb-4 flex flex-col gap-3 border-t border-gray-100">
                        <form onSubmit={handleSearch} className="flex border border-gray-300 rounded-full overflow-hidden">
                            <input
                                type="text"
                                value={searchText}
                                onChange={e => setSearchText(e.target.value)}
                                placeholder="Search..."
                                className="flex-1 px-4 py-2 text-sm outline-none"
                            />
                            <button type="submit" className="bg-green-600 px-4 text-white text-sm"><IconSearch className="w-4 h-4" /></button>
                        </form>

                        <Link
                            to='/'
                            className="block px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-100 hover:text-green-700 whitespace-nowrap"
                            onClick={() => setMenuOpen(false)}
                        >
                            <IconHome className="w-4 h-4 pr-2 text-green-600" />
                            Home
                        </Link>

                        {categories.map(cat => (
                            <div key={cat.slug} className="border-b border-gray-100 ">
                                <Link
                                    to={`/product?category=${cat.slug}`}
                                    className="block py-2 px-4 text-sm font-medium text-gray-700 hover:text-green-700 whitespace-nowrap"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {cat.name}
                                </Link>
                                {/* <div className="pl-3 flex flex-col gap-1">
                                {cat.sub.map(sub => (
                                    <Link 
                                        key={sub.slug}
                                        to={`/products?category=${sub.slug}`}
                                        className="text-sm text-gray-50 hover:text-green-600"
                                    >
                                        - {sub.name}
                                    </Link>
                                ))}
                            </div> */}
                            </div>
                        ))}


                        {userInfo ? (
                            <Link to='/profile' className="text-sm text-gray-700" onClick={() => setMenuOpen(false)}>
                                <IconUser className="w-4 h-4" />
                                <span>{userInfo.name}</span>
                            </Link>
                        ) : (
                            <Link to='/login' className="text-sm text-gray-700" onClick={() => setMenuOpen(false)}>
                                <IconUser className="w-4 h-4 pr-2" />
                                <span>Login</span>
                            </Link>
                        )}

                        {userInfo?.role === 'admin' && (
                            <Link to='/admin' className="text-sm text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>
                                Admin
                            </Link>
                        )

                        }
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar
