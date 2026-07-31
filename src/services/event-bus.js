/**
 * REVIXA — SYSTEM EVENT BUS & REALTIME TICKER SERVICE
 * d:/f/src/services/event-bus.js
 */

export class EventBus {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    return () => this.off(event, listener);
  }

  off(event, listenerToRemove) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(l => l !== listenerToRemove);
  }

  emit(event, data) {
    if (!this.events[event]) return;
    this.events[event].forEach(listener => listener(data));
  }
}

export const globalEventBus = new EventBus();
