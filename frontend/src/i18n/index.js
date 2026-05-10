import vi from './vi'
import en from './en'

export const translations = { vi, en }

export const getT = (lang) => (key) => {
  const keys = key.split('.')
  let result = translations[lang]
  for (const k of keys) {
    result = result?.[k]
  }
  return result || key
}