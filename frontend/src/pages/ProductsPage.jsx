import { useSearchParams } from "react-router-dom"
import { Link } from 'react-router-dom'
import { IconFilter, IconSliders, IconArrowRight, IconTag, IconTruck, IconRecycle, IconRefresh,IconShield } from '../components/icons'
import { useEffect, useState } from "react"
import ProductCard from "../components/ProductCard"
import SkeletonCard from "../components/SkeletonCard"
import axios from "axios"

const API = import.meta.env.VITE_API_URL

const categories = [
    {
        name: 'All Products',
        slug: ''
    },
    {
        name: 'Eco Home & Living',
        slug: 'eco-home-living',
        sub: [
            'bamboo-products',
            'kitchen-tools',
            'cleaning-supplies'
        ]
    },
    {
        name: 'Personal Care',
        slug: 'personal-care',
        sub: [
            'skincare',
            'soap',
            'shampoo-bars'
        ]
    },
    {
        name: 'Reusable Bags',
        slug: 'reusable-bags',
        sub: [
            'tote-bags',
            'shopping-bags',
        ]
    },
    {
        name: 'Zero Waste',
        slug: 'zero-waste',
        sub: [
            'straws',
            'food-wraps',
            'storage'
        ]
    },
    {
        name: 'Daily Essentials',
        slug: 'daily-essentials',
        sub: [
            'water-bottles',
            'lunch-boxes',
        ]
    },
]

const categoryBanners = {
    'eco-home-living': {
        title: 'Eco Home & Living',
        desc: 'Eco-friendly bamboo products, kitchen utensils, and personal hygiene items.',
        bg: 'from-green-800 to-green-600'
    },
    'personal-care': {
        title: 'Personal Care',
        desc: 'Natural skincare products, soaps, and shampoos.',
        bg: 'from-teal-800 to-teal-600'
    },
    'reusable-bags': {
        title: 'Reusable Bags',
        desc: 'Reusable tote bags and shopping bags designed for durability and style.',
        bg: 'from-emerald-800 to-emerald-600'
    },
    'zero-waste': {
        title: 'Zero Waste',
        desc: 'Eco-friendly straws, reusable food wraps, and zero-waste containers.',
        bg: 'from-lime-800 to-lime-600'
    },
    'daily-essentials': {
        title: 'Daily Essentials',
        desc: 'Reusable water bottles and lunch boxes for daily life',
        bg: 'from-cyan-800 to-cyan-600'
    },
    '': {
        title: 'All Products',
        desc: 'Explore the complete collection of green products at GreenLife Store.',
        bg: 'from-green-800 to-green-600'
    },
}

const benefits = [
    {
        icon: IconTruck,
        title: 'Free Shipping',
        desc: 'Oreder over 300$'
    },
    {
        icon: IconRecycle,
        title: '100% Eco-Friendly',
        desc: 'Eco-Friendly'
    },
    {
        icon: IconShield,
        title: 'Secure Payment',
        desc: 'VNPay & MoMo'
    },
    {
        icon: IconRefresh,
        title: 'Easy Returns',
        desc: 'Within 7 Days'
    },
]

const ITEMS_PER_PAGE = 12

