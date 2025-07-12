// components/contact/ContactCard/hooks/useTranslation.ts
import { useMemo } from "react";
import { TRANSLATIONS } from "../utils/constants";

type TranslationKey = keyof typeof TRANSLATIONS.en;
type Locale = keyof typeof TRANSLATIONS;

interface TranslationParams {
  [key: string]: string | number;
}

export const useTranslation = (locale: Locale = "en") => {
  const translations = useMemo(() => {
    // Fallback to English if locale not found
    return TRANSLATIONS[locale] || TRANSLATIONS.en;
  }, [locale]);

  const t = useMemo(() => {
    return (key: TranslationKey, params?: TranslationParams): string => {
      let translation = translations[key] || TRANSLATIONS.en[key] || "";

      if (params) {
        // Replace placeholders with actual values
        translation = Object.entries(params).reduce((acc, [param, value]) => {
          return acc.replace(`{${param}}`, String(value));
        }, translation);
      }

      return translation;
    };
  }, [translations]);

  const getDirection = useMemo(() => {
    return (): "ltr" | "rtl" => {
      // Add RTL languages as needed
      return locale === "ar" ? "rtl" : "ltr";
    };
  }, [locale]);

  return {
    t,
    locale,
    dir: getDirection(),
    isRTL: getDirection() === "rtl",
  };
};

export type { TranslationKey, Locale };
