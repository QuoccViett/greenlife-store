import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLeaf, faRecycle, faDroplet, faSeedling,
  faChevronDown, faArrowRight, faBookOpen,
  faLightbulb, faEarth
} from '@fortawesome/free-solid-svg-icons'

const articles = [
  {
    id: 1,
    category: 'Zero Waste',
    title: 'Zero Waste là gì? Hướng dẫn bắt đầu từ con số 0',
    desc: 'Tìm hiểu về lối sống Zero Waste và các bước đơn giản để giảm rác thải trong cuộc sống hàng ngày của bạn.',
    icon: faRecycle,
    color: 'bg-green-100 text-green-700',
    time: '5 phút đọc',
    tips: [
      'Mang túi vải khi đi siêu thị',
      'Dùng bình nước tái sử dụng',
      'Từ chối ống hút nhựa',
      'Chọn sản phẩm ít bao bì',
    ]
  },
  {
    id: 2,
    category: 'Eco Living',
    title: 'Tại sao nên dùng sản phẩm từ tre?',
    desc: 'Tre là vật liệu bền vững nhất thế giới. Tìm hiểu tại sao tre đang thay thế nhựa trong hàng trăm sản phẩm gia dụng.',
    icon: faLeaf,
    color: 'bg-teal-100 text-teal-700',
    time: '4 phút đọc',
    tips: [
      'Tre mọc nhanh hơn bất kỳ loài thực vật nào',
      'Phân hủy sinh học 100%',
      'Cứng hơn nhiều loại gỗ',
      'Kháng khuẩn tự nhiên',
    ]
  },
  {
    id: 3,
    category: 'Personal Care',
    title: 'Chuyển sang mỹ phẩm thiên nhiên: Có khó không?',
    desc: 'Hướng dẫn thực tế để chuyển đổi sang các sản phẩm chăm sóc cá nhân lành mạnh hơn cho cả bạn và môi trường.',
    icon: faDroplet,
    color: 'bg-blue-100 text-blue-700',
    time: '6 phút đọc',
    tips: [
      'Bắt đầu với xà phòng thiên nhiên',
      'Thay dầu gội thường bằng shampoo bar',
      'Đọc kỹ thành phần trên nhãn',
      'Tránh paraben và SLS',
    ]
  },
  {
    id: 4,
    category: 'Sustainability',
    title: '10 thói quen nhỏ giúp bảo vệ môi trường mỗi ngày',
    desc: 'Bạn không cần thay đổi toàn bộ cuộc sống. Chỉ cần 10 thói quen nhỏ này là đã tạo ra sự khác biệt lớn.',
    icon: faSeedling,
    color: 'bg-lime-100 text-lime-700',
    time: '3 phút đọc',
    tips: [
      'Tắt điện khi rời khỏi phòng',
      'Ủ phân từ rác hữu cơ',
      'Mua đồ secondhand',
      'Ăn ít thịt hơn mỗi tuần',
    ]
  },
]

const faqs = [
  {
    q: 'Sản phẩm eco-friendly có đắt hơn không?',
    a: 'Ban đầu có thể đắt hơn một chút, nhưng về lâu dài sẽ tiết kiệm hơn vì dùng được nhiều lần. Ví dụ bình nước inox dùng được 10 năm thay vì mua chai nhựa mỗi ngày.'
  },
  {
    q: 'Tôi nên bắt đầu từ đâu?',
    a: 'Hãy bắt đầu từ những thứ bạn dùng nhiều nhất mỗi ngày: túi đi chợ, bình nước, ống hút. Thay đổi từng bước nhỏ sẽ bền vững hơn thay đổi tất cả cùng lúc.'
  },
  {
    q: 'Sản phẩm tre có thực sự bền không?',
    a: 'Có! Tre có độ cứng tương đương thép nhưng nhẹ hơn nhiều. Thớt tre, bàn chải tre và dụng cụ nhà bếp tre đều có thể dùng được nhiều năm nếu bảo quản đúng cách.'
  },
  {
    q: 'Màng bọc sáp ong có an toàn thực phẩm không?',
    a: 'Hoàn toàn an toàn! Màng bọc sáp ong được làm từ cotton hữu cơ, sáp ong tự nhiên và dầu jojoba. Đã được chứng nhận an toàn thực phẩm và không chứa hóa chất độc hại.'
  },
]

const LearnPage = () => {
  const [openFaq, setOpenFaq] = useState(null)
  const [expandedArticle, setExpandedArticle] = useState(null)

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="w-full bg-gradient-to-br from-green-800 to-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faBookOpen} className="w-8 h-8 text-green-300" />
          </div>
          <h1 className="text-4xl font-bold mb-3">Học về lối sống xanh</h1>
          <p className="text-green-200 text-base max-w-xl mx-auto">
            Khám phá kiến thức về sustainability, eco-living và các cách đơn giản để bảo vệ hành tinh mỗi ngày.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-green-50 border-b border-green-100 py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: faEarth, value: '8 tỷ', label: 'kg rác nhựa mỗi năm' },
            { icon: faLeaf, value: '50%', label: 'giảm carbon nếu dùng đồ tái sử dụng' },
            { icon: faRecycle, value: '1 túi vải', label: 'thay thế 700 túi nilon' },
            { icon: faDroplet, value: '2,000L', label: 'nước để sản xuất 1 cái áo' },
          ].map((stat, i) => (
            <div key={i}>
              <FontAwesomeIcon icon={stat.icon} className="w-8 h-8 text-green-600 mb-2" />
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Articles */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-800">Bài viết nổi bật</h2>
          <p className="text-gray-500 text-sm mt-1">Kiến thức thực tế về lối sống xanh</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {articles.map(article => (
            <div key={article.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${article.color}`}>
                    <FontAwesomeIcon icon={article.icon} className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">{article.category}</span>
                    <span className="text-xs text-gray-400 ml-2">· {article.time}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{article.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{article.desc}</p>

                {expandedArticle === article.id && (
                  <div className="bg-green-50 rounded-xl p-4 mb-4">
                    <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2 flex items-center gap-1">
                      <FontAwesomeIcon icon={faLightbulb} className="w-3.5 h-3.5" />
                      Tips thực tế
                    </p>
                    <ul className="space-y-1.5">
                      {article.tips.map((tip, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  onClick={() => setExpandedArticle(expandedArticle === article.id ? null : article.id)}
                  className="flex items-center gap-1.5 text-sm text-green-600 font-medium hover:underline"
                >
                  <span>{expandedArticle === article.id ? 'Thu gọn' : 'Đọc thêm'}</span>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`w-3 h-3 transition-transform ${expandedArticle === article.id ? 'rotate-180' : ''}`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-800">Câu hỏi thường gặp</h2>
            <p className="text-gray-500 text-sm mt-1">Những thắc mắc phổ biến về sản phẩm eco-friendly</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition"
                >
                  <span className="font-medium text-gray-800 text-sm">{faq.q}</span>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`w-4 h-4 text-gray-400 flex-shrink-0 ml-4 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-50">
                    <p className="pt-3">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 py-14 text-center">
        <div className="bg-green-700 rounded-3xl p-10 text-white">
          <FontAwesomeIcon icon={faLeaf} className="w-12 h-12 text-green-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Sẵn sàng bắt đầu hành trình xanh?</h2>
          <p className="text-green-200 text-sm mb-6">Khám phá các sản phẩm eco-friendly được tuyển chọn kỹ lưỡng tại GreenLife Store</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-white text-green-800 font-semibold px-8 py-3 rounded-full hover:bg-green-50 transition"
          >
            <span>Khám phá sản phẩm</span>
            <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default LearnPage