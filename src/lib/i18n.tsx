import React, { createContext, useContext, useState, ReactNode } from "react";
import { translations, LanguageCode } from "./translations";

type I18nContextType = {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  t: (keyPath: string) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<LanguageCode>("en");

  const t = (keyPath: string) => {
    const keys = keyPath.split(".");
    let current: any = translations[lang];
    for (const key of keys) {
      if (current[key] === undefined) {
        // Fallback to English if translation is missing
        let fallback: any = translations["en"];
        for (const k of keys) {
          if (fallback[k] === undefined) return keyPath;
          fallback = fallback[k];
        }
        return fallback;
      }
      current = current[key];
    }
    return current;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within an I18nProvider");
  }
  return context;
}
