import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import {
  IconTruck, IconRecycle, IconShield, IconRefresh,
  IconEcoHome, IconPersonalCare, IconBag, IconZeroWaste,
  IconBottle, IconArrowRight, IconLeaf,
  IconMail
} from '../components/icons'
import ProductCard from '../components/ProductCard'
import SkeletonCard from '../components/SkeletonCard'

const API = import.meta.env.VITE_API_URL

const benefits = [
    {
        icon: IconTruck,
        title: 'Free Shipping',
        desc: 'On orders over $20' // Sửa lỗi chính tả "Oreder"
    },
    {
        icon: IconRecycle,
        title: 'Sustainable Choice', // Đổi title để tránh lặp với desc
        desc: '100% Eco-Friendly'
    },
    {
        icon: IconShield,
        title: 'Secure Payment',
        desc: 'VNPay, MoMo & Cards' // Thêm "& Cards" để tăng độ uy tín
    },
    {
        icon: IconRefresh,
        title: 'Easy Returns',
        desc: '7-day policy' // Viết ngắn gọn, chuyên nghiệp hơn
    },
]

const categories = [
    {
        name: 'Eco Home & Living',
        slug: 'eco-home-living',
        icon: IconEcoHome,
        desc: 'Kitchen & Cleaning'
    },
    {
        name: 'Personal Care',
        slug: 'personal-care',
        icon: IconPersonalCare,
        desc: 'Safe & Natural'
    },
    {
        name: 'Reusable Bags',
        slug: 'reusable-bags',
        icon: IconBag,
        desc: 'Tote & Shopping'
    },
    {
        name: 'Zero Waste',
        slug: 'zero-waste',
        icon: IconZeroWaste,
        desc: 'Sustainable Storage'
    },
    {
        name: 'Daily Essentials',
        slug: 'daily-essentials',
        icon: IconBottle,
        desc: 'Bottles & Lunch Boxes'
    },
]

