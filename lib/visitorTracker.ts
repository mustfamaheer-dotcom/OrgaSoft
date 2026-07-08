import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import type { EventType, DeviceType, VisitorEvent } from '../types';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getOrCreateSession(): string {
  let sid = sessionStorage.getItem('orgasoft_session');
  if (!sid) {
    sid = generateId();
    sessionStorage.setItem('orgasoft_session', sid);
  }
  return sid;
}

function detectDeviceType(): DeviceType {
  const ua = navigator.userAgent;
  if (/tablet|iPad|Android(?!.*Mobile)/i.test(ua)) return 'tablet';
  if (/mobile|iPhone|Android.*Mobile/i.test(ua)) return 'mobile';
  return 'desktop';
}

function hasConsent(): boolean {
  return localStorage.getItem('cookie-consent') === 'accepted';
}

const EVENT_COLLECTION = 'visitorEvents';

const PENDING_KEY = 'orgasoft_pending_events';

class VisitorTracker {
  private sessionId: string = '';
  private eventQueue: Omit<VisitorEvent, 'id'>[] = [];
  private flushInterval: ReturnType<typeof setInterval> | null = null;
  private initialized = false;

  init() {
    if (this.initialized) return;
    this.initialized = true;
    this.sessionId = getOrCreateSession();
    this.restorePending();
    this.flushInterval = setInterval(() => this.flush(), 30000);
    window.addEventListener('beforeunload', () => this.persistPending());
  }

  destroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
  }

  trackPageView(page: string) {
    if (!hasConsent()) return;
    this.enqueue('pageview', page);
  }

  trackCTAClick(type: EventType, page: string, meta?: string) {
    if (!hasConsent()) return;
    this.enqueue(type, page, meta);
  }

  private enqueue(eventType: EventType, page: string, meta?: string) {
    this.eventQueue.push({
      timestamp: new Date().toISOString(),
      page,
      referrer: document.referrer || 'direct',
      userAgent: navigator.userAgent,
      language: document.documentElement.lang || 'ar',
      sessionId: this.sessionId,
      eventType,
      deviceType: detectDeviceType(),
      meta,
    });
  }

  private restorePending() {
    try {
      const saved = sessionStorage.getItem(PENDING_KEY);
      if (saved) {
        const pending = JSON.parse(saved);
        if (Array.isArray(pending)) this.eventQueue.push(...pending);
        sessionStorage.removeItem(PENDING_KEY);
      }
    } catch { /* ignore */ }
  }

  private persistPending() {
    if (this.eventQueue.length === 0) return;
    try {
      sessionStorage.setItem(PENDING_KEY, JSON.stringify(this.eventQueue));
    } catch { /* ignore */ }
  }

  private async flush() {
    if (this.eventQueue.length === 0) return;
    const batch = this.eventQueue.splice(0, this.eventQueue.length);
    try {
      const col = collection(db, EVENT_COLLECTION);
      const promises = batch.map(ev => addDoc(col, { ...ev, createdAt: serverTimestamp() }));
      await Promise.all(promises);
    } catch {
      this.eventQueue.unshift(...batch);
      this.persistPending();
    }
  }
}

export const visitorTracker = new VisitorTracker();
export default VisitorTracker;
