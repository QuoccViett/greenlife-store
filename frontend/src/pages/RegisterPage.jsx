import { Link, useNavigate } from 'react-router-dom'
import { IconLeaf, IconShield, IconUser } from '../components/icons'
import { useState } from 'react'
import axios from 'axios'
import { setCredentials } from '../store/authSlice'
import { useDispatch } from 'react-redux'


const API = import.meta.env.VITE_API_URL

const RegisterPage = () => {
    const [error, setError] = useState('')
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
    const [loading, setLoading] = useState(false)

    const dispastch = useDispatch()
    const navigate = useNavigate()

    const handleSubmit = async e => {
        e.preventDefault()
        setError('')
        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match')
            return
        }
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }
        setLoading(true)
        try {
            const { data } = await axios.post(`${API}/auth/register`, {
                name: form.name,
                email: form.email,
                password: form.password,
            })
            dispastch(setCredentials(data))
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = e => setForm({...form, [e.target.name]: e.target.value})

    return (
        <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12'>
            <div className='w-full max-w-md'>


                <div className='text-center mb-8'>
                    <Link to='/' className='inline-flex items-center gap-2'>
                        <div className='w-10 h-10 bg-green-600 rounded-full flex items-center justify-center'>
                            <IconLeaf className='!w-5 !h-5 text-white' />
                        </div>
                        <span className='text-green-700 font-medium text-2xl'>GreenLife</span>
                    </Link>
                    <h1 className='text-2xl font-bold text-gray-800 mt-4'>Create a new account.</h1>
                    <p className='text-gray-500 text-sm mt-1'>Join the green living community with GreenLife</p>
                </div>

                <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-8'>
                    {error && (
                        <div className='bg-red-50 border border-red-200 text-red-600 text-sm px-3 rounded-lg mb-6'>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className='space-y-5'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1.5 text-left'>Full name</label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-3 flex items-center pointer-events-none'>
                                    <IconUser className='!w-4 !h-4 text-gray-400' />
                                </div>
                                <input 
                                    type="text" 
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder='Enter your full name.' 
                                    required
                                    className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-green-500 transition'
                                />
                            </div>
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1.5 text-left'>Email</label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-3 flex items-center pointer-events-none'>
                                    <IconUser className='!w-4 !h-4 text-gray-400' />
                                </div>
                                <input 
                                    type="text" 
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
                            <label className='block text-sm font-medium text-gray-700 mb-1.5 text-left'>Password</label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-3 flex items-center pointer-events-none'>
                                    <IconShield className='!w-4 !h-4 text-gray-400'/>
                                </div>
                                <input 
                                    type="password" 
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder='At least 6 characters'
                                    required
                                    className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-green-500 transition' 
                                />
                            </div>
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1.5 text-left'>Confirm Password</label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-3 flex items-center pointer-events-none'>
                                    <IconShield className='!w-4 !h-4 text-gray-400'/>
                                </div>
                                <input 
                                    type="password" 
                                    name="confirmPassword"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    placeholder='Confirm password'
                                    required
                                    className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-green-500 transition' 
                                />
                            </div>
                        </div>

                        <button
                            type='submit'
                            disabled={loading}
                            className='w-full bg-green-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed'
                        >
                            {loading ? 'Creating account...' : 'Create Account' }
                        </button>
                    </form>

                    <div className='mt-6 text-center text-sm text-gray-500'>
                        Already have an account?{' '}
                        <Link to='/login' className='text-green-600 font-medium hover:underline'>
                            Login
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

export default RegisterPage