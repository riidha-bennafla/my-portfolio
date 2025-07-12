// usePerformanceMonitor.ts

import { useEffect, useRef, useCallback } from "react";
import { PerformanceConfig, PerformanceMetrics } from "./types";

export class PerformanceMonitor {
  private metrics: Map<string, number> = new Map();
  private observers: PerformanceObserver[] = [];
  private config: PerformanceConfig;

  constructor(config: PerformanceConfig) {
    this.config = config;
    this.setupObservers();
  }

  private setupObservers() {
    if (!this.config.enableMetrics || typeof window === "undefined") return;

    try {
      // Monitor long tasks
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric("longTask", entry.duration);
        }
      });
      longTaskObserver.observe({ entryTypes: ["longtask"] });
      this.observers.push(longTaskObserver);

      // Monitor layout shifts
      const layoutShiftObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const shift = entry as PerformanceEntry & { value: number };
          this.recordMetric("layoutShift", shift.value);
        }
      });
      layoutShiftObserver.observe({ entryTypes: ["layout-shift"] });
      this.observers.push(layoutShiftObserver);
    } catch (error) {
      console.warn("Performance monitoring setup failed:", error);
    }
  }

  recordMetric(name: string, value: number) {
    if (!this.config.enableMetrics) return;

    this.metrics.set(name, value);

    if (this.config.metricsEndpoint) {
      this.sendMetrics(name, value);
    }
  }

  private async sendMetrics(name: string, value: number) {
    try {
      await fetch(this.config.metricsEndpoint!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metric: name,
          value,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
        }),
      });
    } catch (error) {
      console.warn("Failed to send metrics:", error);
    }
  }

  getMetrics(): PerformanceMetrics {
    const getMemoryUsage = () => {
      const anyPerf = performance as Performance & {
        memory?: { usedJSHeapSize: number };
      };
      return anyPerf.memory?.usedJSHeapSize
        ? anyPerf.memory.usedJSHeapSize / 1024 / 1024
        : 0;
    };

    return {
      componentRenderTime: this.metrics.get("componentRender") || 0,
      clipboardOperationTime: this.metrics.get("clipboardOperation") || 0,
      audioInitTime: this.metrics.get("audioInit") || 0,
      animationFrameTime: this.metrics.get("animationFrame") || 0,
      memoryUsage: getMemoryUsage(),
    };
  }

  cleanup() {
    this.observers.forEach((observer) => observer.disconnect());
    this.metrics.clear();
  }
}

export const usePerformanceMonitor = (config: PerformanceConfig) => {
  const monitorRef = useRef<PerformanceMonitor | null>(null);

  useEffect(() => {
    if (config.enableMetrics) {
      monitorRef.current = new PerformanceMonitor(config);
    }

    return () => {
      monitorRef.current?.cleanup();
    };
  }, [config]);

  const recordMetric = useCallback((name: string, value: number) => {
    monitorRef.current?.recordMetric(name, value);
  }, []);

  const getMetrics = useCallback(() => {
    return (
      monitorRef.current?.getMetrics() || {
        componentRenderTime: 0,
        clipboardOperationTime: 0,
        audioInitTime: 0,
        animationFrameTime: 0,
        memoryUsage: 0,
      }
    );
  }, []);

  return { recordMetric, getMetrics };
};
