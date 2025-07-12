// components/contact/ContactCard/utils/constants.ts
export const DEFAULT_EMAIL = "bennafla.riidha@gmail.com";

export const TOAST_DURATION = {
  SUCCESS: 3000,
  ERROR: 5000,
  INFO: 4000,
  WARNING: 4500,
};

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
  },
} as const;
