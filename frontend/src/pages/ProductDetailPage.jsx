import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { IconArrowRight, IconCart, IconStar, IconTag } from "../components/icons"
import { addToCart } from '../store/cartSlice'
import { useDispatch } from "react-redux"

const API = import.meta.env.VITE_API_URL

const ProductDetailPage = () => {

    const { id } = useParams()
    const dispatch = useDispatch()
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
            <p className="text-gray-400">No Product Found.</p>
            <Link to='/products' className='text-green-600 text-sm mt-2 inline-block hover:underline'>Back.</Link>
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
                    <span className="text-gray-600 line-clamp-1">{product?.name}</span>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto px-4 py-10">

                <div className="md:w-1/2 flex flex-col gap-3 items-center">
                    <div className="w-80 h-80 md:w-full md:h-[400px] bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                        <img
                            src={images[selectedImg]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto mt-2">
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

                <div className="md:w-1/2 flex flex-col justify-between">
                    <div className="space-y-3 text-left">
                        <h3 className="text-xl md:text-2xl font-semibold text-gray-800 line-clamp-2">{product.name}</h3>

                        <div className="flex justify-start items-center gap-2 text-sm text-gray-500">
                            <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <IconStar key={i} className={`!w-4 !h-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} />
                                ))}
                            </div>
                            <span>(4.0) . 12 Evaluate</span>
                        </div>

                        <p className="text-sm md:text-base text-gray-600 leading-relaxed mt-2 border-t border-gray-100 pt-3">
                            {product.description || 'The product is eco-friendly, made from sustainable natural materials.'}
                        </p>

                        <div className="flex justify-start items-center gap-2 text-right mt-4">
                            {product.salePrice ? (
                                <>
                                    <span className="text-2xl md:text-3xl font-bold text-green-700">
                                        ${product.salePrice.toLocaleString('en-US')}
                                    </span>
                                    <span className="text-sm md:text-lg text-gray-400 line-through">
                                        ${product.price.toLocaleString('en-US')}
                                    </span>
                                    <span className="bg-red-100 text-red-600 text-xs md:text-sm font-semibold px-2 py-0.5 rounded-full">
                                        -{discount}%
                                    </span>
                                </>
                            ) : (
                                <span className="text-2xl md:text-3xl font-bold text-green-700">
                                    ${product.price.toLocaleString('en-US')}
                                </span>
                            )}
                        </div>


                    </div>

                    <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                        <span className="text-sm font-medium text-gray-700">Amount: </span>
                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                            <button 
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition text-lg font-medium"
                            >
                                -
                            </button>
                            <span className="px-4 py-2 text-sm font-semibold border-x border-gray-300 min-w-12 text-center">
                                {quantity}
                            </span>
                            <button 
                                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                                className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition text-lg font-medium"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-start gap-3">
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className={`flex items-center gap-2 py-2 px-4 rounded-full text-sm font-semibold border-2 transition
                                            ${added ? 'border-green-600 bg-green-600 text-white' : 'border-green-600 text-green-600 hover:bg-green-50'}
                                            disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            <IconCart className="!w-4 !h-4" />
                            {added ? 'Added' : 'Add To Cart'}
                        </button>

                        <button
                            onClick={handleBuyNow}
                            disabled={product.stock === 0}
                            className="flex items-center gap-2 py-2 px-4 rounded-full text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Buy Now
                            <IconArrowRight className="!w-4 !h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <section className="bg-gray-50 py-12 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Featured Products</h2>
                        <Link to='/products?featured=true' className="flex items-center gap-1 text-sm text-green-600 font-medium hover:underline">
                            <span>See more</span>
                            <IconArrowRight className="!w-4 !h-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {featured.map(p => (
                            <Link key={p._id} to={`/products/${p._id}`} className="group bg-white rounded-2xl border-gray-100 overflow-hidden hover:shadow-md transition">
                                <div className="aspect-square bg-gray-50 overflow-hidden">
                                    <img
                                        src={p.image || 'https://placehold.co/400x400/e8f5e9/2e7d32?text=GreenLife'}
                                        alt={p.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2">{p.name}</h3>
                                    <div className="flex items-center gap-2">
                                        {p.salePrice ? (
                                            <>
                                                <span className="text-green-700 font-bold">
                                                    ${p.salePrice.toLocaleString('en-US')}
                                                </span>
                                                <span className="text-gray-400 text-sm line-through">
                                                    ${p.price.toLocaleString('en-US')}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-green-700 font-bold">${p.price.toLocaleString('en-US')}</span>
                                        )}
                                    </div>
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