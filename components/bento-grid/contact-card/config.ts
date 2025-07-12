// config.ts

export const CONFIG = {
  TOAST_DURATION: {
    SUCCESS: 3000,
    ERROR: 5000,
    INFO: 4000,
    WARNING: 4500,
  },
  ANIMATION: {
    COPIED_STATE_DURATION: 3000,
    CONFETTI_DELAY: 100,
    SPRING_CONFIG: {
      stiffness: 400,
      damping: 25,
      mass: 0.8,
    },
  },
  STYLES: {
    BUTTON_BG: "!bg-[#161A31]",
    CARD_BG: "rgb(4,7,29)",
    CARD_GRADIENT:
      "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
    HIGH_CONTRAST: {
      BUTTON_BG: "!bg-black",
      CARD_BG: "rgb(0,0,0)",
      CARD_GRADIENT:
        "linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(40,40,40,1) 100%)",
    },
  },
  MEDIA_QUERIES: {
    REDUCED_MOTION: "(prefers-reduced-motion: reduce)",
    HIGH_CONTRAST: "(prefers-contrast: high)",
    MOBILE: "(max-width: 768px)",
    TABLET: "(max-width: 1024px)",
  },
  DEFAULT_EMAIL: "bennafla.riidha@gmail.com",
  MAX_RETRIES: 3,
  DEBOUNCE_MS: 300,
  RETRY_DELAY: 800,
} as const;
