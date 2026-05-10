/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'
import { getT } from '../i18n'

const LangContext = createContext()

export const LangProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'vi')

  const toggleLang = () => {
    const newLang = lang === 'vi' ? 'en' : 'vi'
    setLang(newLang)
    localStorage.setItem('lang', newLang)
  }

  const t = getT(lang)

  return (
    <LangContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)