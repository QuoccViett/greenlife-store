import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEnvelope, faPhone, faLocationDot,
  faClock, faCheck, faPaperPlane,
  faLeaf, faHeadset
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

      {/* Hero */}
      <section className="w-full bg-gradient-to-br from-green-800 to-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faHeadset} className="w-8 h-8 text-green-300" />
          </div>
          <h1 className="text-4xl font-bold mb-3">Liên hệ với chúng tôi</h1>
          <p className="text-green-200 text-base max-w-xl mx-auto">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy để lại tin nhắn và chúng tôi sẽ phản hồi trong vòng 24 giờ.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* Contact info */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-5">Thông tin liên hệ</h2>
              <div className="space-y-4">
                {[
                  { icon: faPhone, title: 'Hotline', value: '1800 1234', sub: 'Miễn phí · 8:00 - 22:00' },
                  { icon: faEnvelope, title: 'Email', value: 'hello@greenlife.vn', sub: 'Phản hồi trong 24h' },
                  { icon: faLocationDot, title: 'Địa chỉ', value: '123 Nguyễn Huệ, Q.1', sub: 'TP. Hồ Chí Minh' },
                  { icon: faClock, title: 'Giờ làm việc', value: 'T2 - T6: 8:00 - 18:00', sub: 'T7: 8:00 - 12:00' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-green-50 rounded-2xl">
                    <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon icon={item.icon} className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">{item.title}</p>
                      <p className="text-sm font-semibold text-gray-800">{item.value}</p>
                      <p className="text-xs text-gray-400">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Mạng xã hội</h3>
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
                <p className="text-sm text-gray-500">123 Nguyễn Huệ, Q.1</p>
                <p className="text-xs text-gray-400">TP. Hồ Chí Minh</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Gửi tin nhắn cho chúng tôi</h2>

              {sent ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FontAwesomeIcon icon={faCheck} className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Đã gửi thành công!</h3>
                  <p className="text-gray-500 text-sm mb-6">Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong vòng 24 giờ.</p>
                  <button
                    onClick={() => setSent(false)}
                    className="bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition"
                  >
                    Gửi tin nhắn khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ và tên *</label>
                      <input
                        type="text" name="name" value={form.name}
                        onChange={handleChange} required
                        placeholder="Nguyễn Văn A"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-green-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                      <input
                        type="email" name="email" value={form.email}
                        onChange={handleChange} required
                        placeholder="hello@example.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-green-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Chủ đề</label>
                    <select
                      name="subject" value={form.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-green-500 transition text-gray-700"
                    >
                      <option value="">Chọn chủ đề</option>
                      <option value="order">Hỏi về đơn hàng</option>
                      <option value="product">Hỏi về sản phẩm</option>
                      <option value="return">Đổi trả hàng</option>
                      <option value="partner">Hợp tác kinh doanh</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Tin nhắn *</label>
                    <textarea
                      name="message" value={form.message}
                      onChange={handleChange} required rows={5}
                      placeholder="Nhập nội dung tin nhắn của bạn..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-green-500 transition resize-none"
                    />
                  </div>

                  <button
                    type="submit" disabled={loading}
                    className="flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-green-700 transition disabled:opacity-60"
                  >
                    <FontAwesomeIcon icon={loading ? faLeaf : faPaperPlane} className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    <span>{loading ? 'Đang gửi...' : 'Gửi tin nhắn'}</span>
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