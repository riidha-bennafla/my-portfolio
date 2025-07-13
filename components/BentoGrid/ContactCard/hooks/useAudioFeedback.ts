// components/BentoGrid/ContactCard/hooks/useAudioFeedback.ts
"use client";
// =============================================
// Component Imports
// =============================================
import { useCallback, useEffect, useRef } from "react";

// =============================================
// Type Definitions
// =============================================
/**
 * Supported sound variants
 * - success: Positive action confirmation
 * - error: Critical operation failure
 * - info: Neutral information notification
 */
export type SoundType = "success" | "error" | "info";

/**
 * Audio configuration options
 *
 * @property {number} [volume] - Master volume (0.0 to 1.0)
 */
interface AudioOptions {
  volume?: number;
}

// Extend Window interface for Safari compatibility
declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

// =============================================
// Sound Configuration
// =============================================
/**
 * Frequency parameters for each sound type
 */
const SOUND_CONFIG = {
  success: {
    frequencies: [523.25, 659.25, 783.99], // C5, E5, G5 (C major chord)
    times: [0, 0.1, 0.2],
    gain: 0.08,
    ramp: 0.3,
  },
  error: {
    frequencies: [400, 200], // Descending tone
    times: [0, 0.15],
    gain: 0.1,
    ramp: 0.15,
  },
  info: {
    frequencies: [880], // A5
    times: [0],
    gain: 0.05,
    ramp: 0.1,
  },
};

// =============================================
// Main Audio Hook
// =============================================
/**
 * Provides audio feedback for user interactions
 *
 * Features:
 * - Lazy initialization of audio context on user interaction
 * - Prevents autoplay restrictions
 * - Cleanup of audio resources
 * - Three distinct sound types
 *
 * @param {boolean} [enabled=true] - Master toggle
 *
 * @returns {Object} Audio control
 * @property {function} playSound - Triggers audio feedback
 */
export const useAudioFeedback = (enabled = true) => {
  // =============================================
  // Audio Context Reference
  // =============================================
  const audioContextRef = useRef<AudioContext | null>(null);

  // =============================================
  // Audio Context Initialization
  // =============================================
  useEffect(() => {
    if (!enabled) return;

    // Initialize audio context on first user interaction
    const initAudioContext = () => {
      // Skip if already initialized
      if (audioContextRef.current) return;

      try {
        // Use standard API or webkit prefix for Safari
        const AudioContextClass =
          window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) {
          console.warn("Web Audio API not supported");
          return;
        }

        audioContextRef.current = new AudioContextClass();
      } catch (error) {
        console.error("Audio context initialization failed:", error);
      }
    };

    window.addEventListener("click", initAudioContext, { once: true });

    // Cleanup
    return () => {
      window.removeEventListener("click", initAudioContext);
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(console.error);
      }
    };
  }, [enabled]);

  // =============================================
  // Sound Playback Function
  // =============================================
  /**
   * Plays a sound of the specified type
   *
   * @param {SoundType} type - Sound variant to play
   * @param {AudioOptions} [options] - Audio configuration
   */
  const playSound = useCallback(
    (type: SoundType, options?: AudioOptions) => {
      // Exit if disabled or audio context not available
      if (!enabled || !audioContextRef.current) return;

      const context = audioContextRef.current;
      const config = SOUND_CONFIG[type];

      try {
        // Resume context if suspended (required by some browsers)
        if (context.state === "suspended") {
          context.resume().catch(console.error);
        }

        // Create audio nodes
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        // Configure connections
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        // Apply sound configuration
        const startTime = context.currentTime;
        config.frequencies.forEach((freq, i) => {
          oscillator.frequency.setValueAtTime(
            freq,
            startTime + config.times[i]
          );
        });

        // Configure volume
        const volume =
          options?.volume !== undefined
            ? Math.min(Math.max(options.volume, 0.01), 1.0)
            : config.gain;

        gainNode.gain.setValueAtTime(volume, startTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          startTime + config.ramp
        );

        // Play and automatically clean up
        oscillator.start();
        oscillator.stop(startTime + config.ramp + 0.1); // Slight buffer

        // Handle node cleanup
        oscillator.addEventListener("ended", () => {
          oscillator.disconnect();
          gainNode.disconnect();
        });
      } catch (error) {
        console.error(`Error playing sound (${type}):`, error);
      }
    },
    [enabled]
  );

  // =============================================
  // Return Interface
  // =============================================
  return { playSound };
};
