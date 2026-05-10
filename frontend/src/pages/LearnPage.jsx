import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLeaf, faRecycle, faDroplet, faSeedling,
  faChevronDown, faArrowRight,
  faLightbulb, faEarth
} from '@fortawesome/free-solid-svg-icons'
import { useLang } from '../context/LangContext'

const articles = [
  {
    id: 1,
    categoryKey: 'learn.articles.1.category',
    titleKey: 'learn.articles.1.title',
    descKey: 'learn.articles.1.desc',
    icon: faRecycle,
    color: 'bg-green-100 text-green-700',
    timeKey: 'learn.articles.1.time',
    tipsKeys: [
      'learn.articles.1.tips.0',
      'learn.articles.1.tips.1',
      'learn.articles.1.tips.2',
      'learn.articles.1.tips.3',
    ]
  },
  {
    id: 2,
    categoryKey: 'learn.articles.2.category',
    titleKey: 'learn.articles.2.title',
    descKey: 'learn.articles.2.desc',
    icon: faLeaf,
    color: 'bg-teal-100 text-teal-700',
    timeKey: 'learn.articles.2.time',
    tipsKeys: [
      'learn.articles.2.tips.0',
      'learn.articles.2.tips.1',
      'learn.articles.2.tips.2',
      'learn.articles.2.tips.3',
    ]
  },
  {
    id: 3,
    categoryKey: 'learn.articles.3.category',
    titleKey: 'learn.articles.3.title',
    descKey: 'learn.articles.3.desc',
    icon: faDroplet,
    color: 'bg-blue-100 text-blue-700',
    timeKey: 'learn.articles.3.time',
    tipsKeys: [
      'learn.articles.3.tips.0',
      'learn.articles.3.tips.1',
      'learn.articles.3.tips.2',
      'learn.articles.3.tips.3',
    ]
  },
  {
    id: 4,
    categoryKey: 'learn.articles.4.category',
    titleKey: 'learn.articles.4.title',
    descKey: 'learn.articles.4.desc',
    icon: faSeedling,
    color: 'bg-lime-100 text-lime-700',
    timeKey: 'learn.articles.4.time',
    tipsKeys: [
      'learn.articles.4.tips.0',
      'learn.articles.4.tips.1',
      'learn.articles.4.tips.2',
      'learn.articles.4.tips.3',
    ]
  },
]

const faqs = [
  { qKey: 'learn.faqs.0.q', aKey: 'learn.faqs.0.a' },
  { qKey: 'learn.faqs.1.q', aKey: 'learn.faqs.1.a' },
  { qKey: 'learn.faqs.2.q', aKey: 'learn.faqs.2.a' },
  { qKey: 'learn.faqs.3.q', aKey: 'learn.faqs.3.a' },
]

const LearnPage = () => {
  const [openFaq, setOpenFaq] = useState(null)
  const [expandedArticle, setExpandedArticle] = useState(null)
  const { t } = useLang()

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-green-800 to-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faLeaf} className="w-8 h-8 text-green-300" />
          </div>
          <h1 className="text-4xl font-bold mb-3">{t('learn.title')}</h1>
          <p className="text-green-200 text-base mx-auto">{t('learn.subtitle')}</p>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="bg-green-50 border-b border-green-100 py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: faEarth, value: '8 Billion', labelKey: 'learn.stats.0.label' },
            { icon: faLeaf, value: '50% Off', labelKey: 'learn.stats.1.label' },
            { icon: faRecycle, value: '1 Tote', labelKey: 'learn.stats.2.label' },
            { icon: faDroplet, value: '2,000L', labelKey: 'learn.stats.3.label' },
          ].map((stat, i) => (
            <div key={i}>
              <FontAwesomeIcon icon={stat.icon} className="w-8 h-8 text-green-600 mb-2" />
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5 uppercase tracking-tighter">{t(stat.labelKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Articles Section */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-800">{t('learn.featured.title')}</h2>
          <p className="text-gray-500 text-sm mt-1">{t('learn.featured.sub')}</p>
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
                        <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">{t(article.categoryKey)}</span>
                    <span className="text-xs text-gray-400 ml-2">· {t(article.timeKey)}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{t(article.titleKey)}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{t(article.descKey)}</p>

                {expandedArticle === article.id && (
                  <div className="bg-green-50 rounded-xl p-4 mb-4 animate-fadeIn">
                    <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2 flex items-center gap-1">
                      <FontAwesomeIcon icon={faLightbulb} className="w-3.5 h-3.5" />
                      {t('learn.pro_tips')}
                    </p>
                    <ul className="space-y-1.5">
                      {article.tipsKeys.map((tipKey, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
                          {t(tipKey)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  onClick={() => setExpandedArticle(expandedArticle === article.id ? null : article.id)}
                  className="flex items-center gap-1.5 text-sm text-green-600 font-medium hover:underline"
                >
                  <span>{expandedArticle === article.id ? t('learn.show_less') : t('learn.read_more')}</span>
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
            <h2 className="text-2xl font-bold text-gray-800">{t('learn.faqs.title')}</h2>
            <p className="text-gray-500 text-sm mt-1">{t('learn.faqs.sub')}</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition"
                >
                  <span className="font-medium text-gray-800 text-sm">{t(faq.qKey)}</span>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`w-4 h-4 text-gray-400 flex-shrink-0 ml-4 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-50">
                    <p className="pt-3">{t(faq.aKey)}</p>
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
          <h2 className="text-2xl font-bold mb-2">{t('learn.cta.title')}</h2>
          <p className="text-green-200 text-sm !mb-6">{t('learn.cta.desc')}</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-white text-green-800 font-semibold px-8 py-3 rounded-full hover:bg-green-50 transition shadow-lg"
          >
            <span>{t('learn.cta.shop')}</span>
            <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default LearnPage