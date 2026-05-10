import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLeaf, faRecycle, faDroplet, faSeedling,
  faChevronDown, faArrowRight,
  faLightbulb, faEarth
} from '@fortawesome/free-solid-svg-icons'

const articles = [
  {
    id: 1,
    category: 'Zero Waste',
    title: 'What is Zero Waste? A Beginner\'s Guide',
    desc: 'Learn about the Zero Waste lifestyle and discover simple steps to minimize your daily environmental footprint.',
    icon: faRecycle,
    color: 'bg-green-100 text-green-700',
    time: '5 min read',
    tips: [
      'Bring reusable bags for grocery shopping',
      'Switch to a reusable water bottle',
      'Refuse single-use plastic straws',
      'Opt for products with minimal packaging',
    ]
  },
  {
    id: 2,
    category: 'Eco Living',
    title: 'Why Choose Bamboo Products?',
    desc: 'Bamboo is one of the world\'s most sustainable materials. Find out why it\'s the perfect alternative to plastic.',
    icon: faLeaf,
    color: 'bg-teal-100 text-teal-700',
    time: '4 min read',
    tips: [
      'Bamboo grows faster than any other plant',
      '100% biodegradable and compostable',
      'More durable than many hardwoods',
      'Naturally antibacterial and anti-fungal',
    ]
  },
  {
    id: 3,
    category: 'Personal Care',
    title: 'Switching to Natural Cosmetics',
    desc: 'A practical guide to transitioning to personal care products that are healthier for you and the planet.',
    icon: faDroplet,
    color: 'bg-blue-100 text-blue-700',
    time: '6 min read',
    tips: [
      'Start with natural handcrafted soaps',
      'Replace liquid shampoo with shampoo bars',
      'Read and understand ingredient labels',
      'Avoid harmful parabens and SLS',
    ]
  },
  {
    id: 4,
    category: 'Sustainability',
    title: '10 Small Habits for Daily Impact',
    desc: 'You don\'t need to overhaul your entire life. These 10 small changes can make a massive difference.',
    icon: faSeedling,
    color: 'bg-lime-100 text-lime-700',
    time: '3 min read',
    tips: [
      'Turn off lights when leaving a room',
      'Start composting organic waste',
      'Shop secondhand and vintage',
      'Reduce meat consumption weekly',
    ]
  },
]

const faqs = [
  {
    q: 'Are eco-friendly products more expensive?',
    a: 'While the initial cost might be slightly higher, they are more cost-effective in the long run due to their durability. For example, a stainless steel bottle can last over 10 years, saving you from buying hundreds of plastic bottles.'
  },
  {
    q: 'Where is the best place to start?',
    a: 'Start with items you use most frequently: shopping bags, water bottles, and straws. Small, consistent changes are more sustainable than trying to change everything at once.'
  },
  {
    q: 'How durable are bamboo products?',
    a: 'Very! Bamboo has a tensile strength comparable to steel but is much lighter. Bamboo cutting boards, toothbrushes, and utensils can last for years with proper care.'
  },
  {
    q: 'Is beeswax wrap food-safe?',
    a: 'Absolutely! Our beeswax wraps are made from organic cotton, natural beeswax, and jojoba oil. They are food-safe certified and contain no harmful chemicals.'
  },
]

const LearnPage = () => {
  const [openFaq, setOpenFaq] = useState(null)
  const [expandedArticle, setExpandedArticle] = useState(null)

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-green-800 to-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faLeaf} className="w-8 h-8 text-green-300" />
          </div>
          <h1 className="text-4xl font-bold mb-3">Green Living Education</h1>
          <p className="text-green-200 text-base mx-auto">
            Discover insights into sustainability, eco-living, and simple ways to protect our planet every day.
          </p>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="bg-green-50 border-b border-green-100 py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: faEarth, value: '8 Billion', label: 'kg of plastic waste per year' },
            { icon: faLeaf, value: '50% Off', label: 'carbon reduction using reusables' },
            { icon: faRecycle, value: '1 Tote', label: 'replaces 700 plastic bags' },
            { icon: faDroplet, value: '2,000L', label: 'water to make 1 cotton t-shirt' },
          ].map((stat, i) => (
            <div key={i}>
              <FontAwesomeIcon icon={stat.icon} className="w-8 h-8 text-green-600 mb-2" />
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5 uppercase tracking-tighter">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Articles Section */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-800">Featured Articles</h2>
          <p className="text-gray-500 text-sm mt-1">Practical knowledge for a conscious lifestyle</p>
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
                  <div className="bg-green-50 rounded-xl p-4 mb-4 animate-fadeIn">
                    <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2 flex items-center gap-1">
                      <FontAwesomeIcon icon={faLightbulb} className="w-3.5 h-3.5" />
                      Pro Tips
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
                  <span>{expandedArticle === article.id ? 'Show Less' : 'Read More'}</span>
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

      {/* FAQ Section */}
      <section className="bg-gray-50 py-14" >
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-800">Common Questions</h2>
            <p className="text-gray-500 text-sm mt-1">Everything you need to know about eco-friendly living</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
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

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-4 py-14 text-center">
        <div className="bg-green-700 rounded-3xl p-10 text-white shadow-xl">
          <FontAwesomeIcon icon={faLeaf} className="w-12 h-12 text-green-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Ready to Start Your Green Journey?</h2>
          <p className="text-green-200 text-sm mb-6">Explore our curated collection of eco-friendly products at GreenLife Store</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-white text-green-800 font-semibold px-8 py-3 rounded-full hover:bg-green-50 transition shadow-lg"
          >
            <span>Start Shopping</span>
            <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default LearnPage