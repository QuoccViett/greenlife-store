import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { IconArrowRight, IconCart, IconStar, IconTag } from "../components/icons"
import { addToCart } from '../store/cartSlice'
import { useDispatch } from "react-redux"
import { useLang } from '../context/LangContext'

const API = import.meta.env.VITE_API_URL

const ProductDetailPage = () => {

    const { id } = useParams()
    const dispatch = useDispatch()
    const { t } = useLang()
    const navigate = useNavigate()

    const [product, setProduct] = useState(null)
    const [featured, setFeatured] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedImg, setSelectedImg] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [added, setAdded] = useState(false)

    useEffect(() => {
        const fetch = async () => {
            setLoading(true)
            try {
                const [productRes, featuredRes] = await Promise.all([
                    axios.get(`${API}/products/${id}`),
                    axios.get(`${API}/products?featured=true`),
                ])
                setProduct(productRes.data)
                setFeatured(featuredRes.data.filter(p => p._id !== id).slice(0, 4))
                setSelectedImg(0)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetch()
        window.scrollTo(0, 0)
    }, [id])

    const handleAddToCart = () => {
        dispatch(addToCart({ ...product, quantity }))
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
    }

    const handleBuyNow = () => {
        dispatch(addToCart({ ...product, quantity }))
        navigate('/cart')
    }

    if (loading) return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="grid md:grid-cols-2 gap-10 animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-2xl"></div>
                <div className="space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                </div>
            </div>
        </div>
    )

    if (!product) return (
        <div className="text-center py-20">
            <p className="text-gray-400 text-lg font-medium">{t('product.not_found')}</p>
            <Link to='/products' className='text-green-600 text-sm mt-3 inline-block hover:underline font-medium'>
                {t('product.return_shop')}
            </Link>
        </div>
    )

    const images = product.images?.length > 0
        ? product.images
        : [product.image || 'https://placehold.co/600x600/e8f5e9/2e7d32?text=GreenLife']

    const discount = product.salePrice
        ? Math.round((1 - product.salePrice / product.price) * 100)
        : 0

    return (
        <div className="min-h-screen bg-white">

            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Link to='/' className='hover:text-green-600 transition'>Home</Link>
                    <span>/</span>
                    <Link to='/products' className='hover:text-green-600 transition'>Products</Link>
                    {product?.category && (
                        <>
                            <span>/</span>
                            <Link to={`/products?category=${product?.category.slug}`} className='hover:text-green-600 transition'>
                                {product?.category.name}
                            </Link>
                        </>
                    )}
                    <span>/</span>
                    <span className="text-gray-600 line-clamp-1 italic">{product?.name}</span>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto px-4 py-10">

                <div className="md:w-1/2 flex flex-col gap-3 items-center">
                    <div className="w-80 h-80 md:w-full md:h-[400px] bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                        <img
                            src={images[selectedImg]}
                            alt={product.name}
                            className="w-full h-full object-cover transition duration-500 hover:scale-105"
                        />
                    </div>

                    {images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto mt-2 no-scrollbar">
                            {images.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedImg(i)}
                                    className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition
                                                ${selectedImg === i ? 'border-green-600' : 'border-gray-200 hover:border-green-300'}`}
                                >
                                    <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="md:w-1/2 flex flex-col justify-start">
                    <div className="space-y-4 text-left">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">{product.name}</h3>

                        <div className="flex justify-start items-center gap-2 text-sm text-gray-500">
                            <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <IconStar key={i} className={`!w-4 !h-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} />
                                ))}
                            </div>
                            <span>(4.0) • 12 {t('product.reviews')}</span> {/* Sửa Evaluate thành Reviews */}
                        </div>

                        <div className="flex justify-start items-center gap-3 mt-4">
                            {product.salePrice ? (
                                <>
                                    <span className="text-3xl font-bold text-green-700">
                                        ${product.salePrice.toLocaleString('en-US')}
                                    </span>
                                    <span className="text-lg text-gray-400 line-through">
                                        ${product.price.toLocaleString('en-US')}
                                    </span>
                                    <span className="bg-red-50 text-red-600 text-xs font-bold px-2 py-1 rounded-md">
                                        SAVE {discount}%
                                    </span>
                                </>
                            ) : (
                                <span className="text-3xl font-bold text-green-700">
                                    ${product.price.toLocaleString('en-US')}
                                </span>
                            )}
                        </div>

                        <div className="py-4 border-y border-gray-100">
                            <p className="text-sm md:text-base text-gray-600 leading-relaxed italic">
                                {product.description || t('product.description')}
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 pt-2">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    {product.stock > 0 ? (
                                        <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                                            Còn {product.stock} sản phẩm
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-red-100 text-red-600">
                                            Hết hàng
                                        </span>
                                    )}
                                    {product.stock <= 5 && product.stock > 0 && (
                                        <span className="text-xs text-orange-600 font-medium">
                                            Sắp hết hàng!
                                        </span>
                                    )}
                                </div>
                                <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{t('product.quantity')}</span>
                                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}

                                        className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition text-lg font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        −
                                    </button>
                                    <span className="px-4 py-1 text-sm font-bold min-w-[3rem] text-center">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                                        disabled={quantity >= product.stock}
                                        className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition text-lg font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        +
                                    </button>
                                </div>
                                {product.stock <= 5 && product.stock > 0 && (
                                    <p className="text-xs text-orange-600 font-medium">
                                        Chỉ còn {product.stock} sản phẩm — đặt hàng ngay!
                                    </p>
                                )}

                            </div>
                        </div>

                        <div className="flex justify-start gap-4 pt-6">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className={`flex items-center justify-center gap-2 py-3 px-8 rounded-full text-sm font-bold border-2 transition w-full sm:w-auto
                                            ${added ? 'border-green-600 bg-green-600 text-white' : 'border-green-600 text-green-600 hover:bg-green-50'}
                                            disabled:opacity-50 disabled:cursor-not-allowed shadow-sm`}
                            >
                                <IconCart className="!w-4 !h-4" />
                                {added ? t('product.added') : t('product.add_to_cart')}
                            </button>

                            <button
                                onClick={handleBuyNow}
                                disabled={product.stock === 0}
                                className="flex items-center justify-center gap-2 py-3 px-8 rounded-full text-sm font-bold bg-green-600 text-white hover:bg-green-700 transition w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-green-100"
                            >
                                {product.stock === 0 ? t('product.out_of_stock') : t('product.buy_now')}
                                <IconArrowRight className="!w-4 !h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <section className="bg-white py-16 border-t border-gray-100 mt-10">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">{t('product.related')}</h2>
                        <Link to='/products' className="flex items-center gap-1 text-sm text-green-600 font-semibold hover:gap-2 transition-all">
                            <span>{t('home.view_all')}</span>
                            <IconArrowRight className="!w-4 !h-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {featured.map(p => (
                            <Link key={p._id} to={`/products/${p._id}`} className="group block">
                                <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-3 border border-gray-100 group-hover:shadow-lg transition-all duration-300">
                                    <img
                                        src={p.image || 'https://placehold.co/400x400/e8f5e9/2e7d32?text=GreenLife'}
                                        alt={p.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                    />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-700 group-hover:text-green-600 transition line-clamp-1 mb-1">{p.name}</h3>
                                <div className="flex items-center gap-2">
                                    {p.salePrice ? (
                                        <>
                                            <span className="text-green-700 font-bold">
                                                ${p.salePrice.toLocaleString('en-US')}
                                            </span>
                                            <span className="text-gray-400 text-xs line-through">
                                                ${p.price.toLocaleString('en-US')}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-green-700 font-bold">${p.price.toLocaleString('en-US')}</span>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ProductDetailPage