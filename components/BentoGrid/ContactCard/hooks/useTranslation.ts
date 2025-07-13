// components/BentoGrid/ContactCard/hooks/useTranslation.ts
import { useMemo } from "react";
import { TRANSLATIONS } from "../utils/constants";

// =============================================
// Type Definitions
// =============================================
/**
 * Supported translation keys
 * - Derived from English translation keys
 */
export type TranslationKey = keyof typeof TRANSLATIONS.en;

/**
 * Supported locale codes
 * - Must match keys in TRANSLATIONS object
 */
export type Locale = keyof typeof TRANSLATIONS;

/**
 * Parameters for dynamic translations
 * @property {string} key - Placeholder key
 * @property {string | number} value - Replacement value
 */
interface TranslationParams {
  [key: string]: string | number;
}

// =============================================
// Main Translation Hook
// =============================================
/**
 * Provides internationalization (i18n) capabilities
 *
 * Features:
 * - Locale-specific translations
 * - Dynamic value interpolation
 * - Right-to-Left (RTL) language detection
 * - Fallback to English for missing translations
 *
 * @param {Locale} [locale="en"] - Preferred language
 *
 * @returns {Object} Translation utilities
 * @property {function} t - Translation function
 * @property {Locale} locale - Current locale
 * @property {"ltr" | "rtl"} dir - Text direction
 * @property {boolean} isRTL - RTL language flag
 */
export const useTranslation = (locale: Locale = "en") => {
  // =============================================
  // Locale Validation & Fallback
  // =============================================
  /**
   * Validates locale against available translations
   * - Falls back to 'en' for unsupported locales
   */
  const validatedLocale = useMemo((): Locale => {
    return locale in TRANSLATIONS ? locale : "en";
  }, [locale]);

  // =============================================
  // Translation Dictionary
  // =============================================
  /**
   * Memoized translation dictionary
   * - Uses validated locale with English fallback
   */
  const translations = useMemo(() => {
    return TRANSLATIONS[validatedLocale] || TRANSLATIONS.en;
  }, [validatedLocale]);

  // =============================================
  // Core Translation Function
  // =============================================
  /**
   * Retrieves and formats translated strings
   *
   * @param {TranslationKey} key - Translation identifier
   * @param {TranslationParams} [params] - Dynamic values
   * @returns {string} Localized text
   *
   * @example
   * t('greeting', { name: 'John' })
   * // Returns "Hello John!" for locale 'en'
   */
  const t = useMemo(() => {
    return (key: TranslationKey, params?: TranslationParams): string => {
      // Retrieve translation with fallbacks
      let translationText: string =
        translations[key] || TRANSLATIONS.en[key] || "";

      // Warn about missing translations in development
      if (process.env.NODE_ENV === "development" && !translations[key]) {
        console.warn(
          `Missing translation: ${key} for locale ${validatedLocale}`
        );
      }

      // Replace placeholders with dynamic values
      if (params) {
        // Type-safe replacement
        translationText = Object.entries(params).reduce(
          (currentText, [param, value]) => {
            return currentText.replace(
              new RegExp(`\\{${param}\\}`, "g"),
              String(value)
            );
          },
          translationText
        );
      }

      return translationText;
    };
  }, [translations, validatedLocale]);

  // =============================================
  // Text Direction Detection
  // =============================================
  /**
   * Determines writing direction for locale
   *
   * @returns {"ltr" | "rtl"} Text direction
   */
  const getDirection = useMemo(() => {
    return (): "ltr" | "rtl" => {
      // Add RTL languages here
      const rtlLanguages = ["ar", "he", "fa", "ur"];
      return rtlLanguages.includes(validatedLocale) ? "rtl" : "ltr";
    };
  }, [validatedLocale]);

  // =============================================
  // Return Interface
  // =============================================
  return {
    t,
    locale: validatedLocale,
    dir: getDirection(),
    isRTL: getDirection() === "rtl",
  };
};

// Export types separately to avoid conflicts
export type TranslationKeyType = TranslationKey;
export type LocaleType = Locale;
