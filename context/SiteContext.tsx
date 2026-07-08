import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { SiteContent, Language, Product } from '../types';
import { INITIAL_SITE_DATA } from '../constants';
import {
  saveSectionsToFirebase,
  subscribeSiteData,
  subscribeLanguage,
  saveLanguagePreference,
  initializeSiteData,
  resetDatabase,
  initAnalytics,
} from '../firebase';
import logger from '../lib/logger';

function deepMergeDefaults(defaults: any, loaded: any): any {
  const result = { ...defaults };
  for (const key in loaded) {
    if (loaded[key] === null || loaded[key] === undefined) continue;
    if (typeof defaults[key] === 'object' && typeof loaded[key] === 'object' && !Array.isArray(defaults[key]) && !Array.isArray(loaded[key])) {
      result[key] = deepMergeDefaults(defaults[key], loaded[key]);
    } else {
      result[key] = loaded[key];
    }
  }
  return result;
}

function mergeMissingProductFields(products: Product[]): Product[] {
  return products.map(p => {
    const base = {
      keyFeatures: [] as Product['keyFeatures'],
      specs: [] as Product['specs'],
      bannerImage: { en: '', ar: '' },
      icon: 'database' as const,
      showOnHome: true,
      demoUrl: '',
    };
    return {
      ...base,
      ...p,
      name: { en: p.name?.en ?? '', ar: p.name?.ar ?? '' },
      description: { en: p.description?.en ?? '', ar: p.description?.ar ?? '' },
      longDescription: { en: p.longDescription?.en ?? '', ar: p.longDescription?.ar ?? '' },
      features: { en: p.features?.en ?? [], ar: p.features?.ar ?? [] },
      image: p.image || '',
    };
  });
}

function mergeWithDefaults(loaded: SiteContent): SiteContent {
  const migrated = { ...loaded };
  if (typeof (migrated as any).logo === 'string') {
    const oldLogo = (migrated as any).logo as string;
    migrated.logo = { en: oldLogo, ar: oldLogo } as any;
  }
  if (migrated.companyName?.ar) {
    migrated.companyName.ar = migrated.companyName.ar.replace(/\s*لل[اأ]نظم[هة]?\s*/g, '').trim();
  }
  if (migrated.companyName?.en) {
    migrated.companyName.en = migrated.companyName.en.replace(/\s*for systems\s*/gi, '').trim();
  }
  if (migrated.logo?.ar) {
    migrated.logo.ar = migrated.logo.ar.replace(/\s*لل[اأ]نظم[هة]?\s*/g, '').trim();
  }
  if (migrated.logo?.en) {
    migrated.logo.en = migrated.logo.en.replace(/\s*for systems\s*/gi, '').trim();
  }
  const DEFAULT_LOGO_URL = 'https://ik.imagekit.io/y2t2putyl/orgasoft/ORGANEWLOGOtbg.png';
  const currentLogo = migrated.logoImageUrl;
  const logoIsOld =
    !currentLogo ||
    currentLogo.startsWith('/logo') ||
    currentLogo === '/logo.jpeg' ||
    currentLogo.includes('y2t2putyl') && !currentLogo.includes('ORGANEWLOGOtbg');
  if (logoIsOld) {
    migrated.logoImageUrl = DEFAULT_LOGO_URL;
  }
  const currentFavicon = migrated.favicon;
  const faviconIsOld =
    !currentFavicon ||
    currentFavicon.startsWith('/logo') ||
    currentFavicon === '/logo.jpeg' ||
    currentFavicon.includes('y2t2putyl') && !currentFavicon.includes('ORGANEWLOGOtbg');
  if (faviconIsOld) {
    migrated.favicon = DEFAULT_LOGO_URL;
  }
  if (!migrated.announcement) {
    migrated.announcement = { enabled: false, messages: [], speed: 'normal' };
  }
  if (!migrated.services) {
    migrated.services = { enabled: false, title: { en: 'IT Services', ar: 'الخدمات التقنية' }, subtitle: { en: '', ar: '' }, items: [] };
  }
  const merged = deepMergeDefaults(INITIAL_SITE_DATA, migrated);
  return {
    ...merged,
    products: mergeMissingProductFields(migrated.products || []),
  };
}