const HomePage = () => {

    const [ loading, setLoading ] = useState(true)
    const [ featured, setFeatured ] = useState([])
    const [newest, setNewest] = useState([])
    const [email, setEmail] = useState('')
 
    useEffect(()=>{
        const fetchProducts = async () => {
            try {
                const [featuredRes, newestRes] = await Promise.all([
                    axios.get(`${API}/products?featured=true`),
                    axios.get(`${API}/products`),
                ])
                setFeatured(featuredRes.data.slice(0, 4))
                setNewest(newestRes.data.slice(0, 8))
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    return(
        <div className="min-h-screen bg-white">

            {/* Hero Section */}
            <section className="w-full bg-gradient-to-br from-green-900 to-green-600 text-white">
                <div className='max-w-7xl mx-auto px-4 py-20 flex flex-col md:flex-row items-center gap-10'>
                    <div className='flex-1 text-center md:text-left'>
                        <span className='inline-flex items-center gap-1.5 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider'>
                            <IconLeaf className="!w-3.5 !h-3.5 mr-2" />
                            Eco-Friendly Selection
                        </span>
                        <h1 className='text-4xl md:text-5xl font-bold leading-tight mb-4'>
                            <span className='text-white'>Sustainable living</span><br/>
                            <span className='text-green-400'>made simple for you.</span>
                        </h1>
                        <p className='text-white text-base mb-8 max-w-md'>
                            Premium eco-friendly essentials for your home and lifestyle. Join us in making a positive impact on the planet.
                        </p>
                        <div className='flex gap-3 justify-center md:justify-start mt-8'>
                            <Link to='/products' className='flex items-center gap-2 bg-white text-green-800 font-semibold px-6 py-3 rounded-full hover:bg-green-50 transition'>
                                <span>Shop Now</span>
                                <IconArrowRight className='!w-4 !h-4'/>
                            </Link>
                            <Link to='/about' className='border border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-green-700 transition'>
                                Our Mission
                            </Link>
                        </div>
                    </div>
                    <div className='flex-1 flex justify-center'>
                        <div className='w-72 h-72 md:w-80 md:h-80 bg-green-700 rounded-full flex items-center justify-center'>
                            <IconLeaf className="!w-40 !h-40 text-green-500" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className='bg-green-100 py-6 border-y border-green-200'>
                <div className='max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4'>
                    {benefits.map((item, i) => (
                        <div key={i} className='flex items-center gap-3 justify-center '>
                            <div className='w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0'>
                                <item.icon className='!w-5 !h-5 text-green-700'/>
                            </div>

                            <div>
                                <p className='text-sm font-semibold text-gray-800 text-left'>{item.title}</p>
                                <p className='text-xs text-gray-500 text-left'>{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Categories Section */}
            <section className='max-w-7xl mx-auto px-4 py-14'>
                <div className='text-center mb-6'>
                    <h2 className='text-2xl font-bold text-gray-800'>Shop by Category</h2>
                    <p className='text-gray-500 text-sm mt-1'>Curated collections for a conscious lifestyle.</p>
                </div>
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4'>
                    {categories.map(cat => (
                        <Link
                            key={cat.slug}
                            to={`/products?category=${cat.slug}`}
                            className='flex flex-col items-center gap-3 p-5 bg-green-100 rounded-2xl hover:bg-green-200 transition group text-center'
                        >
                            <div className='w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition'>
                                <cat.icon className='!w-7 !h-7 text-gray-600'/>
                            </div>
                            <div>
                                <p className='text-sm font-semibold text-gray-800'>{cat.name}</p>
                                <p className='text-xs text-gray-500 mt-0.5'>{cat.desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
            
            {/* Featured Products */}
            <section className='bg-gray-50 py-14'>
                <div className='max-w-7xl mx-auto px-4'>
                    <div className='flex items-center justify-between mb-8'>
                        <div>
                            <h2 className='text-2xl font-bold text-gray-800'>Featured Selection</h2>
                            <p className='text-gray-500 text-sm mt-1'>Most loved by the GreenLife community</p>
                        </div>
                        <Link to='/products?featured=true' className='flex items-center gap-1 text-sm text-green-600 font-medium hover:underline'>
                            <span>View All</span>
                            <IconArrowRight className='!w-4 !h-4'/>
                        </Link>
                    </div>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                        {loading
                            ? [...Array(4)].map((_, i) => <SkeletonCard key={i}/>)
                            : featured.length > 0
                                ? featured.map(p => <ProductCard key={p._id} product={p}/>)
                                : <p className='col-span-4 text-center text-gray-400 py-10'>No featured products available</p>
                        }
                    </div>
                </div>
            </section>

            {/* Banner Section */}
            <section className='max-w-7xl mx-auto px-4 py-14'>
                <div className='bg-gradient-to-br from-green-900 to-green-600 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-white'>
                    <div className='flex items-center justify-center gap-4'>
                        <div className='w-14 h-14 bg-green-600 rounded-full flex items-center justify-center shrink-0'>
                            <IconLeaf className='!w-7 !h-7 text-white'/>
                        </div>
                        <div>
                            <h2 className='text-2xl font-bold mb-1 text-left !text-white'>Start Your Journey Today</h2>
                            <p className='!text-white text-sm text-left'>Small choices today lead to a healthier planet tomorrow.</p>
                        </div>
                    </div>
                    <Link
                        to='/products'
                        className='flex items-center gap-2 bg-white text-green-800 font-semibold px-8 py-3 rounded-full hover:bg-green-100 transition whitespace-nowrap shrink-0'
                    >
                        <span>Explore Collection</span>
                        <IconArrowRight className='!w-4 !h-4'/>
                    </Link>
                </div>
            </section>

            {/* New Arrivals */}
            <section className='bg-gray-50 py-14'>
                <div className='max-w-7xl mx-auto px-4'>
                    <div className='flex items-center justify-between mb-8'>
                        <div>
                            <h2 className='text-2xl font-bold text-gray-800'>New Arrivals</h2>
                            <p className='text-gray-500 text-sm mt-1'>The latest additions to our store</p>
                        </div>
                        <Link to='/products' className=' flex items-center gap-1 text-sm text-green-600 font-medium hover:underline'>
                            <span>View All</span>
                            <IconArrowRight className="!w-4 !h-4" />
                        </Link>
                    </div>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                        {loading
                            ? [...Array(8)].map((_, i) => <SkeletonCard key={i}/>)
                            : newest.length > 0
                                ? newest.map(p => <ProductCard key={p._id} product={p} />)
                                : <p className='col-span-4 text-center text-gray-400 py-10'>No products found</p>
                        }
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className='max-w-7xl mx-auto px-4 py-14 text-center'>
                <div className='w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <IconMail className='!w-7 !h-7 text-green-600'/>
                </div>
                <h2 className='text-2xl font-bold text-gray-800 mb-2'>Stay in the Loop</h2>
                <p className='text-gray-500 text-sm !mb-5'>Subscribe for exclusive offers and sustainable living tips.</p>
                <form
                    onSubmit={e => {e.preventDefault(); setEmail('') }}
                    className='flex max-w-md mx-auto border border-gray-300 rounded-full overflow-hidden focus-within:border-green-500 transition'
                >
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder='Your email address...'
                        className='flex-1 px-5 py-3 text-sm outline-none'
                        required
                    />
                    <button type='submit' className='bg-green-600 text-white px-6 text-sm font-medium hover:bg-green-700 transition'>Subscribe</button>
                </form>
            </section>

        </div>
    )
}

export default HomePage;