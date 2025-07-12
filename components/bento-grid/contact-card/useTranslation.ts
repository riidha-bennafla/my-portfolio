// useTranslation.ts
import React from "react";

const translations = {
  en: {
    copy: "Copy my email address",
    copying: "Copying...",
    retrying: "Retrying... ({current}/{max})",
    copied: "Email is Copied!",
    success: "Email copied to clipboard!",
    error: "Failed to copy email",
    invalidEmail: "Invalid email format",
    permissionDenied: "Please allow clipboard access or copy manually",
    httpsRequired: "Clipboard access requires HTTPS. Please copy manually",
    fallbackCopy: "Please copy manually",
    closeNotification: "Close notification",
    retryAttempt: "Retrying to copy email, attempt {count}",
    emailCopied: "Email copied to clipboard",
    copyEmailClipboard: "Copy email address to clipboard",
  },
  es: {
    copy: "Copiar mi dirección de correo",
    copying: "Copiando...",
    retrying: "Reintentando... ({current}/{max})",
    copied: "¡Correo Copiado!",
    success: "¡Correo copiado al portapapeles!",
    error: "Error al copiar correo",
    invalidEmail: "Formato de correo inválido",
    permissionDenied: "Permite acceso al portapapeles o copia manualmente",
    httpsRequired:
      "El acceso al portapapeles requiere HTTPS. Copia manualmente",
    fallbackCopy: "Por favor copia manualmente",
    closeNotification: "Cerrar notificación",
    retryAttempt: "Reintentando copiar correo, intento {count}",
    emailCopied: "Correo copiado al portapapeles",
    copyEmailClipboard: "Copiar dirección de correo al portapapeles",
  },
  fr: {
    copy: "Copier mon adresse email",
    copying: "Copie en cours...",
    retrying: "Nouvelle tentative... ({current}/{max})",
    copied: "Email Copié!",
    success: "Email copié dans le presse-papiers!",
    error: "Échec de la copie de l'email",
    invalidEmail: "Format d'email invalide",
    permissionDenied:
      "Veuillez autoriser l'accès au presse-papiers ou copier manuellement",
    httpsRequired:
      "L'accès au presse-papiers nécessite HTTPS. Veuillez copier manuellement",
    fallbackCopy: "Veuillez copier manuellement",
    closeNotification: "Fermer la notification",
    retryAttempt: "Nouvelle tentative de copie de l'email, tentative {count}",
    emailCopied: "Email copié dans le presse-papiers",
    copyEmailClipboard: "Copier l'adresse email dans le presse-papiers",
  },
} as const;

type TranslationKey = keyof typeof translations.en;
type SupportedLocale = keyof typeof translations;

export const useTranslation = (locale: string = "en") => {
  const supportedLocale: SupportedLocale =
    locale in translations ? (locale as SupportedLocale) : "en";

  const t = React.useCallback(
    (key: TranslationKey, params?: Record<string, string | number>) => {
      let translation = translations[supportedLocale][key] as string;

      if (params) {
        Object.entries(params).forEach(([param, value]) => {
          translation = translation.replace(`{${param}}`, String(value));
        });
      }

      return translation;
    },
    [supportedLocale]
  );

  return { t, locale: supportedLocale };
};
