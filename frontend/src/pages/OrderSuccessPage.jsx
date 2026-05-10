import { Link, useParams } from "react-router-dom"
import { IconArrowRight, IconLeaf, IconTruck } from "../components/icons"

const OrderSuccessPage = () => {
    const { id } = useParams()

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="bg-white rounded-2xl border border-gray-100 p-8 md:p-10 shadow-sm">
                    {/* Success Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce-slow">
                            <IconLeaf className="!w-10 !h-10 text-green-600" />
                        </div>
                    </div>

                    {/* Title & Message */}
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
                    <p className="text-gray-500 text-sm mb-1">
                        Thank you for shopping at GreenLife Store.
                    </p>
                    
                    {/* Order ID */}
                    {id && (
                        <p className="text-xs text-gray-400 mb-8">
                            Order ID: <span className="font-medium text-gray-600">#{id.slice(-8).toUpperCase()}</span>
                        </p>
                    )}

                    {/* Status Box */}
                    <div className="bg-green-50 rounded-xl p-4 mb-8 flex items-center gap-4 text-left">
                        <IconTruck className="w-6 h-6 text-green-600 shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-green-900">Your order is being processed</p>
                            <p className="text-xs text-green-700 opacity-80 mt-0.5">
                                We will contact you to confirm within 24 hours.
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3">
                        <Link
                            to="/profile"
                            className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-green-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-green-100"
                        >
                            <span>View Order Status</span>
                            <IconArrowRight className="!w-4 !h-4" />
                        </Link>
                        
                        <Link
                            to="/products"
                            className="w-full border border-gray-200 text-gray-600 py-3.5 rounded-xl font-bold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                        >
                            <span>Continue Shopping</span>
                        </Link>
                    </div>
                </div>
                
                {/* Back to Home Support Link */}
                <p className="mt-8 text-sm text-gray-400">
                    Need help? <Link to="/contact" className="text-green-600 hover:underline">Contact Support</Link>
                </p>
            </div>
        </div>
    )
}

export default OrderSuccessPage