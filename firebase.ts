import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import type { SiteContent } from './types';
import logger from './lib/logger';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let analyticsInitialized = false;
export function initAnalytics(): void {
  if (analyticsInitialized || typeof window === 'undefined') return;
  try {
    getAnalytics(app);
    analyticsInitialized = true;
  } catch (error) {
    logger.warn('Analytics not available:', error);
  }
}

logger.log('Firebase initialized (Firestore)');

const SITE_DATA_DOC = doc(db, 'siteData', 'main');
const LANGUAGE_DOC = doc(db, 'userPreferences', 'language');

let lastSnapshotHash = '';
function hashData(data: unknown): string {
  return JSON.stringify(data).length.toString();
}

export const SITE_SECTIONS = [
  'logo', 'logoImageUrl', 'favicon', 'theme',
  'navLabels', 'uiStrings', 'companyName',
  'hero', 'about', 'products', 'partners', 'contacts', 'announcement',
] as const;

export type SiteSection = typeof SITE_SECTIONS[number];

function cleanUndefined(obj: unknown): unknown {
  if (obj === null || obj === undefined) return null;
  if (Array.isArray(obj)) return obj.map(cleanUndefined);
  if (typeof obj === 'object') {
    const cleaned: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      if (v !== undefined) cleaned[k] = cleanUndefined(v);
    }
    return cleaned;
  }
  return obj;
}

export const saveSectionsToFirebase = async (
  sections: Partial<SiteContent>,
): Promise<void> => {
  try {
    await setDoc(SITE_DATA_DOC, cleanUndefined(sections) as Record<string, unknown>, { merge: true });
    logger.log('Site sections saved to Firestore', Object.keys(sections));
  } catch (error: any) {
    logger.error('Error saving sections:', error);
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied. Check Firestore Rules.');
    } else if (error.message?.includes('network')) {
      throw new Error('Network error. Check your connection.');
    }
    throw error;
  }
};

export const initializeSiteData = async (data: SiteContent): Promise<void> => {
  try {
    await setDoc(SITE_DATA_DOC, cleanUndefined(data) as Record<string, unknown>);
    logger.log('Site data initialized in Firestore');
  } catch (error) {
    logger.error('Error initializing:', error);
    throw error;
  }
};

export const resetDatabase = async (data: SiteContent): Promise<void> => {
  try {
    await setDoc(SITE_DATA_DOC, cleanUndefined(data) as Record<string, unknown>);
    logger.log('Database reset with complete data');
  } catch (error: any) {
    logger.error('Error resetting database:', error);
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied. You must be logged in as admin.');
    }
    throw error;
  }
};

export const subscribeSiteData = (
  callback: (data: SiteContent | null) => void,
): (() => void) => {
  return onSnapshot(SITE_DATA_DOC, (snapshot) => {
    if (snapshot.exists()) {
      const val = snapshot.data() as SiteContent;
      const hash = hashData(val);
      if (hash !== lastSnapshotHash) {
        lastSnapshotHash = hash;
        callback(val);
      }
    } else {
      callback(null);
    }
  }, (error) => {
    logger.error('Error subscribing:', error);
    callback(null);
  });
};

export const subscribeLanguage = (
  callback: (lang: string | null) => void,
): (() => void) => {
  let lastHash = '';
  return onSnapshot(LANGUAGE_DOC, (snapshot) => {
    const val = snapshot.exists() ? (snapshot.data().value as string) : null;
    const hash = val || '';
    if (hash !== lastHash) {
      lastHash = hash;
      callback(val);
    }
  }, () => {
    callback(null);
  });
};

export const saveLanguagePreference = async (lang: string): Promise<void> => {
  try {
    await setDoc(LANGUAGE_DOC, { value: lang }, { merge: true });
    logger.log('Language preference saved');
  } catch (error) {
    logger.warn('Could not save language preference to Firebase:', error);
  }
};

export { app, db, firebaseConfig };
