// components/contact/ContactCard/hooks/useAudioFeedback.ts
"use client";
import { useCallback, useEffect, useRef } from "react";

type SoundType = "success" | "error" | "info";

export const useAudioFeedback = (enabled = true) => {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // Initialize audio context on user interaction
    const initAudioContext = () => {
      if (!audioContextRef.current) {
        const AudioContext =
          window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContext();
      }
    };

    window.addEventListener("click", initAudioContext, { once: true });

    return () => {
      window.removeEventListener("click", initAudioContext);
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [enabled]);

  const playSound = useCallback(
    (type: SoundType) => {
      if (!enabled || !audioContextRef.current) return;

      const context = audioContextRef.current;
      if (context.state === "suspended") {
        context.resume();
      }

      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      switch (type) {
        case "success":
          oscillator.frequency.setValueAtTime(523.25, context.currentTime); // C5
          oscillator.frequency.setValueAtTime(
            659.25,
            context.currentTime + 0.1
          ); // E5
          oscillator.frequency.setValueAtTime(
            783.99,
            context.currentTime + 0.2
          ); // G5
          gainNode.gain.setValueAtTime(0.08, context.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            context.currentTime + 0.3
          );
          break;

        case "error":
          oscillator.frequency.setValueAtTime(400, context.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(
            200,
            context.currentTime + 0.15
          );
          gainNode.gain.setValueAtTime(0.1, context.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            context.currentTime + 0.15
          );
          break;

        case "info":
          oscillator.frequency.setValueAtTime(880, context.currentTime); // A5
          gainNode.gain.setValueAtTime(0.05, context.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            context.currentTime + 0.1
          );
          break;
      }

      oscillator.start();
      oscillator.stop(context.currentTime + 0.5);
    },
    [enabled]
  );

  return { playSound };
};
