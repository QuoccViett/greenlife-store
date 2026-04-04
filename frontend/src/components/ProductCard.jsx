import { Link } from 'react-router-dom'
import SkeletonCard from './SkeletonCard'

const ProductCard = ({ product = {} }) => {
    if (!product._id) return null
    return (
        <Link
            to={`/products/${product._id}`}
            className='group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition'
        >
            <div className='aspect-square bg-gray-50 overflow-hidden'>
                <img
                    src={product.image || 'https://placehold.co/400x400/e8f5e9/2e7d32?text=GreenLife'}
                    alt={product.name}
                    className='w-full h-full object-cover group-hover:scale-105 transition duration-300'
                />
            </div>
            <div className='p-4'>
                <p className='text-sm text-green-600 font-medium mb-1 uppercase tracking-wide'>
                    {product.category?.name || 'GreenLife'}
                </p>
                <h3 className='text-sm font-semibold text-gray-800 line-clamp-2 mb-2'>{product.name}</h3>
                <div className='flex items-center gap-2'>
                    {product.salePrice ? (
                        <>
                            <span className='text-green-700 font-bold'>
                                {product.salePrice.toLocaleString('en-US')}$
                            </span>
                            <span className='text-gray-400 text-sm line-through'>
                                {product.price.toLocaleString('en-US')}$
                            </span>
                        </>
                    ) : (
                        <span className='text-green-700 font-bold'>
                            {product.price.toLocaleString('en-US')}$
                        </span>
                    )
                    }
                </div>
            </div>
        </Link>
    )
}

export default ProductCard

