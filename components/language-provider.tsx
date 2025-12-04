"use client"

import * as React from "react"

type Language = "ar" | "en"
type Direction = "rtl" | "ltr"

type LanguageContextType = {
  language: Language
  direction: Direction
  toggleLanguage: () => void // لا تفعل شيئًا الآن
}

const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // 🔒 قفل اللغة على العربية
  const language: Language = "ar"
  const direction: Direction = "rtl"

  React.useEffect(() => {
    const root = document.documentElement
    root.setAttribute("lang", language)
    root.setAttribute("dir", direction)
    // عدم استخدام localStorage أو أي حفظ/استرجاع للغة
  }, [language, direction])

  const toggleLanguage = React.useCallback(() => {
    // مقفّل: لا شيء
  }, [])

  return (
    <LanguageContext.Provider value={{ language, direction, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = React.useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}