interface SiteContextType {
  siteData: SiteContent;
  updateSiteData: (newData: SiteContent) => void;
  updateSiteSection: (section: string, value: unknown) => void;
  resetDatabase: (data: SiteContent) => Promise<void>;
  lang: Language;
  setLang: (lang: Language) => void;
  isRTL: boolean;
  isLoading: boolean;
  isSyncing: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

function getInitialData(): SiteContent {
  try {
    const saved = localStorage.getItem('orgasoft_site_data');
    if (saved) return JSON.parse(saved) as SiteContent;
  } catch { /* ignore */ }
  return INITIAL_SITE_DATA;
}

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteData, setSiteData] = useState<SiteContent>(getInitialData);
  const [lang, setLangState] = useState<Language>(() => {
    try {
      return (localStorage.getItem('orgasoft_lang') as Language) || 'ar';
    } catch {
      return 'ar';
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('orgasoft_theme') as 'light' | 'dark' | null;
      return saved === 'dark' || saved === 'light' ? saved : 'light';
    } catch {
      return 'light';
    }
  });
  const initialized = useRef(false);
  const userToggleLock = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    initAnalytics();

    const unsubData = subscribeSiteData((data) => {
      if (data) {
        const localData = getInitialData();
        const merged = mergeWithDefaults({ ...localData, ...data });
        setSiteData(merged);
        try { localStorage.setItem('orgasoft_site_data', JSON.stringify(merged)); } catch { /* ignore */ }
        logger.log('Site data synced from Firebase');
      } else {
        initializeSiteData(INITIAL_SITE_DATA);
        try {
          const saved = localStorage.getItem('orgasoft_site_data');
          if (saved) setSiteData(JSON.parse(saved) as SiteContent);
        } catch { /* ignore */ }
      }
      setIsLoading(false);
    });

    const unsubLang = subscribeLanguage((savedLang) => {
      if (userToggleLock.current) return;
      if (savedLang) {
        setLangState(savedLang as Language);
        try { localStorage.setItem('orgasoft_lang', savedLang); } catch { /* ignore */ }
      }
    });

    return () => {
      unsubData();
      unsubLang();
    };
  }, []);

  useEffect(() => {
    if (siteData.favicon) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = siteData.favicon;
    }
  }, [siteData.favicon]);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    try { localStorage.setItem('orgasoft_lang', lang); } catch { /* ignore */ }
  }, [lang]);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    if (theme === 'dark') {
      html.classList.add('dark');
      body.classList.add('dark');
    } else {
      html.classList.remove('dark');
      body.classList.remove('dark');
    }
    try { localStorage.setItem('orgasoft_theme', theme); } catch { /* ignore */ }
  }, [theme]);

  /* Full save — always updates local state, attempts Firebase sync */
  const updateSiteData = useCallback(async (newData: SiteContent) => {
    setIsSyncing(true);
    setSiteData(newData);
    try {
      localStorage.setItem('orgasoft_site_data', JSON.stringify(newData));
    } catch (storageError: any) {
      if (storageError.name === 'QuotaExceededError') {
        localStorage.removeItem('orgasoft_site_data');
      }
    }
    try {
      await saveSectionsToFirebase(newData);
      logger.log('Site data synced to Firebase');
    } catch (firebaseError: any) {
      logger.warn('Firebase sync failed (data saved locally):', firebaseError.message);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  /* Partial save — only writes one section of the siteData tree */
  const updateSiteSection = useCallback(async (section: string, value: unknown) => {
    setIsSyncing(true);
    setSiteData(prev => {
      const updated = { ...prev, [section]: value };
      try { localStorage.setItem('orgasoft_site_data', JSON.stringify(updated)); } catch { /* ignore */ }
      return updated;
    });
    try {
      await saveSectionsToFirebase({ [section]: value });
      logger.log(`Site section "${section}" synced to Firebase`);
    } catch (firebaseError: any) {
      logger.warn(`Firebase sync failed for "${section}" (data saved locally):`, firebaseError.message);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const setLang = async (newLang: Language) => {
    userToggleLock.current = true;
    setLangState(newLang);
    try { localStorage.setItem('orgasoft_lang', newLang); } catch { /* ignore */ }
    saveLanguagePreference(newLang);
  };

  const toggleTheme = useCallback(() => setTheme(prev => prev === 'light' ? 'dark' : 'light'), []);
  const isRTL = lang === 'ar';

  const handleResetDatabase = useCallback(async (data: SiteContent) => {
    setSiteData(data);
    try { localStorage.setItem('orgasoft_site_data', JSON.stringify(data)); } catch {}
    await resetDatabase(data);
  }, []);

  return (
    <SiteContext.Provider value={{ siteData, updateSiteData, updateSiteSection, resetDatabase: handleResetDatabase, lang, setLang, isRTL, isLoading, isSyncing, theme, toggleTheme }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) throw new Error('useSite must be used within a SiteProvider');
  return context;
};
