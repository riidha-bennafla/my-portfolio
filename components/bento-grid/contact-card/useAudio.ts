// useAudio.ts

import { useCallback } from "react";
import { PerformanceConfig } from "./types";
import { usePerformanceMonitor } from "./usePerformanceMonitor";

export class GlobalAudioManager {
  private static instance: GlobalAudioManager;
  private audioContext: AudioContext | null = null;
  private isSupported: boolean | null = null;
  private isEnabled: boolean = true;

  static getInstance(): GlobalAudioManager {
    if (!GlobalAudioManager.instance) {
      GlobalAudioManager.instance = new GlobalAudioManager();
    }
    return GlobalAudioManager.instance;
  }

  getAudioContext() {
    if (this.isSupported === false) {
      return { context: null, isSupported: false, isEnabled: this.isEnabled };
    }

    try {
      if (!this.audioContext || this.audioContext.state === "closed") {
        const AudioContextClass =
          window.AudioContext ||
          (window as Window & { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;

        if (!AudioContextClass) {
          this.isSupported = false;
          return {
            context: null,
            isSupported: false,
            isEnabled: this.isEnabled,
          };
        }

        this.audioContext = new AudioContextClass();
        this.isSupported = true;
      }

      if (this.audioContext.state === "suspended") {
        this.audioContext.resume();
      }

      return {
        context: this.audioContext,
        isSupported: true,
        isEnabled: this.isEnabled,
      };
    } catch (error) {
      console.warn("Audio context initialization failed:", error);
      this.isSupported = false;
      return { context: null, isSupported: false, isEnabled: this.isEnabled };
    }
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  cleanup() {
    if (this.audioContext && this.audioContext.state !== "closed") {
      this.audioContext.close();
    }
  }
}

export const useAudio = (
  enabled: boolean = true,
  performanceConfig: PerformanceConfig
) => {
  const audioManager = GlobalAudioManager.getInstance();
  const { recordMetric } = usePerformanceMonitor(performanceConfig);

  const createOscillator = useCallback((audioContext: AudioContext) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    return { oscillator, gainNode };
  }, []);

  const playSound = useCallback(
    (type: "error" | "success" | "info") => {
      if (!enabled) return;

      const startTime = Date.now();
      const { context: audioContext, isSupported } =
        audioManager.getAudioContext();

      if (!audioContext || !isSupported) return;

      try {
        const { oscillator, gainNode } = createOscillator(audioContext);
        const currentTime = audioContext.currentTime;

        switch (type) {
          case "error":
            oscillator.frequency.setValueAtTime(400, currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(
              200,
              currentTime + 0.15
            );
            gainNode.gain.setValueAtTime(0.1, currentTime);
            gainNode.gain.exponentialRampToValueAtTime(
              0.01,
              currentTime + 0.15
            );
            oscillator.start(currentTime);
            oscillator.stop(currentTime + 0.15);
            break;

          case "success":
            oscillator.frequency.setValueAtTime(523.25, currentTime); // C5
            oscillator.frequency.setValueAtTime(659.25, currentTime + 0.1); // E5
            oscillator.frequency.setValueAtTime(783.99, currentTime + 0.2); // G5
            gainNode.gain.setValueAtTime(0.08, currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.3);
            oscillator.start(currentTime);
            oscillator.stop(currentTime + 0.3);
            break;

          case "info":
            oscillator.frequency.setValueAtTime(880, currentTime); // A5
            gainNode.gain.setValueAtTime(0.05, currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.1);
            oscillator.start(currentTime);
            oscillator.stop(currentTime + 0.1);
            break;
        }

        recordMetric("audioInit", Date.now() - startTime);
      } catch (error) {
        console.warn("Audio playback failed:", error);
      }
    },
    [enabled, audioManager, createOscillator, recordMetric]
  );

  return { playSound };
};
