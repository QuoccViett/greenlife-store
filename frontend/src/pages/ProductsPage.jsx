import { useSearchParams } from "react-router-dom"
import { Link } from 'react-router-dom'
import { IconFilter, IconSliders, IconArrowRight, IconTag, IconTruck, IconRecycle, IconRefresh, IconShield, IconChevronDown, IconChevronRight } from '../components/icons'
import { useEffect, useState } from "react"
import { useLang } from '../context/LangContext'
import ProductCard from "../components/ProductCard"
import SkeletonCard from "../components/SkeletonCard"
import axios from "axios"
import SubMenu from "../components/SubMenu"

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
            { name: 'Bamboo Products', slug: 'bamboo-products' },
            { name: 'Kitchen Essentials', slug: 'kitchen-tools' }, // Đổi "Tools" thành "Essentials" nghe cao cấp hơn
            { name: 'Natural Cleaning', slug: 'cleaning-supplies' }, // "Natural Cleaning" tạo cảm giác sạch và an toàn
        ]
    },
    {
        name: 'Personal Care',
        slug: 'personal-care',
        sub: [
            { name: 'Organic Skincare', slug: 'skincare' }, // Thêm "Organic" để nhấn mạnh tính chất eco
            { name: 'Natural Soaps', slug: 'soap' },
            { name: 'Shampoo Bars', slug: 'shampoo-bars' },
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
            { name: 'Eco Straws', slug: 'straws' },
            { name: 'Sustainable Wraps', slug: 'food-wraps' },
            { name: 'Eco Storage', slug: 'storage' },
        ]
    },
    {
        name: 'Daily Essentials',
        slug: 'daily-essentials',
        sub: [
            { name: 'Reusable Bottles', slug: 'water-bottles' },
            { name: 'Lunch Boxes', slug: 'lunch-boxes' },
        ]
    },
]

const categoryBanners = {
    'eco-home-living': {
        title: 'Eco Home & Living',
        desc: 'Sustainable bamboo products, kitchen essentials, and natural home care items for a greener space.',
        bg: 'from-green-800 to-green-600'
    },
    'personal-care': {
        title: 'Personal Care',
        desc: 'Organic skincare, handcrafted soaps, and plastic-free hygiene alternatives for your daily routine.',
        bg: 'from-teal-800 to-teal-600'
    },
    'reusable-bags': {
        title: 'Reusable Bags',
        desc: 'Stylish and durable eco-friendly bags designed to reduce single-use plastic waste.',
        bg: 'from-emerald-800 to-emerald-600'
    },
    'zero-waste': {
        title: 'Zero Waste Lifestyle',
        desc: 'Everything you need to eliminate waste: from eco-straws to sustainable food storage solutions.',
        bg: 'from-lime-800 to-lime-600'
    },
    'daily-essentials': {
        title: 'Daily Essentials',
        desc: 'Your perfect on-the-go companions: reusable water bottles and eco-conscious lunch boxes.',
        bg: 'from-cyan-800 to-cyan-600'
    },
    '': {
        title: 'Our Collection', // Đổi "All Products" thành "Our Collection" nghe tinh tế hơn
        desc: 'Explore our full range of sustainable products curated for a conscious lifestyle.',
        bg: 'from-green-800 to-green-600'
    },
}

const benefits = [
    {
        icon: IconTruck,
        title: 'Free Shipping',
        desc: 'Orders over $300' // Sửa lỗi chính tả "Oreder"
    },
    {
        icon: IconRecycle,
        title: 'Eco-Friendly',
        desc: '100% Sustainable' // Đổi desc để không bị lặp chữ với title
    },
    {
        icon: IconShield,
        title: 'Secure Payment',
        desc: 'VNPay, MoMo & Cards'
    },
    {
        icon: IconRefresh,
        title: 'Easy Returns',
        desc: 'Within 7 days'
    },
]

const ITEMS_PER_PAGE = 12

