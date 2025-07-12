// utils.ts

export const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email) && email.length <= 254;
};

export function debounce<Args extends unknown[]>(
  func: (...args: Args) => void,
  wait: number
): (...args: Args) => void {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export const triggerHapticFeedback = (
  type: "success" | "error" | "light" | "medium" | "heavy",
  enabled: boolean = true
) => {
  if (!enabled) return;

  // Modern haptic feedback API
  if ("vibrate" in navigator) {
    const patterns: Record<typeof type, number[]> = {
      success: [50],
      error: [100, 50, 100],
      light: [10],
      medium: [50],
      heavy: [100],
    };
    navigator.vibrate(patterns[type]);
  }

  // Non-standard API (e.g. iOS)
  if ("hapticFeedback" in navigator && navigator.hapticFeedback) {
    try {
      const intensity: "light" | "medium" | "heavy" =
        type === "error" ? "heavy" : type === "success" ? "medium" : type;
      navigator.hapticFeedback.impact(intensity);
    } catch (error) {
      console.warn("Haptic feedback failed:", error);
    }
  }
};

export const createTextAreaForCopy = (text: string): HTMLTextAreaElement => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.cssText = `
    position: fixed;
    left: -999999px;
    top: -999999px;
    opacity: 0;
    pointer-events: none;
    z-index: -1;
  `;
  textArea.setAttribute("readonly", "");
  textArea.setAttribute("aria-hidden", "true");
  textArea.setAttribute("tabindex", "-1");
  return textArea;
};

export const fallbackCopyText = async (text: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const textArea = createTextAreaForCopy(text);
    document.body.appendChild(textArea);

    try {
      textArea.focus();
      textArea.select();
      textArea.setSelectionRange(0, text.length);

      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (successful) {
        resolve();
      } else {
        reject(new Error("Fallback copy failed"));
      }
    } catch (error) {
      if (document.body.contains(textArea)) {
        document.body.removeChild(textArea);
      }
      reject(error);
    }
  });
};

export const announceToScreenReader = (
  message: string,
  priority: "polite" | "assertive" = "polite"
) => {
  const announcement = document.createElement("div");
  announcement.setAttribute("aria-live", priority);
  announcement.setAttribute("aria-atomic", "true");
  announcement.style.cssText = `
    position: absolute;
    left: -10000px;
    width: 1px;
    height: 1px;
    overflow: hidden;
  `;
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    if (document.body.contains(announcement)) {
      document.body.removeChild(announcement);
    }
  }, 1000);
};
