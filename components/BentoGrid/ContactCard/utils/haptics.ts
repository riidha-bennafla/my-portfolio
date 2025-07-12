// components/contact/ContactCard/utils/haptics.ts
type HapticType = "success" | "error" | "light" | "medium" | "heavy";

export const triggerHapticFeedback = (
  type: HapticType,
  enabled: boolean = true
) => {
  if (!enabled || !("vibrate" in navigator)) return;

  const patterns = {
    success: [50],
    error: [100, 50, 100],
    light: [10],
    medium: [50],
    heavy: [100],
  };

  navigator.vibrate(patterns[type]);
};