const ProductsPage = () => {
    const { t } = useLang()
    const [searchParams, setSearchParams] = useSearchParams()
    const [priceRange, setPriceRange] = useState([0, 50])
    const [sortBy, setSortBy] = useState('newest')
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [cols, setCols] = useState(4)
    const [openCat, setOpenCat] = useState(null)

    const category = searchParams.get('category') || ''
    const search = searchParams.get('search') || ''
    const sub = searchParams.get('sub') || ''
    const banner = categoryBanners[category] || categoryBanners['']
    const bannerKey = category || 'default'
    const bannerTitle = t(`product.banners.${bannerKey}.title`)
    const bannerDesc = t(`product.banners.${bannerKey}.desc`)

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
        .sort((a, b) => {
            if (sortBy === 'price-asc') return (a.salePrice || a.price) - (b.salePrice || b.price)
            if (sortBy === 'price-desc') return (b.salePrice || b.price) - (a.salePrice || a.price)
            if (sortBy === 'best-selling') return (b.sold || 0) - (a.sold || 0)
            if (sortBy === 'popular') return (b.sold || 0) - (a.sold || 0)
            if (sortBy === 'rating') return (b.rating || 4) - (a.rating || 4)
            // newest (default)
            return new Date(b.createdAt) - new Date(a.createdAt)
        })

    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)

    const gridClass = {
        2: 'grid-cols-2',
        3: 'grid-cols-3 sm:grid-cols-3',
        4: 'grid-cols-4 sm:grid-cols-3 md:grid-cols-4',
    }

    const categoryKeyMap = {
        'eco-home-living': 'home',
        'personal-care': 'personal',
        'reusable-bags': 'bags',
        'zero-waste': 'zerowaste',
        'daily-essentials': 'bottles',
        '': 'home'
    }

    const benefitsLocal = [
        { icon: IconTruck, title: t('benefits.free_shipping'), desc: t('benefits.free_shipping_desc') },
        { icon: IconRecycle, title: t('benefits.sustainable'), desc: t('benefits.sustainable_desc') },
        { icon: IconShield, title: t('benefits.secure_payment'), desc: t('benefits.secure_payment_desc') },
        { icon: IconRefresh, title: t('benefits.easy_returns'), desc: t('benefits.easy_returns_desc') },
    ]

    return (
        <div className="min-h-screen bg-white">
            <section className={`w-full bg-gradient-to-br ${banner.bg} text-white py-12`}>
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-2 text-green-300 text-sm mb-2">
                        <Link to='/' className='hover:text-white transition'>{t('nav.home')}</Link>
                        {!sub ? (
                            <>
                                <span>/</span>
                                <span className="text-white">{bannerTitle}</span>
                            </>
                        ) : (
                            <>
                                <span>/</span>
                                <Link to={`/products?category=${category}`} className='hover:text-white transition'>{bannerTitle}</Link>
                                <span>/</span>
                                {categories.map((cat) => (
                                    cat.sub && cat.sub.map(subItem => (
                                        <span key={subItem.slug} className="text-white">
                                            {sub === subItem.slug ? subItem.name : ''}
                                        </span>
                                    ))
                                ))}
                            </>
                        )}
                    </div>
                    <div className="text-center">
                        <h1 className="text-3xl font-bold mb-2">{bannerTitle}</h1>
                        <p className="text-green-200 text-sm text-center !mb-5">{bannerDesc}</p>
                        <p className="text-green-300 text-sm mt-2">
                            {products.length} {products.length > 1 ? t('product.items_count_plural') : t('product.items_count')}
                        </p>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 py-10 flex gap-8">
                <aside className="hidden lg:block w-64 shrink-0">
                    <div className="sticky top-24 space-y-6">
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <IconFilter className="!w-4 !h-4 text-green-600" />
                                {t('product.categories')}
                            </h3>
                            <ul className="space-y-1">
                                {categories.map(cat => {
                                    const isActiveCat = category === cat.slug
                                    const isOPen = openCat === cat.slug
                                    return (
                                        <li key={cat.slug}>
                                            <button
                                                onClick={() => {
                                                    setSearchParams(cat.slug ? { category: cat.slug } : {})
                                                    setOpenCat(isOPen ? null : cat.slug)
                                                }}
                                                className={`w-full px-3 py-2 rounded-lg text-sm transition flex items-center justify-between
                                                    ${isActiveCat && sub === '' ? 'bg-green-600 text-white font-medium' : 'text-gray-600 hover:bg-green-50 hover:text-green-700'}`}
                                            >
                                                <span>{t(`product.categories_list.${categoryKeyMap[cat.slug] || 'home'}`) || cat.name}</span>
                                                {cat.slug !== '' ? (isOPen ? <IconChevronDown className="!w-4 !h-4" /> : <IconChevronRight className="!w-4 !h-4" />) : null}
                                            </button>
                                            {cat.sub && (
                                                <SubMenu isOpen={isOPen}>
                                                    {cat.sub.map(subCat => {
                                                        const isActiveSub = sub === subCat.slug;
                                                        return (
                                                            <li key={subCat.slug}>
                                                                <button
                                                                    onClick={() => setSearchParams({ category: cat.slug, sub: subCat.slug })}
                                                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${isActiveSub ? 'bg-green-600 text-white font-medium' : 'text-gray-600 hover:bg-green-50 hover:text-green-700'}`}
                                                                >
                                                                    {t(`product.subcategories.${subCat.slug}`) || subCat.name}
                                                                </button>
                                                            </li>
                                                        )
                                                    })}
                                                </SubMenu>
                                            )}
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <IconSliders className="!w-4 !h-4 text-green-600" />
                                {t('product.price_range')}
                            </h3>
                            <div>
                                <input
                                    type="range"
                                    min={0}
                                    max={50}
                                    value={priceRange[1]}
                                    onChange={e => setPriceRange([0, Number(e.target.value)])}
                                    className="w-full accent-green-600"
                                />
                                <div className="flex justify-between text-xs text-green-700 font-medium">
                                    <span>$0</span>
                                    <span>{t('product.up_to', { price: `${priceRange[1]}` })}</span>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <h3 className="font-semibold text-gray-800 mb-3">{t('product.sort_by')}</h3>
                            <select
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value)}
                                className="appearance-none w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-green-500"
                            >
                                <option value="newest">Mới nhất</option>
                                <option value="popular">Phổ biến nhất</option>
                                <option value="best-selling">Bán chạy nhất</option>
                                <option value="rating">Đánh giá cao</option>
                                <option value="price-asc">Giá tăng dần</option>
                                <option value="price-desc">Giá giảm dần</option>
                            </select>
                            <div className="absolute z-50 top-11 right-4 flex items-center pointer-events-none text-gray-500">
                                <IconChevronDown className='!w-4 !h-4' />
                            </div>
                        </div>
                    </div>
                </aside>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-6 gap-4">
                        <p className="text-sm text-gray-500">
                            {t('product.showing')} <span className="font-medium text-gray-800">{paginated.length}</span> / <span className="font-medium text-gray-800">{filtered.length}</span> {t('product.results')}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden flex items-center gap-1.5 border border-gray-300 px-3 py-1.5 rounded-lg text-sm text-gray-700 hover:bg-green-50 transition"
                            >
                                <IconFilter className="!w-4 !h-4" /> {t('product.filter')}
                            </button>


                            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                                {[2, 3, 4].map(c => (
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

                    {loading ? (
                        <div className={`grid ${gridClass[cols]} gap-4`}>
                            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
                        </div>
                    ) : paginated.length > 0 ? (
                        <div className={`grid ${gridClass[cols]} gap-4`}>
                            {paginated.map(p => <ProductCard key={p._id} product={p} />)}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-gray-400 text-lg mb-2">{t('product.not_found')}</p>
                            <p className="text-gray-300 text-sm">{t('product.try_filters')}</p>
                        </div>
                    )}


                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-10">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:border-green-500 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                                {t('pagination.prev')}
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
                                {t('pagination.next')}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Sidebar (giữ nguyên logic của bạn) */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)}></div>
                    <div className="absolute right-0 top-0 h-full w-72 bg-white p-6 overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-gray-800">{t('product.filter')}</h3>
                            <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-gray-600">{t('ui.close')}</button>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <h4 className="font-medium text-gray-700 mb-3">{t('product.categories')}</h4>
                                <ul className="space-y-1">
                                    {categories.map(cat => (
                                        <li key={cat.slug}>
                                            <button
                                                onClick={() => { setSearchParams(cat.slug ? { category: cat.slug } : {}); setSidebarOpen(false) }}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${category === cat.slug ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-green-50'}`}
                                            >
                                                {t(`product.categories_list.${categoryKeyMap[cat.slug] || 'home'}`) || cat.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {/* ... Các phần khác tương tự đã sửa ở Desktop Sidebar ... */}
                        </div>
                    </div>
                </div>
            )}

            <section className="bg-green-50 py-8 border-t border-green-100">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {benefitsLocal.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 justify-center">
                            <item.icon className="!w-5 !h-5 text-green-600" />
                            <div>
                                <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                                <p className="text-xs text-gray-500">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default ProductsPage