import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="w-full bg-green-800 text-green-100 mt-16">
            <div className="w-full">
                <div className=" px-4 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 !bg-green-700 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold">G</span>
                            </div>
                            <span className="text-white font-bold text-lg">Green Life</span>
                        </div>
                        <p className="text-sm text-white leading-relaxed text-left">
                            An environmentally friendly store. 
                            Live green - live healthy - live sustainably.
                        </p>
                    </div>


                    <div className="text-left">
                        <h3 className="text-white font-semibold mb-3">Company</h3>
                        <ul className="space-y-2 text-sm text-white">
                            <li><Link to='/products?category=eco-home-living' className="hover:text-gray-300 trainsition">Eco Home & Living</Link></li>
                            <li><Link to='/products?category=personal-care' className="hover:text-gray-300 trainsition">Personal Care</Link></li>
                            <li><Link to='/products?category=reusable-bags' className="hover:text-gray-300 trainsition">Reusable Bags</Link></li>
                            <li><Link to='/products?category=zero-waste' className="hover:text-gray-300 trainsition">Zero Waste</Link></li>
                            <li><Link to='/products?category=daily-essentials' className="hover:text-gray-300 trainsition">Daily Essentials</Link></li>
                        </ul>
                    </div>

                    <div className="text-left">
                        <h3 className="text-white font-semibold mb-3">Support</h3>
                        <ul className="space-y-2 text-sm text-white">
                            <li><Link to='/about' className="hover:text-gray-300">About Us</Link></li>
                            <li><Link to='/contact' className="hover:text-gray-300">Contact Us</Link></li>
                            <li><a href='#' className="hover:text-gray-300">Shipping & Return Policy</a></li>
                            <li><a href='#' className="hover:text-gray-300">Privacy Policy</a></li>
                        </ul>
                    </div>

                    <div className="text-left">
                        <h3 className="text-white font-semibold mb-3">Get In Touch</h3>
                        <ul className="space-y-2 text-sm text-white">
                            <li>Email: </li>
                            <li>Hotline: </li>
                            <li>TP. Ho Chi Minh, Viet Nam</li>
                        </ul>

                        <div className="flex gap-3 mt-4">
                            <a href="https://www.facebook.com/" target="_blank" className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center hover:bg-green-600">
                                <span className="text-xs font-bold">f</span>
                            </a>
                            <a href="https://www.instagram.com/" target="_blank" className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center hover:bg-green-600">
                                <span className="text-xs font-bold">in</span>
                            </a>
                        </div>
                    </div>


                </div>
                <div className="py-4 bg-green-900">
                    <div className=" px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex justify-center w-full text-sm text-white">
                            <Link to='/profile' className="px-4 hover:text-gray-300">My Account</Link>
                            <a href="#" className="px-4 hover:text-gray-300">FAQs</a>
                            <a href="#" className="px-4 hover:text-gray-300">Accessibility</a>
                            <a href="#" className="px-4 hover:text-gray-300">Terms & Conditions</a>
                            <a href="#" className="px-4 hover:text-gray-300">Privacy Policy</a>
                        </div>
                    </div>
                </div>
            </div>

        </footer>
    )
}

export default Footer