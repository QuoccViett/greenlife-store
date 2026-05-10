import { useSearchParams, Link } from "react-router-dom";
import {
    IconFilter,
    IconSliders,
    IconChevronDown,
    IconChevronRight,
    IconTruck,
    IconRecycle,
    IconShield,
    IconRefresh,
} from "../components/icons";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import SkeletonCard from "../components/SkeletonCard";
import axios from "axios";
import SubMenu from "../components/SubMenu";
import { useLang } from "../context/LangContext"; // Giả định import này

const API = import.meta.env.VITE_API_URL;

// Mapping slug sang key dịch thuật (tránh lỗi categoryKeyMap is not defined)
const categoryKeyMap = {
    "": "home",
    "eco-home-living": "eco_home",
    "personal-care": "personal_care",
    "reusable-bags": "bags",
    "zero-waste": "zero_waste",
    "daily-essentials": "essentials"
};

const categories = [
    { name: "All Products", slug: "" },
    {
        name: "Eco Home & Living",
        slug: "eco-home-living",
        sub: [
            { name: "Bamboo Products", slug: "bamboo-products" },
            { name: "Kitchen Tools", slug: "kitchen-tools" },
            { name: "Cleaning Supplies", slug: "cleaning-supplies" },
        ],
    },
    {
        name: "Personal Care",
        slug: "personal-care",
        sub: [
            { name: "Skincare", slug: "skincare" },
            { name: "Soap", slug: "soap" },
            { name: "Shampoo Bars", slug: "shampoo-bars" },
        ],
    },
    {
        name: "Reusable Bags",
        slug: "reusable-bags",
        sub: [
            { name: "Tote Bags", slug: "tote-bags" },
            { name: "Shopping Bags", slug: "shopping-bags" },
        ],
    },
    {
        name: "Zero Waste",
        slug: "zero-waste",
        sub: [
            { name: "Straws", slug: "straws" },
            { name: "Food Wraps", slug: "food-wraps" },
            { name: "Storage", slug: "storage" },
        ],
    },
    {
        name: "Daily Essentials",
        slug: "daily-essentials",
        sub: [
            { name: "Water Bottles", slug: "water-bottles" },
            { name: "Lunch Boxes", slug: "lunch-boxes" },
        ],
    },
];

const categoryBanners = {
    "eco-home-living": {
        title: "Eco Home & Living",
        desc: "Eco-friendly bamboo products, kitchen utensils, and personal hygiene items.",
        bg: "from-green-800 to-green-600",
    },
    "personal-care": {
        title: "Personal Care",
        desc: "Natural skincare products, soaps, and shampoos.",
        bg: "from-teal-800 to-teal-600",
    },
    "reusable-bags": {
        title: "Reusable Bags",
        desc: "Reusable tote bags and shopping bags designed for durability and style.",
        bg: "from-emerald-800 to-emerald-600",
    },
    "zero-waste": {
        title: "Zero Waste",
        desc: "Eco-friendly straws, reusable food wraps, and zero-waste containers.",
        bg: "from-lime-800 to-lime-600",
    },
    "daily-essentials": {
        title: "Daily Essentials",
        desc: "Reusable water bottles and lunch boxes for daily life",
        bg: "from-cyan-800 to-cyan-600",
    },
    "": {
        title: "All Products",
        desc: "Explore the complete collection of green products at GreenLife Store.",
        bg: "from-green-800 to-green-600",
    },
};

const benefits = [
    { icon: IconTruck, title: 'Free Shipping', desc: 'Orders over $300' },
    { icon: IconRecycle, title: 'Eco-Friendly', desc: '100% Sustainable' },
    { icon: IconShield, title: 'Secure Payment', desc: 'VNPay, MoMo & Cards' },
    { icon: IconRefresh, title: 'Easy Returns', desc: 'Within 7 days' },
];

const ITEMS_PER_PAGE = 12;

const ProductsPage = () => {
    const { t } = useLang();
    const [searchParams, setSearchParams] = useSearchParams();
    const [priceRange, setPriceRange] = useState([0, 50]);
    const [sortBy, setSortBy] = useState('newest');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [cols, setCols] = useState(4);
    const [openCat, setOpenCat] = useState(null);

    const category = searchParams.get("category") || "";
    const search = searchParams.get("search") || "";
    const sub = searchParams.get("sub") || "";
    const banner = categoryBanners[category] || categoryBanners[""];

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let url = `${API}/products?`;
                if (category) url += `category=${category}&`;
                if (sub) url += `sub=${sub}&`;
                if (search) url += `search=${search}&`;
                const res = await axios.get(url);
                setProducts(res.data);
                setPage(1);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [category, sub, search]);

    const filtered = products
        .filter(p => (p.salePrice || p.price) >= priceRange[0] && (p.salePrice || p.price) <= priceRange[1])
        .sort((a, b) => {
            const priceA = a.salePrice || a.price;
            const priceB = b.salePrice || b.price;
            if (sortBy === 'price-asc') return priceA - priceB;
            if (sortBy === 'price-desc') return priceB - priceA;
            if (sortBy === 'best-selling' || sortBy === 'popular') return (b.sold || 0) - (a.sold || 0);
            if (sortBy === 'rating') return (b.rating || 4) - (a.rating || 4);
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const gridClass = {
        2: "grid-cols-2",
        3: "grid-cols-3",
        4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header Banner */}
            <section className={`w-full bg-gradient-to-br ${banner.bg} text-white py-12`}>
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-2 text-green-300 text-sm mb-4">
                        <Link to="/" className="hover:text-white transition">Home</Link>
                        <span>/</span>
                        {!sub ? (
                            <span className="text-white">{banner.title}</span>
                        ) : (
                            <>
                                <Link to={`/products?category=${category}`} className="hover:text-white transition">{banner.title}</Link>
                                <span>/</span>
                                <span className="text-white">{sub}</span>
                            </>
                        )}
                    </div>
                    <div className="text-center">
                        <h1 className="text-3xl font-bold mb-2">{banner.title}</h1>
                        <p className="text-green-200 text-sm mb-5">{banner.desc}</p>
                        <p className="text-green-300 text-sm">{products.length} Products</p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:block w-64 shrink-0">
                    <div className="sticky top-24 space-y-6">
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <IconFilter className="w-4 h-4 text-green-600" />
                                {t('product.categories')}
                            </h3>
                            <ul className="space-y-1">
                                {categories.map(cat => {
                                    const isActiveCat = category === cat.slug;
                                    const isOpen = openCat === cat.slug;
                                    return (
                                        <li key={cat.slug}>
                                            <button
                                                onClick={() => {
                                                    setSearchParams(cat.slug ? { category: cat.slug } : {});
                                                    setOpenCat(isOpen ? null : cat.slug);
                                                }}
                                                className={`w-full px-3 py-2 rounded-lg text-sm transition flex items-center justify-between
                                                    ${isActiveCat && sub === '' ? 'bg-green-600 text-white font-medium' : 'text-gray-600 hover:bg-green-50'}`}
                                            >
                                                <span>{t(`product.categories_list.${categoryKeyMap[cat.slug]}`) || cat.name}</span>
                                                {cat.slug !== '' && (isOpen ? <IconChevronDown className="w-4 h-4" /> : <IconChevronRight className="w-4 h-4" />)}
                                            </button>
                                            {cat.sub && isOpen && (
                                                <ul className="ml-4 mt-1 space-y-1 border-l border-green-100">
                                                    {cat.sub.map(subCat => (
                                                        <li key={subCat.slug}>
                                                            <button
                                                                onClick={() => setSearchParams({ category: cat.slug, sub: subCat.slug })}
                                                                className={`w-full text-left px-4 py-1.5 text-sm transition ${sub === subCat.slug ? 'text-green-600 font-bold' : 'text-gray-500 hover:text-green-600'}`}
                                                            >
                                                                {subCat.name}
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* Price Range */}
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <IconSliders className="w-4 h-4 text-green-600" />
                                {t('product.price_range')}
                            </h3>
                            <input
                                type="range" min={0} max={50} value={priceRange[1]}
                                onChange={e => setPriceRange([0, Number(e.target.value)])}
                                className="w-full accent-green-600"
                            />
                            <div className="flex justify-between text-xs text-green-700 font-medium mt-1">
                                <span>$0</span>
                                <span>{t('product.up_to', { price: `${priceRange[1]}` })}</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-6">
                        <p className="text-sm text-gray-500">
                            {t('product.showing')} <span className="font-medium text-gray-800">{paginated.length}</span> / {filtered.length} {t('product.results')}
                        </p>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setSidebarOpen(true)} className="lg:hidden border px-3 py-1.5 rounded-lg text-sm flex items-center gap-2">
                                <IconFilter className="w-4 h-4" /> {t('product.filter')}
                            </button>
                            <div className="hidden sm:flex border rounded-lg overflow-hidden">
                                {[2, 3, 4].map(c => (
                                    <button key={c} onClick={() => setCols(c)} className={`px-3 py-1 text-sm ${cols === c ? 'bg-green-600 text-white' : 'hover:bg-gray-50'}`}>
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
                            <p className="text-gray-400 text-lg">{t('product.not_found') || "No products found."}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Sidebar */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)}></div>
                    <div className="absolute right-0 top-0 h-full w-72 bg-white p-6 overflow-y-auto">
                        <div className="flex justify-between mb-6">
                            <h3 className="font-bold">{t('product.filter')}</h3>
                            <button onClick={() => setSidebarOpen(false)}>Close</button>
                        </div>
                        <div className="space-y-6">
                            {categories.map(cat => (
                                <button key={cat.slug} 
                                    onClick={() => { setSearchParams(cat.slug ? { category: cat.slug } : {}); setSidebarOpen(false); }}
                                    className={`block w-full text-left py-2 ${category === cat.slug ? 'text-green-600 font-bold' : ''}`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Benefits Section */}
            <section className="bg-green-50 py-10 border-t border-green-100">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
                    {benefits.map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <div key={i} className="flex items-center gap-3">
                                <Icon className="w-8 h-8 text-green-600" />
                                <div>
                                    <p className="text-sm font-bold text-gray-800">{item.title}</p>
                                    <p className="text-xs text-gray-500">{item.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};

export default ProductsPage;