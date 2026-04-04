import { Link, useParams } from "react-router-dom"
import { IconArrowRight, IconLeaf, IconTruck } from "../components/icons"


const OrderSuccessPage = () => {

    const { id } = useParams()
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="bg-white rounded-2xl border border-gray-100 p-10">
                    <div className="flex justify-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                            <IconLeaf className="!w-10 !h-10 text-green-600" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-green-800 mb-2">Order placed successfully!</h1>
                    <p className="text-gray-500 text-sm !mb-2">
                        Thank you for shopping at GreenLife Store
                    </p>
                    <p className="text-xs text-gray-400 !mb-6">
                        Order ID: <span>#{id?.slice(-8).toUpperCase()}</span>
                    </p>

                    <div className="bg-green-50 rounded-xl p-4 mb-6 flex items-center gap-3 text-left">
                        <IconTruck className="w-5 h-5 text-green-600  shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-gray-800">Your order is being processed</p>
                            <p className="text-xs text-gray-500 mt-0.5">We will contact you to confirm within 24 hours</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Link
                            to={'/profile'}
                            className="w-full bg-green-600 text-white py-3 mb-2.5 rounded-xl font-semibold text-sm hover:bg-green-700 transition flex items-center justify-center gap-2"
                        >
                            <span>View Order</span>
                            <IconArrowRight className="!w-4 !h-4" />
                        </Link>
                        <Link
                            to={'/products'}
                            className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold text-sm hover:border-green-500 hover:text-green-600 transition"
                        >
                            <span>Continue Shopping</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderSuccessPage