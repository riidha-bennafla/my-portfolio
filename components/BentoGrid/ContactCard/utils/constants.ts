// components/BentoGrid/ContactCard/utils/constants.ts

// =============================================
// Core Configuration
// =============================================
/**
 * Default contact email address
 * - Uses actual portfolio owner's email
 */
export const DEFAULT_EMAIL = "bennafla.riidha@gmail.com";

// =============================================
// Toast Timing Configuration
// =============================================
/**
 * Toast visibility durations in milliseconds
 *
 * - SUCCESS: Short confirmation (3s)
 * - ERROR: Longer for reading error details (5s)
 * - INFO: Standard information (4s)
 * - WARNING: Important notices (4.5s)
 */
export const TOAST_DURATION = {
  SUCCESS: 3000,
  ERROR: 5000,
  INFO: 4000,
  WARNING: 4500,
} as const;

// =============================================
// Error Code Constants
// =============================================
/**
 * Standardized error codes for consistent handling
 */
export const ERROR_CODES = {
  CLIPBOARD_FAILED: "CLIPBOARD_FAILED",
  TEXT_TOO_LONG: "TEXT_TOO_LONG",
  PERMISSION_DENIED: "PERMISSION_DENIED",
} as const;

// =============================================
// Internationalization Resources
// =============================================
/**
 * Translation keys for supported locales
 *
 * Structure:
 *   copy: Contact button idle state text
 *   copying: Button text during copy operation
 *   copied: Button text after successful copy
 *   success: Toast success message
 *   error: Toast error template ({email} placeholder)
 *   error_short: Compact error text
 *   closeNotification: Accessibility label for close button
 *   copyEmailClipboard: Button accessibility label
 *   successNotification: ARIA notification type (success)
 *   errorNotification: ARIA notification type (error)
 */
export const TRANSLATIONS = {
  en: {
    copy: "Copy my email address",
    copying: "Copying...",
    copied: "Copied!",
    success: "Email copied to clipboard!",
    error: "Failed to copy: {email}",
    error_short: "Error",
    closeNotification: "Close notification",
    copyEmailClipboard: "Copy email address",
    successNotification: "Success",
    errorNotification: "Error",
  },
  es: {
    copy: "Copiar correo electrónico",
    copying: "Copiando...",
    copied: "¡Copiado!",
    success: "¡Correo copiado al portapapeles!",
    error: "Error al copiar: {email}",
    error_short: "Error",
    closeNotification: "Cerrar notificación",
    copyEmailClipboard: "Copiar dirección de correo",
    successNotification: "Éxito",
    errorNotification: "Error",
  },
  fr: {
    copy: "Copier l'email",
    copying: "Copie en cours...",
    copied: "Copié !",
    success: "Email copié dans le presse-papiers !",
    error: "Échec de la copie : {email}",
    error_short: "Erreur",
    closeNotification: "Fermer la notification",
    copyEmailClipboard: "Copier l'adresse email",
    successNotification: "Succès",
    errorNotification: "Erreur",
  },
  // Additional languages can be added here
  de: {
    copy: "E-Mail kopieren",
    copying: "Wird kopiert...",
    copied: "Kopiert!",
    success: "E-Mail in Zwischenablage kopiert!",
    error: "Fehler beim Kopieren: {email}",
    error_short: "Fehler",
    closeNotification: "Benachrichtigung schließen",
    copyEmailClipboard: "E-Mail-Adresse kopieren",
    successNotification: "Erfolg",
    errorNotification: "Fehler",
  },
} as const;

// =============================================
// Type Exports
// =============================================
/** Supported locale codes */
export type Locale = keyof typeof TRANSLATIONS;

/** Translation key identifiers */
export type TranslationKey = keyof typeof TRANSLATIONS.en;
