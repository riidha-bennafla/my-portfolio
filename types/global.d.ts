declare interface Navigator {
  hapticFeedback?: {
    impact: (intensity: "light" | "medium" | "heavy") => void;
  };
}
