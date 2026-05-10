import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLeaf, faHeart, faEarth, faUsers,
  faSeedling, faArrowRight, faCheck,
  faHandHoldingHeart
} from '@fortawesome/free-solid-svg-icons'

const team = [
  { name: 'Quoc Viet Nguyen', role: 'Founder & CEO', avatar: 'VN' },
  { name: 'Mai Thi Tran', role: 'Head of Product', avatar: 'MT' },
  { name: 'Hung Van Le', role: 'Chief Technology Officer', avatar: 'HL' },
  { name: 'Thu Ha Pham', role: 'Marketing Director', avatar: 'HP' },
  { name: 'Minh Khoa Vo', role: 'Operations Manager', avatar: 'KV' },
  { name: 'Lan Thi Dang', role: 'Head of Customer Success', avatar: 'LD' },
]

const milestones = [
  { year: '2021', event: 'GreenLife Store founded in Ho Chi Minh City, Vietnam.' },
  { year: '2022', event: 'Launched our first 50 eco-products and reached 1,000 customers.' },
  { year: '2023', event: 'Expanded catalog to 200+ items with nationwide shipping coverage.' },
  { year: '2024', event: 'Launched flagship E-commerce platform with integrated global payments.' },
  { year: '2025', event: 'Reached 10,000+ orders and expanded into the Southeast Asian market.' },
]

const values = [
  { icon: faEarth, title: 'For the Planet', desc: 'Every product is curated based on strict eco-friendly criteria to minimize carbon footprints.' },
  { icon: faHeart, title: 'For Your Health', desc: 'We are committed to providing safe, non-toxic products that are free from harmful chemicals.' },
  { icon: faUsers, title: 'For the Community', desc: 'Supporting local artisans and building a sustainable green-living community in Vietnam.' },
  { icon: faHandHoldingHeart, title: 'Giving Back', desc: '5% of our revenue is donated to reforestation and environmental protection programs.' },
]

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-green-800 to-green-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faLeaf} className="w-8 h-8 text-green-300" />
          </div>
          <h1 className="text-4xl font-bold mb-4">About GreenLife Store</h1>
          <p className="text-green-200 text-lg mx-auto leading-relaxed">
            We believe that every small choice in our daily lives can create a meaningful impact on our planet.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
              Our Mission
            </span>
            <h2 className="text-3xl font-bold text-gray-800 mb-4 leading-tight">
              Making Sustainable Living Accessible for Everyone
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              GreenLife Store was founded with a simple goal: to provide high-quality, eco-friendly products without compromising on performance or price.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              We meticulously curate each item, ensuring that everything you purchase is truly good for you, your family, and the environment.
            </p>
            <ul className="space-y-2">
              {[
                '100% Safety-tested & Certified products',
                'Partnered with 50+ Sustainable manufacturers',
                'Plastic-free, recyclable packaging for all orders',
                'Satisfaction guaranteed return policy',
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
                { value: '10,000+', label: 'Orders Fulfilled' },
                { value: '5,000+', label: 'Happy Customers' },
                { value: '200+', label: 'Eco Products' },
                { value: '50+', label: 'Local Partners' },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 shadow-sm">
                  <p className="text-2xl font-bold text-green-700">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5 uppercase">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-800">Our Core Values</h2>
            <p className="text-gray-500 text-sm mt-1">The principles that guide every decision we make</p>
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

      {/* Development Journey */}
      <section className="max-w-3xl mx-auto px-4 py-14">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-800">Our Journey</h2>
          <p className="text-gray-500 text-sm mt-1">Key milestones in the growth of GreenLife Store</p>
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

      {/* Team Section */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-800">Meet the Team</h2>
            <p className="text-gray-500 text-sm mt-1">The eco-enthusiasts behind the mission</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {team.map((member, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 text-center hover:shadow-md transition border border-transparent hover:border-green-100">
                <div className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-sm">{member.avatar}</span>
                </div>
                <p className="font-semibold text-gray-800 text-sm">{member.name}</p>
                <p className="text-[10px] uppercase font-bold text-green-600 mt-0.5">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 py-14 text-center">
        <div className="bg-green-700 rounded-3xl p-10 text-white shadow-xl">
          <FontAwesomeIcon icon={faSeedling} className="w-12 h-12 text-green-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2 !text-white">Join the GreenLife Movement</h2>
          <p className="text-green-200 text-sm mb-6 mx-auto !mb-4">
            Thousands are choosing a greener lifestyle every day. Are you ready to make a difference?
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/products" className="inline-flex items-center gap-2 bg-white text-green-800 font-semibold px-8 py-3 rounded-full hover:bg-green-50 transition shadow-lg">
              <span>Shop Now</span>
              <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 border border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-green-600 transition">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage