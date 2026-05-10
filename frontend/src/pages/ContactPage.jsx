import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEnvelope, faPhone, faLocationDot,
  faClock, faCheck, faPaperPlane,
  faLeaf,
} from '@fortawesome/free-solid-svg-icons'
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons'

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setSent(true)
    setLoading(false)
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-green-800 to-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faLeaf} className="w-8 h-8 text-green-300" />
          </div>
          <h1 className="text-4xl font-bold mb-3">Contact Us</h1>
          <p className="text-green-200 text-base mx-auto">
            We are always here to support you. Please leave a message, and we will get back to you within 24 hours.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* Contact info side */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-5">Contact Information</h2>
              <div className="space-y-4 text-left">
                {[
                  { icon: faPhone, title: 'Hotline', value: '1800 1234', sub: 'Toll-free · 8:00 AM - 10:00 PM' },
                  { icon: faEnvelope, title: 'Email', value: 'hello@greenlife.vn', sub: 'Response within 24h' },
                  { icon: faLocationDot, title: 'Address', value: '123 Nguyen Hue St, Dist 1', sub: 'Ho Chi Minh City, Vietnam' },
                  { icon: faClock, title: 'Business Hours', value: 'Mon - Fri: 8:00 AM - 6:00 PM', sub: 'Sat: 8:00 AM - 12:00 PM' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-green-50 rounded-2xl">
                    <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shrink-0 mt-1.5 ms-5">
                      <FontAwesomeIcon icon={item.icon} className="w-4 h-4 text-white" />
                    </div>
                    <div className='ms-3'>
                      <p className="text-xs text-gray-500 mb-0.5">{item.title}</p>
                      <p className="text-sm font-semibold text-gray-800">{item.value}</p>
                      <p className="text-xs text-gray-400">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Follow Us</h3>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white hover:bg-blue-700 transition">
                  <FontAwesomeIcon icon={faFacebook} className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-pink-600 rounded-xl flex items-center justify-center text-white hover:bg-pink-700 transition">
                  <FontAwesomeIcon icon={faInstagram} className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="bg-green-50 rounded-2xl overflow-hidden h-48 flex items-center justify-center border border-green-100">
              <div className="text-center">
                <FontAwesomeIcon icon={faLocationDot} className="w-10 h-10 text-green-400 mb-2" />
                <p className="text-sm text-gray-500 font-medium">Find us in District 1</p>
                <p className="text-xs text-gray-400">Ho Chi Minh City</p>
              </div>
            </div>
          </div>

          {/* Message Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Send Us a Message</h2>

              {sent ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FontAwesomeIcon icon={faCheck} className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Message Sent Successfully!</h3>
                  <p className="text-gray-500 text-sm mb-6">Thank you for reaching out. Our team will contact you within 24 hours.</p>
                  <button
                    onClick={() => setSent(false)}
                    className="bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                      <input
                        type="text" name="name" value={form.name}
                        onChange={handleChange} required
                        placeholder="e.g. John Doe"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-green-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                      <input
                        type="email" name="email" value={form.email}
                        onChange={handleChange} required
                        placeholder="hello@example.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-green-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                    <select
                      name="subject" value={form.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-green-500 transition text-gray-700"
                    >
                      <option value="">Select a subject</option>
                      <option value="order">Order Inquiry</option>
                      <option value="product">Product Information</option>
                      <option value="return">Returns & Refunds</option>
                      <option value="partner">Business Partnerships</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                    <textarea
                      name="message" value={form.message}
                      onChange={handleChange} required rows={5}
                      placeholder="How can we help you today?"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-green-500 transition resize-none"
                    />
                  </div>

                  <button
                    type="submit" disabled={loading}
                    className="flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-green-700 transition disabled:opacity-60"
                  >
                    <FontAwesomeIcon icon={loading ? faLeaf : faPaperPlane} className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    <span>{loading ? 'Sending...' : 'Send Message'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage