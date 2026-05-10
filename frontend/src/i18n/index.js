import vi from './vi'
import en from './en'

export const translations = { vi, en }

export const getT = (lang) => (key, params = {}) => { 
  const keys = key.split('.')
  let result = translations[lang]
  
  for (const k of keys) {
    result = result?.[k]
  }

  if (!result) return key

  Object.keys(params).forEach(paramKey => {
    const regex = new RegExp(`{${paramKey}}`, 'g')
    result = result.replace(regex, params[paramKey])
  })

  return result
}