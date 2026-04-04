import { Link, useNavigate } from 'react-router-dom'
import { IconArrowRight, IconChevronDown, IconShield, IconTruck, IconUser } from '../components/icons'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { clearCart } from '../store/cartSlice'

const API = import.meta.env.VITE_API_URL

const payment = [
    {
        value: 'cod',
        label: 'Cash on Delivery (COD)',
        desc: 'Pay with cash on delivery',
    },
    {
        value: 'vnpay',
        label: 'VNPay',
        desc: 'Pay with VNPay (sandbox)',
    },
    {
        value: 'momo',
        label: 'MoMo',
        desc: 'Pay with MoMo wallet (sandbox)',
    },
    {
        value: 'visa',
        label: 'VISA',
        desc: 'Pay with Visa',
    },
]

const countries = [
    'Vietnam', 'United States', 'Japan', 'France', 'Germany',
    'United Kingdom', 'Canada', 'Australia', 'China', 'India',
    'Brazil', 'Russia', 'South Korea', 'Italy', 'Spain'
]

const CheckoutPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState('cod')

    const { userInfo } = useSelector(state => state.auth)
    const { items } = useSelector(state => state.cart)

    const subtotal = items.reduce((acc, item) => acc + (item.salePrice || item.price) * item.quantity, 0)
    const shipping = subtotal >= 20 ? 0 : 5
    const total = subtotal + shipping



    const [form, setForm] = useState({
        fullname: userInfo?.name || '',
        phone: '',
        address: '',
        city: '',
    })

    const handleSubmit = async e => {
        e.preventDefault()
        setError('')
        if (!form.fullname || !form.phone || !form.address || !form.city) {
            setError('Please fill in all the shipping information')
            return
        }
        setLoading(true)
        try {
            const orderData = {
                items: items.map(item => ({
                    product: item._id,
                    quantity: item.quantity,
                })),
                shippingAddress: form,
                paymentMethod,
            }
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } }
            const { data } = await axios.post(`${API}/orders`, orderData, config)
            console.log("Navigating to order-success", data._id);
            dispatch(clearCart())
            setTimeout(() => {    // delay nhỏ cho Redux update xong
                navigate(`/order-success/${data._id}`)
            }, 50)
        } catch (err) {
            setError(err.response?.data?.message || 'Order failed, please try again')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })


    if (items.length == 0) {
        navigate('/cart')
        return null
    }


    return (
        <div className='min-h-screen bg-gray-50'>


            <div className='bg-white border-b border-gray-200'>
                <div className='max-w-7xl mx-auto px-4 py-6'>
                    <div className='flex items-center gap-2 text-sm text-gray-400 mb-2'>
                        <Link to={'/cart'} className='hover:text-green-600 transition'>Cart</Link>
                        <span>/</span>
                        <span className='text-gray-700 font-medium'>Checkout</span>
                    </div>
                    <h1 className='text-2xl font-bold text-gray-800'>Checkout</h1>
                </div>
            </div>

            <div className='max-w-7xl mx-auto px-4 py-8'>
                <form onSubmit={handleSubmit}>
                    <div className='grid lg:grid-cols-3 gap-8'>

                        <div className='lg:col-span-2 space-y-6'>

                            <div className='bg-white rounded-2xl border border-gray-100 p-6'>
                                <h2 className='text-lg font-bold text-green-800 mb-5 flex items-center gap-2'>
                                    <IconTruck className='!w-5 !h-5 text-green-600' />
                                    Shipping information
                                </h2>

                                {error && (
                                    <div className='bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-5'>
                                        {error}
                                    </div>
                                )}

                                <div className='grid sm:grid-cols-2 gap-4 mt-4'>

                                    <div className='sm:col-span-2'>
                                        <label className='block text-sm font-medium text-gray-700 mb-1.5 text-left ms-3'>Recipient's Full Name</label>
                                        <div className='relative'>
                                            <div className='absolute inset-y-0 left-3 flex items-center pointer-events-none'>
                                                <IconUser className='!-4 !h-4 text-gray-400' />
                                            </div>
                                            <input
                                                type='text'
                                                name='fullname'
                                                value={form.fullname}
                                                onChange={handleChange}
                                                placeholder="Enter Recipient's Full Name"
                                                required
                                                className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-green-500 transition'
                                            />
                                        </div>
                                    </div>

                                    <div className='sm:col-span-2'>
                                        <label className='block text-sm font-medium text-gray-700 mb-1.5 text-left ms-3'>Phone Number</label>
                                        <div className='relative'>
                                            <div className='absolute inset-y-0 left-3 flex items-center pointer-events-none'>
                                                <IconUser className='!-4 !h-4 text-gray-400' />
                                            </div>
                                            <input
                                                type='text'
                                                name='phone'
                                                value={form.phone}
                                                onChange={handleChange}
                                                placeholder="Enter Phone Number"
                                                required
                                                className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-green-500 transition'
                                            />
                                        </div>
                                    </div>


                                    <div className='sm:col-span-2'>
                                        <label className='block text-sm font-medium text-gray-700 mb-1.5 text-left ms-3'>Recipient's Address</label>
                                        <div className='relative'>
                                            <div className='absolute inset-y-0 left-3 flex items-center pointer-events-none'>
                                                <IconUser className='!-4 !h-4 text-gray-400' />
                                            </div>
                                            <input
                                                type='text'
                                                name='address'
                                                value={form.address}
                                                onChange={handleChange}
                                                placeholder="Enter Recipient's Address"
                                                required
                                                className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-green-500 transition'
                                            />
                                        </div>
                                    </div>

                                    <div className='text-left relative'>
                                        <label className='ms-3 text-gray-700 text-sm font-medium'>Country</label>
                                        <select
                                            name='city'
                                            value={form.city}
                                            onChange={handleChange}
                                            required
                                            className='w-full mt-1.5 px-4 py-3 appearance-none border border-gray-300 rounded-xl outline-none focus:border-gray-500 transition text-gray-700'
                                        >
                                            <option value="">
                                                Select Country
                                            </option>
                                            {countries.map(country => (
                                                <option
                                                    key={country}
                                                    value={country}
                                                >
                                                    {country}
                                                </option>
                                            ))}
                                        </select>

                                        <div className='absolute inset-y-0 z-50 top-7 right-4 flex items-center pointer-events-none text-gray-500'>
                                            <IconChevronDown className='!w-4 !h-4' />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='bg-white rounded-2xl border border-gray-100 p-6'>
                                <h2 className='text-lg font-bold text-gray-800 mb-5 flex items-center gap-2'>
                                    <IconShield className='!w-5 !h-5 text-green-600' />
                                    Payment Method
                                </h2>

                                <div className='space-y-3 mt-4'>
                                    {payment.map(method => (
                                        <label
                                            key={method.value}
                                            className={`flex items-center gap-4 border-2 rounded-xl cursor-pointer transition p-2
                                                ${paymentMethod === method.value
                                                    ? 'border-green-500 bg-green-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <input
                                                type='radio'
                                                name='paymentMethod'
                                                value={method.value}
                                                checked={paymentMethod === method.value}
                                                onChange={e => setPaymentMethod(e.target.value)}
                                                className='accent-green-600 ms-5'
                                            />
                                            <div className='text-left'>
                                                <p className='text-sm font-semibold text-gray-800'>{method.label}</p>
                                                <p className='text-xs text-gray-500'>{method.desc}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className='lg:col-span-1'>
                            <div className='bg-white rounded-2xl border border-gray-100 p-6 sticky top-24'>
                                <h2 className='text-lg font-bold text-gray-800 !mb-5'>Your Order</h2>

                                <div className='space-y-3 max-h-64 overflow-y-auto mb-5'>
                                    {items.map(item => (
                                        <div key={item._id} className='flex my-4 p-2'>
                                            <img
                                                src={item.image || 'https://placehold.co/60x60/e8f5e9/2e7d32?text=GL'}
                                                alt={item.name}
                                                className="w-14 h-14 object-cover rounded-lg shrink-0 me-4"
                                            />
                                            <div className='flex-1 min-w-0'>
                                                <p className='text-xs font-medium text-gray-800 line-clamp-2 text-left'>{item.name}</p>
                                                <p className='text-xs text-gray-500 !mt-0.5 text-left '>Amount: {item.quantity}</p>
                                                <p className='text-xs font-bold text-green-700 !mt-0.5 text-left'>
                                                    ${((item.salePrice || item.price) * item.quantity).toLocaleString('en-US')}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className='space-y-2 text-sm border-t border-gray-100 pt-4'>
                                    <div className='flex justify-between text-gray-600'>
                                        <span>
                                            Sutotal
                                        </span>
                                        <span>
                                            ${subtotal.toLocaleString('en-US')}
                                        </span>
                                    </div>
                                    <div className='flex justify-between text-gray-600'>
                                        <span>Shipping</span>
                                        {shipping === 0 ? (
                                            <span className='text-green-600 font-medium'>Free Shipping</span>
                                        ) : (
                                            <span className='font-medium'>${shipping}</span>
                                        )}
                                    </div>
                                    <div className='border-t border-gray-100 mt-4 pt-3 flex justify-between font-bold text-base'>
                                        <span>Total</span>
                                        <span className='text-green-700'>${total.toLocaleString('en-US')}</span>
                                    </div>
                                </div>

                                <button
                                    type='submit'
                                    disabled={loading}
                                    className='w-full mt-6 bg-green-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-green-700 
                                                transition disabled:opacity-60 flex items-center justify-center gap-2'
                                >
                                    {loading ? 'Placing your order...' : (
                                        <>
                                            <span>Place Order</span>
                                            <IconArrowRight className='!w-4 !h-4 mt-0.5' />
                                        </>
                                    )}
                                </button>

                                <div className='mt-4 flex items-center gap-2 text-xs text-gray-400 justify-center'>
                                    <IconShield className='!w-3.5 !h-3.5 text-green-500' />
                                    <span>Your information is fully secured</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CheckoutPage