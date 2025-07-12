// analytics.ts

import { AnalyticsEvent } from "./types";

export class AnalyticsManager {
  private events: AnalyticsEvent[] = [];
  private isEnabled: boolean = false;
  private endpoint?: string;

  constructor(enabled: boolean = false, endpoint?: string) {
    this.isEnabled = enabled;
    this.endpoint = endpoint;
  }

  track(
    event: string,
    properties: Record<string, string | number | boolean> = {}
  ) {
    if (!this.isEnabled) return;

    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        language: navigator.language,
        screen: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      timestamp: Date.now(),
    };

    this.events.push(analyticsEvent);
    this.sendEvent(analyticsEvent);
  }

  private async sendEvent(event: AnalyticsEvent) {
    if (!this.endpoint) return;

    try {
      await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.warn("Analytics event failed to send:", error);
    }
  }

  getEvents() {
    return [...this.events];
  }

  clearEvents() {
    this.events = [];
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }
}
