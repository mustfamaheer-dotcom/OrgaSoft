import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSite } from '../context/SiteContext';
import { saveSectionsToFirebase } from '../firebase';
import type { SiteContent } from '../types';
import AdminLogin from '../admin/components/AdminLogin';
import AdminLayout from '../admin/components/AdminLayout';
import GeneralTab from '../admin/components/GeneralTab';
import NavigationTab from '../admin/components/NavigationTab';
import HeroTab from '../admin/components/HeroTab';
import AboutTab from '../admin/components/AboutTab';
import ProductsTab from '../admin/components/ProductsTab';
import ServicesTab from '../admin/components/ServicesTab';
import PartnersTab from '../admin/components/PartnersTab';
import ContactTab from '../admin/components/ContactTab';
import FooterTab from '../admin/components/FooterTab';
import UIStringsTab from '../admin/components/UIStringsTab';
import VisitorsTab from '../admin/components/VisitorsTab';
import { logoutFromFirebase, onAuthChange, getCurrentUser } from '../lib/auth';
import ToastContainer from '../admin/components/Toast';
import logger from '../lib/logger';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

const TAB_SECTIONS: Record<string, (keyof SiteContent)[]> = {
  general:    ['logo', 'logoImageUrl', 'favicon'],
  navigation: ['navLabels'],
  hero:       ['hero'],
  about:      ['about'],
  products:   ['products'],
  services:   ['services'],
  partners:   ['partners'],
  contact:    ['contacts'],
  footer:     ['uiStrings'],
  uistrings:  ['uiStrings', 'companyName'],
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { siteData, updateSiteData, resetDatabase, lang, isRTL, isSyncing } = useSite();
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!getCurrentUser());
  const [authChecked, setAuthChecked] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState<SiteContent>(siteData);
  const [activeTab, setActiveTab] = useState<string>('general');
  const [dirtyTabs, setDirtyTabs] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: 'product' | 'partner' | 'service' } | null>(null);
  const [toasts, setToasts] = useState<{ id: number; message: string; type: 'success' | 'error' }[]>([]);
  const toastId = useRef(0);

  const addToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = ++toastId.current;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  useEffect(() => { setData(siteData); }, [siteData]);

  useEffect(() => {
    const unsub = onAuthChange((user) => {
      setIsLoggedIn(!!user);
      setAuthChecked(true);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirtyTabs.size > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirtyTabs]);

  const setDataAndMarkDirty = useCallback((newDataOrFn: SiteContent | ((prev: SiteContent) => SiteContent)) => {
    setData(newDataOrFn);
    setDirtyTabs(prev => new Set(prev).add(activeTab));
  }, [activeTab]);

  const updateNestedField = useCallback((path: string, value: any) => {
    setData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let current: any = newData;
      for (let i = 0; i < keys.length - 1; i++) current = current[keys[i]];
      current[keys[keys.length - 1]] = value;
      return newData;
    });
    setDirtyTabs(prev => new Set(prev).add(activeTab));
  }, [activeTab]);

  const handleSave = async () => {
    if (dirtyTabs.size === 0) {
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 2000);
      return;
    }
    setIsSaving(true);
    await updateSiteData(data);
    setDirtyTabs(new Set());
    setIsSaving(false);
    setShowSuccessModal(true);
    setTimeout(() => setShowSuccessModal(false), 3000);
  };

  const handleLogout = async () => {
    try { await logoutFromFirebase(); } catch (e) { logger.error('Logout error:', e); }
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'product') setDataAndMarkDirty({ ...data, products: data.products.filter(p => p.id !== deleteTarget.id) });
    else if (deleteTarget.type === 'partner') setDataAndMarkDirty({ ...data, partners: data.partners.filter(p => p.id !== deleteTarget.id) });
    else if (deleteTarget.type === 'service') setDataAndMarkDirty({ ...data, services: { ...data.services, items: data.services.items.filter(s => s.id !== deleteTarget.id) } });
    setDeleteTarget(null);
  };

  const handleResetDatabase = useCallback(async () => {
    try {
      await resetDatabase(data);
      addToast(lang === 'ar' ? 'تمت إعادة تعيين قاعدة البيانات' : 'Database reset successfully', 'success');
    } catch (error: any) {
      addToast(error.message || (lang === 'ar' ? 'خطأ في إعادة التعيين' : 'Reset failed'), 'error');
    }
  }, [data, resetDatabase, lang, addToast]);

  const titles: Record<string, string> = {
    general:    lang === 'ar' ? 'لوحة التحكم بالنظام' : 'System Control Panel',
    navigation: lang === 'ar' ? 'لوحة التحكم بالنظام' : 'System Control Panel',
    hero:       lang === 'ar' ? 'لوحة التحكم بالنظام' : 'System Control Panel',
    about:      lang === 'ar' ? 'لوحة التحكم بالنظام' : 'System Control Panel',
    products:   lang === 'ar' ? 'لوحة التحكم بالنظام' : 'System Control Panel',
    services:   lang === 'ar' ? 'الخدمات التقنية' : 'IT Services',
    partners:   lang === 'ar' ? 'لوحة التحكم بالنظام' : 'System Control Panel',
    contact:    lang === 'ar' ? 'لوحة التحكم بالنظام' : 'System Control Panel',
    footer:     lang === 'ar' ? 'لوحة التحكم بالنظام' : 'System Control Panel',
    uistrings:  lang === 'ar' ? 'النصوص الظاهرة' : 'UI Strings',
    visitors:   lang === 'ar' ? 'زوار الموقع' : 'Site Visitors',
  };

  if (!authChecked) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#0b1121] dark:to-[#131d31]">
        <div className="w-8 h-8 border-2 border-[#0f639e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <AdminLogin data={data} onLogin={() => {}} onNavigate={onNavigate} lang={lang} isRTL={isRTL} />;
  }

  const renderTab = () => {
    const tabProps = { data, setData: setDataAndMarkDirty, updateNestedField, isRTL, lang, setDeleteTarget };
    switch (activeTab) {
      case 'general': return <GeneralTab {...tabProps} onResetDatabase={handleResetDatabase} />;
      case 'navigation': return <NavigationTab {...tabProps} />;
      case 'hero': return <HeroTab {...tabProps} />;
      case 'about': return <AboutTab {...tabProps} />;
      case 'products': return <ProductsTab {...tabProps} />;
      case 'services': return <ServicesTab {...tabProps} />;
      case 'partners': return <PartnersTab {...tabProps} />;
      case 'contact': return <ContactTab {...tabProps} />;
      case 'footer': return <FooterTab {...tabProps} />;
      case 'uistrings': return <UIStringsTab {...tabProps} />;
      case 'visitors': return <VisitorsTab isRTL={isRTL} />;
      default: return <GeneralTab {...tabProps} />;
    }
  };

  return (
    <>
      <AdminLayout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNavigate={onNavigate}
        onLogout={handleLogout}
        onSave={handleSave}
        isSaving={isSaving}
        isSyncing={isSyncing}
        deleteTarget={deleteTarget}
        setDeleteTarget={setDeleteTarget}
        confirmDelete={confirmDelete}
        showSuccessModal={showSuccessModal}
        setShowSuccessModal={setShowSuccessModal}
        title={titles[activeTab] || 'System Control Panel'}
        subtitle="UNIVERSAL ASSET MANAGEMENT"
      >
        {renderTab()}
      </AdminLayout>
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />
    </>
  );
};

export default AdminDashboard;
