import { Link, useNavigate } from 'react-router-dom'
import { IconArrowRight, IconChevronDown, IconMail, IconShield, IconTruck, IconUser } from '../components/icons'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { clearCart } from '../store/cartSlice'
import { useLang } from '../context/LangContext'

const API = import.meta.env.VITE_API_URL

const payment = [
    {
        value: 'cod',
        label: 'Cash on Delivery (COD)',
        desc: 'Pay with cash upon delivery',
    },
    {
        value: 'vnpay',
        label: 'VNPay',
        desc: 'Pay via VNPay gateway (sandbox)',
    },
    {
        value: 'momo',
        label: 'MoMo',
        desc: 'Pay with MoMo e-wallet (sandbox)',
    },
    {
        value: 'visa',
        label: 'VISA',
        desc: 'Pay with Visa/Mastercard',
    },
]

const countries = [
    'Vietnam', 'United States', 'Japan', 'France', 'Germany',
    'United Kingdom', 'Canada', 'Australia', 'China', 'India',
    'Brazil', 'Russia', 'South Korea', 'Italy', 'Spain'
]

const CheckoutPage = () => {
    const dispatch = useDispatch()
    const { t } = useLang()
    const navigate = useNavigate()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState('cod')

    const { userInfo } = useSelector(state => state.auth)
    const { items } = useSelector(state => state.cart)

    const subtotal = items.reduce((acc, item) => acc + (item.salePrice || item.price) * item.quantity, 0)
    const shipping = subtotal >= 20 ? 0 : 5
    const total = subtotal + shipping
    const [useDefaultAddress, setUseDefaultAddress] = useState(
        !!userInfo?.address
    )
    const [form, setForm] = useState({
        fullName: userInfo?.name || '',
        phone: userInfo?.phone || '',
        address: useDefaultAddress ? (userInfo?.address || '') : '',
        city: '',
        notifyEmail: userInfo?.email || '',
    })
    // const [useSavedAddress, setUseSavedAddress] = useState(true)

    const handleSubmit = async e => {
        e.preventDefault()
        setError('')
        if (!form.fullname || !form.phone || !form.address || !form.city) {
            setError('Please fill in all required shipping information')
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
                notifyEmail: form.notifyEmail,
            }
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } }
            const { data: order } = await axios.post(`${API}/orders`, orderData, config)
            dispatch(clearCart())

            if (paymentMethod === 'vnpay') {
                const { data } = await axios.post(`${API}/payment/vnpay/create`, {
                    orderId: order._id,
                    amount: order.totalPrice,
                }, config)
                window.location.href = data.paymentUrl
            } else {
                // Short delay to ensure Redux state is updated
                setTimeout(() => {
                    navigate(`/order-success/${order._id}`)
                }, 50)
            }

        } catch (err) {
            setError(err.response?.data?.message || 'Order process failed, please try again')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

    useEffect(() => {
        if (items.length === 0) {
            navigate('/cart')
        }
    }, [items, navigate])

    return (
        <div className='min-h-screen bg-gray-50'>
            <div className='bg-white border-b border-gray-200'>
                <div className='max-w-7xl mx-auto px-4 py-6'>
                    <div className='flex items-center gap-2 text-sm text-gray-400 mb-2'>
                        <Link to={'/cart'} className='hover:text-green-600 transition'>{t('nav.cart')}</Link>
                        <span>/</span>
                        <span className='text-gray-700 font-medium'>{t('checkout.title')}</span>
                    </div>
                    <h1 className='text-2xl font-bold text-gray-800'>{t('checkout.title')}</h1>
                </div>
            </div>

            <div className='max-w-7xl mx-auto px-4 py-8'>
                <form onSubmit={handleSubmit}>
                    <div className='grid lg:grid-cols-3 gap-8'>
                        <div className='lg:col-span-2 space-y-6'>
                            <div className='bg-white rounded-2xl border border-gray-100 p-6'>
                                <h2 className='text-lg font-bold text-green-800 mb-5 flex items-center gap-2'>
                                    <IconTruck className='!w-5 !h-5 text-green-600' />
                                    {t('checkout.shipping_info')}
                                </h2>

                                {error && (
                                    <div className='bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-5'>
                                        {error}
                                    </div>
                                )}

                                {/* Chọn địa chỉ mặc định hoặc nhập tay */}
                                {userInfo?.address && (
                                    <div className="flex gap-3 mb-5">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setUseDefaultAddress(true)
                                                setForm(f => ({ ...f, address: userInfo.address }))
                                            }}
                                            className={`flex-1 p-3 border-2 rounded-xl text-sm transition text-left ${useDefaultAddress ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <p className="font-medium text-gray-800 mb-0.5">Địa chỉ mặc định</p>
                                            <p className="text-gray-500 text-xs line-clamp-1">{userInfo.address}</p>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setUseDefaultAddress(false)
                                                setForm(f => ({ ...f, address: '' }))
                                            }}
                                            className={`flex-1 p-3 border-2 rounded-xl text-sm transition text-left ${!useDefaultAddress ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <p className="font-medium text-gray-800 mb-0.5">Nhập địa chỉ mới</p>
                                            <p className="text-gray-500 text-xs">Điền địa chỉ giao hàng khác</p>
                                        </button>
                                    </div>
                                )}

                                <div className='grid sm:grid-cols-2 gap-4 mt-4'>
                                    <div className='sm:col-span-2'>
                                        <label className='block text-sm font-medium text-gray-700 mb-1.5 text-left ms-3'>{t('checkout.full_name')}</label>
                                        <div className='relative'>
                                            <div className='absolute inset-y-0 left-3 flex items-center pointer-events-none'>
                                                <IconUser className='!-4 !h-4 text-gray-400' />
                                            </div>
                                            <input
                                                type='text'
                                                name='fullname'
                                                value={form.fullname}
                                                onChange={handleChange}
                                                placeholder={t('checkout.full_name')}
                                                required
                                                className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-green-500 transition'
                                            />
                                        </div>
                                    </div>

                                    <div className='sm:col-span-2'>
                                        <label className='block text-sm font-medium text-gray-700 mb-1.5 text-left ms-3'>{t('checkout.phone')}</label>
                                        <div className='relative'>
                                            <div className='absolute inset-y-0 left-3 flex items-center pointer-events-none'>
                                                <IconUser className='!-4 !h-4 text-gray-400' />
                                            </div>
                                            <input
                                                type='text'
                                                name='phone'
                                                value={form.phone}
                                                onChange={handleChange}
                                                placeholder={t('checkout.phone')}
                                                required
                                                className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-green-500 transition'
                                            />
                                        </div>
                                    </div>

                                    <div className='sm:col-span-2'>
                                        <label className='block text-sm font-medium text-gray-700 mb-1.5 text-left ms-3'>{t('checkout.address')}</label>
                                        <div className='relative'>
                                            <div className='absolute inset-y-0 left-3 flex items-center pointer-events-none'>
                                                <IconUser className='!-4 !h-4 text-gray-400' />
                                            </div>
                                            <input
                                                type='text'
                                                name='address'
                                                value={form.address}
                                                onChange={handleChange}
                                                placeholder={t('checkout.address')}
                                                required
                                                disabled={useDefaultAddress && !!userInfo?.address}
                                                className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-green-500 transition disabled:bg-gray-100 disabled:text-gray-500'
                                            />
                                        </div>
                                    </div>

                                    <div className='text-left relative'>
                                        <label className='ms-3 text-gray-700 text-sm font-medium'>{t('checkout.city')}</label>
                                        <select
                                            name='city'
                                            value={form.city}
                                            onChange={handleChange}
                                            required
                                            className='w-full mt-1.5 px-4 py-3 appearance-none border border-gray-300 rounded-xl outline-none focus:border-gray-500 transition text-gray-700'
                                        >
                                            <option value="">{t('checkout.select_country')}</option>
                                            {countries.map(country => (
                                                <option key={country} value={country}>
                                                    {country}
                                                </option>
                                            ))}
                                        </select>
                                        <div className='absolute inset-y-0 z-50 top-7 right-4 flex items-center pointer-events-none text-gray-500'>
                                            <IconChevronDown className='!w-4 !h-4' />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2 text-left">
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Email nhận thông báo đơn hàng
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                                <IconMail className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <input
                                                type="email"
                                                name="notifyEmail"
                                                value={form.notifyEmail}
                                                onChange={handleChange}
                                                placeholder="Nhập email để nhận thông báo đơn hàng..."
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-green-500 transition"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Chúng tôi sẽ gửi xác nhận đơn hàng và cập nhật trạng thái về email này
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className='bg-white rounded-2xl border border-gray-100 p-6'>
                                <h2 className='text-lg font-bold text-gray-800 mb-5 flex items-center gap-2'>
                                    <IconShield className='!w-5 !h-5 text-green-600' />
                                    {t('checkout.payment_method')}
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
                                                <p className='text-sm font-semibold text-gray-800'>{t(`checkout.payment.${method.value}.label`)}</p>
                                                <p className='text-xs text-gray-500'>{t(`checkout.payment.${method.value}.desc`)}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className='lg:col-span-1'>
                            <div className='bg-white rounded-2xl border border-gray-100 p-6 sticky top-24'>
                                <h2 className='text-lg font-bold text-gray-800 !mb-5'>Order Summary</h2>

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
                                                <p className='text-xs text-gray-500 !mt-0.5 text-left '>Qty: {item.quantity}</p>
                                                <p className='text-xs font-bold text-green-700 !mt-0.5 text-left'>
                                                    ${((item.salePrice || item.price) * item.quantity).toLocaleString('en-US')}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className='space-y-2 text-sm border-t border-gray-100 pt-4'>
                                    <div className='flex justify-between text-gray-600'>
                                        <span>{t('cart.subtotal')}</span>
                                        <span>${subtotal.toLocaleString('en-US')}</span>
                                    </div>
                                    <div className='flex justify-between text-gray-600'>
                                        <span>{t('cart.shipping')}</span>
                                        {shipping === 0 ? (
                                            <span className='text-green-600 font-medium'>{t('cart.free')}</span>
                                        ) : (
                                            <span className='font-medium'>${shipping}</span>
                                        )}
                                    </div>
                                    <div className='border-t border-gray-100 mt-4 pt-3 flex justify-between font-bold text-base'>
                                        <span>{t('cart.total')}</span>
                                        <span className='text-green-700'>${total.toLocaleString('en-US')}</span>
                                    </div>
                                </div>

                                <button
                                    type='submit'
                                    disabled={loading}
                                    className='w-full mt-6 bg-green-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-green-700 
                                                transition disabled:opacity-60 flex items-center justify-center gap-2'
                                >
                                    {loading ? t('checkout.processing') : (
                                        <>
                                            <span>{t('checkout.place_order')}</span>
                                            <IconArrowRight className='!w-4 !h-4 mt-0.5' />
                                        </>
                                    )}
                                </button>

                                <div className='mt-4 flex items-center gap-2 text-xs text-gray-400 justify-center'>
                                    <IconShield className='!w-3.5 !h-3.5 text-green-500' />
                                    <span>{t('checkout.payment_desc')}</span>
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