import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { IconArrowLeft, IconArrowRight, IconCart, IconClose, IconRecycle, IconShield, IconTruck } from '../components/icons'
import { removeFromCart, updateQuantity, clearCart } from '../store/cartSlice'

const CartPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { items } = useSelector(state => state.cart)
    const { userInfo } = useSelector(state => state.auth)

    const subtotal = items?.reduce((acc, item) => acc + (item.salePrice || item.price) * item.quantity, 0)
    const shipping = subtotal >= 20 ? 0 : 5
    const total = subtotal + shipping

    const handleCheckout = () => {
        if (!userInfo) {
            navigate('/login')
            return
        }
        navigate('/checkout')
    }

    if (items.length === 0) return (
        <div className='min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 px-4'>
            <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center'>
                <IconCart className='!w-10 !h-10 text-green-600'/>
            </div>
            <h2 className='text-xl font-bold text-gray-800'>Your Cart Is Empty</h2>
            <p className='text-gray-500'>You haven't added any items to your cart yet.</p>
            <Link
                to={'/products'}
                className='flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-green-700 transition'
            >
                <span>Continue Shopping</span>
                <IconArrowRight className='!w-4 !h-4'/>
            </Link>
        </div>
    )

    return (
        <div className='min-h-screen bg-gray-50'>
            <div className='bg-white border-b border-gray-200'>
                <div className='max-w-7xl mx-auto px-4 py-6'>
                    <h1 className='text-2xl font-bold text-gray-800'>
                        Shopping Cart
                    </h1>
                    <p className='text-gray-500 text-sm mt-1'>
                        {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
                    </p>
                </div>
            </div>

            <div className='max-w-7xl mx-auto px-4 py-8'>
                <div className='grid lg:grid-cols-3 gap-8'>
                    {/* Cart Items List */}
                    <div className='lg:col-span-2 space-y-4'>
                        {items.map(item => (
                            <div
                                key={item._id}
                                className='bg-white rounded-2xl border border-gray-100 p-4 flex gap-4'
                            >
                                <Link to={`/products/${item._id}`} className='shrink-0'>
                                    <img
                                        src={item.image || 'https://placehold.co/100x100/e8f5e9/2e7d32?text=GL'}
                                        alt={item.name}
                                        className='w-24 h-24 object-cover rounded-xl'
                                    />
                                </Link>

                                <div className='flex-1 min-w-0'>
                                    <div className='flex items-start justify-between gap-2'>
                                        <div>
                                            <p className='text-xs text-green-600 font-medium mb-0.5'>
                                                {item.category?.name || 'GreenLife'}
                                            </p>
                                            <Link to={`/products/${item._id}`} className='text-sm font-semibold text-gray-800 hover:text-green-600 line-clamp-2'>
                                                {item.name}
                                            </Link>
                                        </div>
                                        <button
                                            className='text-gray-400 hover:text-red-500 transition shrink-0 p-1'
                                            onClick={() => dispatch(removeFromCart(item._id))}
                                        >
                                            <IconClose className='!w-4 !h-4' />
                                        </button>
                                    </div>

                                    <div className='flex items-center justify-between mt-3'>
                                        <div className='flex items-center border border-gray-200 rounded-lg overflow-hidden'>
                                            <button
                                                onClick={() => item.quantity > 1
                                                    ? dispatch(updateQuantity({ id: item._id, quantity: item.quantity - 1 }))
                                                    : dispatch(removeFromCart(item._id))
                                                }
                                                className='px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition text-sm font-medium'
                                            >
                                                -
                                            </button>
                                            <span className='px-3 py-1.5 text-sm font-semibold border-x border-gray-200 min-w-10 text-center'>
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity + 1 }))}
                                                className='px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition text-sm font-medium'
                                            >
                                                +
                                            </button>
                                        </div>

                                        <div className='text-right'>
                                            <p className='text-sm font-bold text-green-700'>
                                                ${((item.salePrice || item.price) * item.quantity).toLocaleString('en-US')}
                                            </p>
                                            {item.salePrice && (
                                                <p className='text-xs text-gray-400 line-through'>
                                                    ${(item.price * item.quantity).toLocaleString('en-US')}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className='flex items-center justify-between pt-2'>
                            <Link to='/products' className='text-sm text-green-600 hover:underline flex items-center gap-1 font-medium'>
                                <IconArrowLeft className='!w-4 !h-4 me-1' />
                                Continue Shopping
                            </Link>
                            <button 
                                className='text-sm text-red-500 hover:text-red-700 transition font-medium' 
                                onClick={() => dispatch(clearCart())}
                            >
                                Clear All Cart
                            </button>
                        </div>
                    </div>

                    {/* Order Summary Side */}
                    <div className='lg:col-span-1'>
                        <div className='bg-white rounded-2xl border border-gray-100 p-6 sticky top-24'>
                            <h2 className='text-lg font-bold text-gray-800 mb-5'>Order Summary</h2>

                            <div className='space-y-3 text-sm'>
                                <div className='flex justify-between text-gray-600'>
                                    <span>
                                        Subtotal ({items.reduce((a, i) => a + i.quantity, 0)} items)
                                    </span>
                                    <span className='font-medium text-gray-800'>
                                        ${subtotal.toLocaleString('en-US')}
                                    </span>
                                </div>
                                
                                <div className='flex justify-between text-gray-600'>
                                    <span>Shipping Fee</span>
                                    {shipping === 0 ? (
                                        <span className='text-green-600 font-medium'>Free</span>
                                    ) : (
                                        <span className='font-medium text-gray-800'>${shipping}</span>
                                    )}
                                </div>

                                {shipping > 0 && (
                                    <p className='text-xs text-gray-400 !mb-4 text-left italic'>
                                        Spend ${(20 - subtotal).toFixed(2)} more to qualify for Free Shipping
                                    </p>
                                )}

                                <div className='border-t border-gray-100 pt-3 flex justify-between font-bold text-base'>
                                    <span>Total Amount</span>
                                    <span className='text-green-700'>${total.toLocaleString('en-US')}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className='w-full mt-6 bg-green-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-lg shadow-green-100'
                            >
                                <span>Proceed to Checkout</span>
                                <IconArrowRight className='!w-4 !h-4' />
                            </button>

                            <div className='mt-6 space-y-3 border-t border-gray-50 pt-5'>
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                    <IconShield className="w-4 h-4 text-green-600 flex-shrink-0" />
                                    <span>Secure & encrypted payments</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                    <IconTruck className="w-4 h-4 text-green-600 flex-shrink-0" />
                                    <span>Free Shipping on orders over $20</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                    <IconRecycle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                    <span>100% Eco-Friendly packaging</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartPage