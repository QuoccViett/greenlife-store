import { useEffect, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { IconArrowRight, IconCircleCheck, IconCircleXMark, IconSpinner } from "../components/icons"
import axios from "axios"

const API = import.meta.env.VITE_API_URL

const PaymentResultPage = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [status, setStatus] = useState('loading')
    const [orderId, setOrderId] = useState('')
    const [message, setMessage] = useState('')

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const params = Object.fromEntries(searchParams.entries())
                const { data } = await axios.get(`${API}/payment/vnpay/return`, {params})
                setOrderId(data.orderId)
                if (data.code === '00') {
                    setStatus('success')
                    setMessage('VNPay payment successful!')
                } else {
                    setStatus('failed')
                    setMessage('Payment failed or was canceled.')
                }
            } catch (error) {
                console.error(error)
                setStatus('failed')
                setMessage('An error occurred while confirming the payment.')
            }
        }
        verifyPayment()
    }, [])

    if (status === 'loading') return (
        <div>
            <div>
                <IconSpinner className="w-12 h-12 text-green-600 animate-spin mb-4"/>
                <p className="text-gray-600">Confirming payment...</p>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">

                    {status === 'success' ? (
                        <>
                            <IconCircleCheck className="!w-20 !h-20 text-green-500" />
                            <h1 className="text-2xl font-bold text-gray-800 !mb-2">Payment successful!</h1>
                            <p className="text-gray-500 text-sm !mb-2">{message}</p>
                            {orderId && (
                                <p className="text-xs text-gray-400 !mb-6">
                                    Order ID: <span>#{orderId.slice(-8).toUpperCase()}</span>
                                </p>
                            )}
                            <div className="flex flex-col gap-3">
                                <Link
                                    to={`/order-success/${orderId}`}
                                    className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-green-700 transition flex items-center justify-center gap-2"
                                >
                                    <span>
                                        View Order
                                    </span>
                                    <IconArrowRight className="!w-4 !h-4" />
                                </Link>
                                <Link 
                                    to={'/products'}
                                    className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold text-sm hover:border-green-500 transition"
                                >
                                    Continue shopping
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <IconCircleXMark className="!w-20 !h-20 text-red-400" />
                            <h1 className="text-2xl font-bold text-gray-800 !mb-2">Payment failed</h1>
                            <p className="text-gray-500 text-sm !mb-6">{message}</p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => navigate(-1)}
                                    className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-green-700 transition"
                                >
                                    Try again
                                </button>
                                <Link
                                    to={'/profile'}
                                    className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold text-sm hover:border-green-500 transition"
                                >
                                    View Order
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PaymentResultPage