import { Link, useNavigate } from 'react-router-dom'
import { IconLeaf, IconMail, IconShield } from "../components/icons"
import { useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../store/authSlice'

const API = import.meta.env.VITE_API_URL


const LoginPage = () => {
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({ email: '', password: '' })
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSubmit = async e => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const { data } = await axios.post(`${API}/auth/login`, form)
            dispatch(setCredentials(data))
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

    return (
        <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12'>
            <div className='w-full max-w-md'>
                <div className='text-center mb-8'>
                    <Link className='inline-flex items-center gap-2'>
                        <div className='w-10 h-10 bg-green-600 rounded-full flex items-center justify-center'>
                            <IconLeaf className='!w-5 !h-5 text-white'/>
                        </div>
                    </Link>
                    <h1 className='text-2xl font-bold text-gray-800 mt-4'>Welcome back.<br/> We're glad to see you again!</h1>
                    <p className='text-gray-500 text-sm mt-1'>Log in to keep shopping your favorites</p>
                </div>

                <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-8'>
                    {error && (
                        <div className='bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-6'>
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className='space-y-5'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1.5 text-left'>Email</label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-3 flex items-center pointer-events-none'>
                                    <IconMail className='!w-4 !h-4 text-gray-400' />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder='Enter your email.'
                                    required
                                    className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-green-500 transition'
                                />
                            </div>
                        </div>

                        <div>
                            <div className='flex items-center justify-between mb-1.5'>
                                <label className='block text-sm font-medium text-gray-700'>Password</label>
                                <a href="#" className='text-xs text-green-600 hover:underline'>Forgot password ?</a>
                            </div>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-3 flex items-center pointer-none:'>
                                    <IconShield className='!-4 !h-4 text-gray-400'/>
                                </div>
                                <input 
                                    type="password" 
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder='Enter your password.'
                                    required
                                    className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-green-500 transition' 
                                />
                            </div>
                        </div>

                        <button className='w-full bg-green-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed'>
                            {loading ? 'Logging in...' : 'Log in'}
                        </button>
                    </form>

                    <div className='mt-4 text-center text-sm text-gray-500'>
                        Don't have an account?{' '}
                        <Link to='/register' className=' text-green-600 font-medium hover:underline'>
                            Register now
                        </Link>
                    </div>
                </div>


                <p className='text-center text-xs text-green-700 !mt-3'>
                    © 2025 GreenLife Store. Eco-friendly living every day.
                </p>
            </div>
        </div>
    )
}

export default LoginPage