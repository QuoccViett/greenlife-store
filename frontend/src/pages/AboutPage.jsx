import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLeaf, faHeart, faEarth, faUsers,
  faSeedling, faArrowRight, faCheck,
  faHandHoldingHeart
} from '@fortawesome/free-solid-svg-icons'

const team = [
  { name: 'Nguyễn Quốc Việt', role: 'Founder & CEO', avatar: 'NV' },
  { name: 'Trần Thị Mai', role: 'Product Manager', avatar: 'TM' },
  { name: 'Lê Văn Hùng', role: 'Tech Lead', avatar: 'LH' },
  { name: 'Phạm Thu Hà', role: 'Marketing', avatar: 'PH' },
  { name: 'Võ Minh Khoa', role: 'Operations', avatar: 'MK' },
  { name: 'Đặng Thị Lan', role: 'Customer Care', avatar: 'DL' },
]

const milestones = [
  { year: '2021', event: 'GreenLife Store được thành lập tại TP.HCM' },
  { year: '2022', event: 'Ra mắt 50 sản phẩm đầu tiên, đạt 1,000 khách hàng' },
  { year: '2023', event: 'Mở rộng danh mục lên 200+ sản phẩm, phủ sóng toàn quốc' },
  { year: '2024', event: 'Ra mắt website TMĐT, tích hợp thanh toán online' },
  { year: '2025', event: 'Đạt 10,000+ đơn hàng, mở rộng sang thị trường Đông Nam Á' },
]

const values = [
  { icon: faEarth, title: 'Vì hành tinh', desc: 'Mọi sản phẩm đều được chọn lọc dựa trên tiêu chí thân thiện với môi trường và giảm thiểu carbon footprint.' },
  { icon: faHeart, title: 'Vì sức khỏe', desc: 'Chúng tôi cam kết chỉ cung cấp sản phẩm an toàn, không chứa hóa chất độc hại cho người dùng.' },
  { icon: faUsers, title: 'Vì cộng đồng', desc: 'GreenLife hỗ trợ các nhà sản xuất địa phương và góp phần xây dựng cộng đồng sống xanh tại Việt Nam.' },
  { icon: faHandHoldingHeart, title: 'Trách nhiệm', desc: '5% doanh thu được đóng góp cho các chương trình trồng cây và bảo vệ rừng tại Việt Nam.' },
]

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="w-full bg-gradient-to-br from-green-800 to-green-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faLeaf} className="w-8 h-8 text-green-300" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Về GreenLife Store</h1>
          <p className="text-green-200 text-lg max-w-2xl mx-auto leading-relaxed">
            Chúng tôi tin rằng mỗi lựa chọn nhỏ trong cuộc sống hàng ngày đều có thể tạo ra sự thay đổi lớn cho hành tinh của chúng ta.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
              Sứ mệnh của chúng tôi
            </span>
            <h2 className="text-3xl font-bold text-gray-800 mb-4 leading-tight">
              Làm cho lối sống xanh trở nên dễ dàng và phổ biến hơn
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              GreenLife Store được thành lập với một mục tiêu đơn giản: giúp người Việt Nam tiếp cận dễ dàng hơn với các sản phẩm thân thiện môi trường mà không cần phải thỏa hiệp về chất lượng hay giá cả.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Chúng tôi tuyển chọn kỹ lưỡng từng sản phẩm, đảm bảo mỗi thứ bạn mua đều thực sự tốt cho bạn, gia đình và môi trường xung quanh.
            </p>
            <ul className="space-y-2">
              {[
                '100% sản phẩm được kiểm định an toàn',
                'Đối tác với 50+ nhà sản xuất bền vững',
                'Bao bì tái chế cho mọi đơn hàng',
                'Cam kết hoàn tiền nếu không hài lòng',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-green-600" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-green-50 rounded-3xl p-8 text-center">
            <FontAwesomeIcon icon={faEarth} className="w-32 h-32 text-green-600 mb-6" />
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '10,000+', label: 'Đơn hàng' },
                { value: '5,000+', label: 'Khách hàng' },
                { value: '200+', label: 'Sản phẩm' },
                { value: '50+', label: 'Đối tác' },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-2xl p-4">
                  <p className="text-2xl font-bold text-green-700">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-800">Giá trị cốt lõi</h2>
            <p className="text-gray-500 text-sm mt-1">Những nguyên tắc định hướng mọi quyết định của chúng tôi</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center hover:shadow-md transition">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FontAwesomeIcon icon={v.icon} className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-3xl mx-auto px-4 py-14">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-800">Hành trình phát triển</h2>
          <p className="text-gray-500 text-sm mt-1">Những cột mốc quan trọng của GreenLife Store</p>
        </div>
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-green-200" />
          <div className="space-y-6">
            {milestones.map((m, i) => (
              <div key={i} className="flex gap-6 relative">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 z-10 shadow-md">
                  <span className="text-white text-xs font-bold">{m.year}</span>
                </div>
                <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-sm transition">
                  <p className="text-sm text-gray-700 leading-relaxed">{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-800">Đội ngũ của chúng tôi</h2>
            <p className="text-gray-500 text-sm mt-1">Những người đam mê lối sống xanh đứng sau GreenLife</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {team.map((member, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 text-center hover:shadow-md transition">
                <div className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-sm">{member.avatar}</span>
                </div>
                <p className="font-semibold text-gray-800 text-sm">{member.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 py-14 text-center">
        <div className="bg-green-700 rounded-3xl p-10 text-white">
          <FontAwesomeIcon icon={faSeedling} className="w-12 h-12 text-green-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Tham gia cộng đồng GreenLife</h2>
          <p className="text-green-200 text-sm mb-6 max-w-md mx-auto">
            Hàng nghìn người Việt đang chọn lối sống xanh mỗi ngày. Bạn có muốn tham gia không?
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/products" className="inline-flex items-center gap-2 bg-white text-green-800 font-semibold px-6 py-3 rounded-full hover:bg-green-50 transition">
              <span>Mua sắm ngay</span>
              <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 border border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-green-600 transition">
              Liên hệ
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage