// ContactCard.tsx

import React, { useCallback, useMemo } from "react";
import { IoCopyOutline } from "react-icons/io5";

// Types & Config
import { ContactCardProps } from "./types";
import { CONFIG } from "./config";

// Hooks
import { useAccessibility } from "./AccessibilityContext";
import { useTranslation } from "./useTranslation";
import { usePerformanceMonitor } from "./usePerformanceMonitor";
import { useClipboard } from "./useClipboard";
import { useAudio } from "./useAudio";
import { useToast } from "./useToast";

// Utils
import { announceToScreenReader, triggerHapticFeedback } from "./utils";

// UI Components
import { LottieAnimation } from "./LottieAnimation";
import { Toast } from "./Toast";
import MagicButton from "@/components/ui/MagicButton";

// Analytics
import { AnalyticsManager } from "./analytics";

export const ContactCard: React.FC<ContactCardProps> = (props) => {
  const email = props.email ?? CONFIG.DEFAULT_EMAIL;
  const locale = props.locale ?? "en";
  const enableHaptics = props.enableHaptics ?? true;
  const enableAudio = props.enableAudio ?? true;
  const enableConfetti = props.enableConfetti ?? true;

  const { reducedMotion, highContrast } = useAccessibility();
  const { t } = useTranslation(locale);

  const performanceConfig = useMemo(
    () =>
      props.performanceConfig || {
        enableMetrics: props.enableAnalytics ?? false,
        debounceMs: CONFIG.DEBOUNCE_MS,
        retryDelay: CONFIG.RETRY_DELAY,
      },
    [props.enableAnalytics, props.performanceConfig]
  );

  const analytics = useMemo(
    () =>
      new AnalyticsManager(
        props.enableAnalytics,
        performanceConfig.metricsEndpoint
      ),
    [props.enableAnalytics, performanceConfig.metricsEndpoint]
  );

  const { copied, loading, error, copyToClipboard } = useClipboard(
    email,
    enableHaptics,
    locale,
    (email) => {
      const metadata = analytics.getEvents().slice(-1)[0];
      props.onCopySuccess?.(email, metadata);
    },
    (error, email) => {
      const metadata = analytics.getEvents().slice(-1)[0];
      props.onCopyError?.(error, email, metadata);
    }
  );

  const { toasts, showToast, clearToast } = useToast();
  const { playSound } = useAudio(enableAudio, performanceConfig);

  const handleClick = useCallback(() => {
    analytics.track("email_copy_click", { email });
    copyToClipboard();
    playSound("success");
    announceToScreenReader(t("emailCopied"));
  }, [analytics, email, copyToClipboard, playSound, t]);

  return (
    <div className="relative p-6 rounded-xl bg-white dark:bg-black border border-gray-200 dark:border-white/10">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        {t("copyEmailClipboard")}
      </h2>

      <MagicButton
        title={copied ? t("copied") : t("copy")}
        icon={<IoCopyOutline />}
        position="left"
        handleClick={handleClick}
        otherClasses="!bg-[#161A31]"
      />

      {enableConfetti && copied && <LottieAnimation isActive={copied} />}
      <Toast toasts={toasts} onClose={clearToast} />
    </div>
  );
};