const ProductsPage = () => {

    const [searchParams, setSearchParams] = useSearchParams()
    const [priceRange, setPriceRange] = useState([0, 10000])
    const [sortBy, setSortBy] = useState('newest')
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [cols, setCols] = useState(4)


    const category = searchParams.get('category') || ''
    const search = searchParams.get('search') || ''
    const sub = searchParams.get('sub') || ''
    const banner = categoryBanners[category] || categoryBanners['']
    
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            try {
                let url = `${API}/products?`
                if (category) url += `category=${category}&`
                if (sub) url += `sub=${sub}&`
                if (search) url += `search=${search}&`
                const res = await axios.get(url)
                setProducts(res.data)
                setPage(1)
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [category, sub, search])

    const filtered = products
        .filter(p => (p.salePrice || p.price) >= priceRange[0] && (p.salePrice || p.price) <= priceRange[1])
        .sort((a,b) => {
            if (sortBy === 'price-asc') return (a.salePrice || a.price) - (b.salePrice || b.price)
            if (sortBy === 'price-desc') return (b.salePrice || b.price) - (a.salePrice || a.price)
            return new Date(b.createdAt) - new Date(a.createdAt)
        })


    const paginated = filtered.slice((page-1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)

    const gridClass = {
        2: 'grid-cols-2',
        3: 'grid-cols-3 sm:grid-cols-3',
        4: 'grid-cols-4 sm:grid-cols-3 md:grid-cols-4',
    }

    return (
        <div className="min-h-screen bg-white">


            <section className={`w-full bg-gradient-to-br ${banner.bg} text-white py-12`}>
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-2 text-green-300 text-sm mb-2">
                        <Link to='/' className='hover:text-white transition'>
                            Home
                        </Link>
                        <span>/</span>
                        <span className="text-white">{banner.title}</span>
                    </div>
                    <div className="text-center">
                        <h1 className="text-3xl font-bold mb-2">{banner.title}</h1>

                        <p className="text-green-200 text-sm text-center !mb-5">
                            {banner.desc}
                        </p>

                        <p className="text-green-300 text-sm mt-2">
                            {products.length} Product
                        </p>
                    </div>
                </div>
            </section>


            <div className="max-w-7xl mx-auto px-4 py-10 flex gap-8">


                <aside className="hidden lg:block w-64 shrink-0">
                    <div className="sticky top-24 space-y-6">

                        <div>
                            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <IconFilter className="!w-4 !h-4 text-green-600"/>
                                Category
                            </h3>
                            <ul className="space-y-1">
                                {categories.map(cat => (
                                    <li key={cat.slug}>
                                        <button 
                                            onClick={() => setSearchParams(cat.slug ? { category : cat.slug } : {})}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                                                category === cat.slug
                                                    ? 'bg-green-600 text-white font-medium'
                                                    : 'text-gray-600 hover:bg-green-50 hover:text-green-700' 
                                            }`}
                                        >
                                            {cat.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3>
                                <IconSliders className="!w-4 !h-4 text-green-600 mr-4"/>
                                Price Range
                            </h3>
                            <div>
                                <input 
                                    type="range" 
                                    min={0}
                                    max={10000}
                                    value={priceRange[1]}
                                    onChange={e => setPriceRange([0, Number(e.target.value)])}
                                    className="w-full accent-green-600"
                                />
                                <div className="flex justify-between text-xs text-green-700 font-medium">
                                    <span>$0</span>
                                    <span> To ${priceRange[1]}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-3">
                                Sort
                            </h3>
                            <select
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-green-500"
                            >
                                <option value="newest">Newest</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </aside>


                <div className="flex-1 min-w-0">

                    <div className="flex items-center justify-between mb-6 gap-4">
                        <p className="text-sm text-gray-500">
                            Show <span className="font-medium text-gray-800">{paginated.length}</span> / <span className="font-medium text-gray-800">{filtered.length}</span> Product
                        </p>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden flex items-center gap-1.5 border border-gray-300 px-3 py-1.5 rounded-lg text-sm text-gray-700 hover:bg-green-500 transition"
                            >
                                <IconFilter className="!w-4 !h-4"/>
                                Filter
                            </button>

                            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                                {[2, 3, 4].map( c => (
                                    <button
                                        key={c}
                                        onClick={() => setCols(c)} 
                                        className={`px-3 py-1.5 text-sm transition ${cols === c ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>


                    { loading ? (
                        <div className={`grid ${gridClass[cols]} gap-4`}>
                            {[...Array(8)].map((_, i) => <SkeletonCard key={i}/>)}
                        </div>
                    
                    ) : paginated.length > 0 ? (
                        <div className={`grid ${gridClass[cols]} gap-4`}>
                            {paginated.map(p => <ProductCard key={p._id} product={p}/>)}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-gray-400 text-lg mb-2">No product found.</p>
                            <p className="text-gray-300 text-sm">Try searching with a different keyword.</p>
                        </div>
                    )}


                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-10">
                            <button
                                onClick={() => setPage(p => Math.max(1, p-1))}
                                disabled={page - 1}
                                className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:border-green-500 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                                Pre
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i + 1)}
                                    className={`w-9 h-9 rounded-lg text-sm font-medium transition ${page === i + 1 ? 'bg-green-600 text-white' : 'border border-gray-300 text-gray-600 hover:border-green-500'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button 
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:border-green-500 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>


            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)}></div>
                    <div className="absolute right-0 top-0 h-full w-72 bg-white p-6 overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-gray-800">Filter</h3>
                            <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-gray-600">X</button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h4 className="font-medium text-gray-700 mb-3">Category</h4>
                                <ul className="space-y-1">
                                    {categories.map(cat => (
                                        <li key={cat.slug}>
                                            <button
                                                onClick={() => { setSearchParams(cat.slug ? { categories: cat.slug } : {}); setSidebarOpen(false)}}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${category === cat.slug ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-green-50'}`}
                                            >
                                                {cat.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-medium text-gray-700 mb-3">Price Range</h4>
                                <input 
                                    type="range"
                                    min='0'
                                    max='1000'
                                    value={priceRange[1]}
                                    onChange={e => setPriceRange([0, Number(e.target.value)])}
                                    className="w-full accent-green-600" 
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span className="text-green-700 font-medium">$0</span>
                                    <span className="text-green-700 font-medium">To ${priceRange[1]}</span>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-700 mb-3">Sort</h4>
                                <select
                                    value={sortBy}
                                    onChange={e => setSortBy(e.target.value)}
                                    className="w-full border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                                >
                                    <option value="newest">Newest</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <section className="bg-green-50 py-8 border-t border-green-100">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {benefits.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 justify-center">
                            <span className="text-2xl">{item.icon}</span>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                                <p className="text-sm text-gray-500">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </section>

        </div>
    )
}

export default ProductsPage