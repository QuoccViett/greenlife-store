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
                // Chuyển đổi searchParams thành object để gửi lên backend verify
                const params = Object.fromEntries(searchParams.entries())
                
                // Gọi API backend để kiểm tra checksum và trạng thái giao dịch
                const { data } = await axios.get(`${API}/payment/vnpay/return`, { params })
                
                setOrderId(data.orderId)
                
                if (data.code === '00') {
                    setStatus('success')
                    setMessage('Your VNPay payment was processed successfully!')
                } else {
                    setStatus('failed')
                    setMessage(data.message || 'Payment failed or was canceled by the user.')
                }
            } catch (error) {
                console.error("Payment Verification Error:", error)
                setStatus('failed')
                setMessage('An error occurred while confirming your payment status.')
            }
        }
        
        verifyPayment()
    }, [searchParams])

    // Giao diện khi đang đợi xác thực
    if (status === 'loading') return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <IconSpinner className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4"/>
                <h2 className="text-lg font-semibold text-gray-800">Verifying Transaction</h2>
                <p className="text-gray-500 text-sm">Please do not refresh or close this page...</p>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-3xl border border-gray-100 p-8 md:p-10 text-center shadow-sm">

                    {status === 'success' ? (
                        <>
                            <div className="flex justify-center mb-6">
                                <IconCircleCheck className="!w-20 !h-20 text-green-500" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
                            <p className="text-gray-500 text-sm mb-2">{message}</p>
                            
                            {orderId && (
                                <p className="text-xs text-gray-400 mb-8">
                                    Order ID: <span className="font-medium text-gray-600">#{orderId.slice(-8).toUpperCase()}</span>
                                </p>
                            )}

                            <div className="flex flex-col gap-3">
                                <Link
                                    to={`/order-success/${orderId}`}
                                    className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-lg shadow-green-100"
                                >
                                    <span>Complete Order</span>
                                    <IconArrowRight className="!w-4 !h-4" />
                                </Link>
                                <Link 
                                    to={'/products'}
                                    className="w-full border border-gray-200 text-gray-600 py-3.5 rounded-xl font-bold text-sm hover:bg-gray-50 transition"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex justify-center mb-6">
                                <IconCircleXMark className="!w-20 !h-20 text-red-400" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h1>
                            <p className="text-gray-500 text-sm mb-8">{message}</p>
                            
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => navigate('/checkout')}
                                    className="w-full bg-gray-800 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-black transition"
                                >
                                    Try Another Method
                                </button>
                                <Link
                                    to={'/profile'}
                                    className="w-full border border-gray-200 text-gray-600 py-3.5 rounded-xl font-bold text-sm hover:bg-gray-50 transition"
                                >
                                    View My Orders
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