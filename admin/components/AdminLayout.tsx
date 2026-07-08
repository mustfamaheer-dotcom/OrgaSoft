import React, { useState } from 'react';
import { Terminal, Eye, Lock, Image, Menu, Globe, ShieldCheck, Database, Handshake, Map, PanelBottom, Type, Sun, Moon, ChevronLeft, ChevronRight, CheckCircle2, Cloud, BarChart3 } from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import { ConfirmationModal } from './FormComponents';

interface AdminLayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  onSave: () => void;
  isSaving: boolean;
  isSyncing: boolean;
  deleteTarget: { id: string; type: 'product' | 'partner' | 'service' } | null;
  setDeleteTarget: (t: { id: string; type: 'product' | 'partner' | 'service' } | null) => void;
  confirmDelete: () => void;
  showSuccessModal: boolean;
  setShowSuccessModal: (v: boolean) => void;
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const tabs = [
  { id: 'general', icon: Image, labelEn: 'Brand Identity', labelAr: 'الهوية البصرية' },
  { id: 'navigation', icon: Menu, labelEn: 'Navigation Nodes', labelAr: 'روابط التنقل' },
  { id: 'hero', icon: Globe, labelEn: 'Hero Interface', labelAr: 'القسم الرئيسي' },
  { id: 'about', icon: ShieldCheck, labelEn: 'Ecosystem Legacy', labelAr: 'إرث الشركة' },
  { id: 'products', icon: Database, labelEn: 'System Stack', labelAr: 'المنظومة التقنية' },
  { id: 'services', icon: Cloud, labelEn: 'IT Services', labelAr: 'الخدمات التقنية' },
  { id: 'partners', icon: Handshake, labelEn: 'Partner Network', labelAr: 'الشركاء والعملاء' },
  { id: 'contact', icon: Map, labelEn: 'Contact Hub', labelAr: 'روابط الاتصال' },
  { id: 'footer', icon: PanelBottom, labelEn: 'Footer Workspace', labelAr: 'تذييل الموقع' },
  { id: 'uistrings', icon: Type, labelEn: 'UI Strings', labelAr: 'النصوص الظاهرة' },
  { id: 'visitors', icon: BarChart3, labelEn: 'Visitors', labelAr: 'الزوار' },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({
  activeTab, setActiveTab, onNavigate, onLogout, onSave, isSaving, isSyncing,
  deleteTarget, setDeleteTarget, confirmDelete, showSuccessModal, setShowSuccessModal,
  children, title, subtitle
}) => {
  const { lang, isRTL, theme, toggleTheme } = useSite();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const t = {
    logoutBtn: lang === 'ar' ? 'إنهاء الجلسة' : 'TERMINATE SESSION',
    viewSiteBtn: lang === 'ar' ? 'عرض الموقع المباشر' : 'VIEW LIVE SITE',
    deployBtn: lang === 'ar' ? 'نشر التغييرات' : 'DEPLOY CHANGES',
    deleteConfirmTitle: lang === 'ar' ? 'هل أنت متأكد؟' : 'Are you sure?',
    deleteConfirmMessage: lang === 'ar' ? 'سيتم حذف هذا العنصر نهائياً من النظام.' : 'This asset will be permanently removed from the system.',
    saveSuccess: lang === 'ar' ? 'تم الحفظ بنجاح!' : 'Successfully Saved!',
    saveSuccessMsg: lang === 'ar' ? 'تم تحديث جميع التغييرات وحفظها بنجاح' : 'All changes have been updated and saved successfully',
    ok: lang === 'ar' ? 'حسناً' : 'OK',
    saving: lang === 'ar' ? 'جاري الحفظ...' : 'SAVING...',
  };

  return (
    <div className={`min-h-screen bg-[#f8fafc] dark:bg-[#0b1121] flex ${isRTL ? 'font-tajawal' : 'font-inter'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <ConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title={t.deleteConfirmTitle}
        message={t.deleteConfirmMessage}
        isRTL={isRTL}
      />
      <ConfirmationModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={() => { setShowLogoutConfirm(false); onLogout(); }}
        title={lang === 'ar' ? 'تأكيد الخروج' : 'Confirm Logout'}
        message={lang === 'ar' ? 'هل أنت متأكد من إنهاء الجلسة؟' : 'Are you sure you want to end the session?'}
        isRTL={isRTL}
      />

      {showSuccessModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setShowSuccessModal(false)} />
          <div className="relative bg-white dark:bg-[#131d31] w-full max-w-md rounded-[2rem] p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] border border-slate-100 dark:border-[#1e293b] animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">{t.saveSuccess}</h3>
              <p className="text-slate-400 dark:text-slate-500 font-bold text-sm leading-relaxed mb-8">{t.saveSuccessMsg}</p>
              <button onClick={() => setShowSuccessModal(false)}
                className="w-full py-4 bg-[#df4d21] text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-[#aa4832] transition-all shadow-lg shadow-[#df4d21]/20 active:scale-95">
                {t.ok}
              </button>
            </div>
          </div>
        </div>
      )}

      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-64'} h-screen fixed top-0 ${isRTL ? 'right-0 border-l' : 'left-0 border-r'}
        bg-white dark:bg-[#131d31] border-slate-100 dark:border-[#1e293b] z-[60] flex flex-col p-4 transition-all duration-300`}>
        <div className={`mb-6 px-1 flex items-center justify-between ${sidebarCollapsed ? 'flex-col gap-4' : ''}`}>
          <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'flex-col' : ''}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-[#0f639e] to-[#3292ca] rounded-xl flex items-center justify-center text-white shadow-lg shrink-0">
              <Terminal className="w-5 h-5" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col">
                <h2 className="text-lg font-black text-[#0f639e] dark:text-white tracking-tighter leading-none">CONSOLE</h2>
                <span className="text-[8px] font-black text-emerald-600 uppercase tracking-[0.2em] mt-0.5">STATUS: LIVE</span>
              </div>
            )}
          </div>
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1a2744] transition-all shrink-0">
            {isRTL
              ? (sidebarCollapsed ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />)
              : (sidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />)
            }
          </button>
        </div>

        <nav className="space-y-0.5 flex-grow">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const label = lang === 'ar' ? tab.labelAr : tab.labelEn;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-2 py-3' : 'px-4 py-2.5'} rounded-xl font-black text-xs transition-all duration-150 relative ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1a2744] hover:text-[#0f639e] dark:hover:text-[#3292ca]'
                }`}
                title={sidebarCollapsed ? label : undefined}>
                {isActive && (
                  <span className={`absolute inset-0 bg-gradient-to-r from-[#0f639e] to-[#3292ca] rounded-xl ${isRTL ? 'right-0' : 'left-0'}`} />
                )}
                <Icon className={`relative z-10 w-4 h-4 shrink-0 ${sidebarCollapsed ? '' : (isRTL ? 'ml-3' : 'mr-3')}`} />
                {!sidebarCollapsed && <span className="relative z-10 truncate">{label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-slate-100 dark:border-[#1e293b] mt-auto space-y-0.5">
          <button onClick={toggleTheme}
            className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center p-3' : 'px-4 py-2.5'} text-slate-400 hover:text-[#0f639e] dark:hover:text-[#3292ca] font-black text-[10px] uppercase tracking-widest transition-colors rounded-xl hover:bg-slate-50 dark:hover:bg-[#1a2744]`}>
            {theme === 'dark' ? <Sun className="w-4 h-4 shrink-0" /> : <Moon className="w-4 h-4 shrink-0" />}
            {!sidebarCollapsed && <span className={isRTL ? 'mr-3' : 'ml-3'}>{theme === 'dark' ? (lang === 'ar' ? 'مظهر فاتح' : 'LIGHT MODE') : (lang === 'ar' ? 'مظهر داكن' : 'DARK MODE')}</span>}
          </button>
          <button onClick={() => onNavigate('home')}
            className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center p-3' : 'px-4 py-2.5'} text-slate-400 hover:text-[#0f639e] dark:hover:text-[#3292ca] font-black text-[10px] uppercase tracking-widest transition-colors rounded-xl hover:bg-slate-50 dark:hover:bg-[#1a2744]`}>
            <Eye className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span className={isRTL ? 'mr-3' : 'ml-3'}>{t.viewSiteBtn}</span>}
          </button>
          <button onClick={() => setShowLogoutConfirm(true)}
            className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center p-3' : 'px-4 py-2.5'} text-slate-400 hover:text-rose-500 font-black text-[10px] uppercase tracking-widest transition-colors rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/5`}>
            <Lock className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span className={isRTL ? 'mr-3' : 'ml-3'}>{t.logoutBtn}</span>}
          </button>
        </div>
      </aside>

      <main className={`flex-grow ${isRTL ? (sidebarCollapsed ? 'mr-20' : 'mr-64') : (sidebarCollapsed ? 'ml-20' : 'ml-64')} p-6 lg:p-10 transition-all duration-300`}>
        <div className="max-w-6xl mx-auto">
          <header className="flex items-end justify-between mb-8">
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h1 className="text-3xl font-black text-[#0f639e] dark:text-white tracking-tight leading-none">{title}</h1>
              <p className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] tracking-[0.3em] mt-1">{subtitle}</p>
            </div>
            <div className="flex items-center gap-3">
              {isSyncing && (
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 dark:bg-[#1a2744] rounded-xl">
                  <div className="w-2 h-2 bg-[#3292ca] rounded-full animate-pulse" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SYNC</span>
                </div>
              )}
              {activeTab !== 'visitors' && (
                <button onClick={onSave} disabled={isSaving}
                  className={`flex items-center gap-3 px-7 py-3.5 bg-gradient-to-r from-[#df4d21] to-[#c43d18] text-white font-black rounded-xl shadow-lg hover:shadow-[#df4d21]/30 hover:-translate-y-0.5 transition-all active:translate-y-0 text-xs tracking-widest whitespace-nowrap relative ${isSaving ? 'opacity-75 cursor-not-allowed' : ''}`}>
                  {isSaving ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>{t.saving}</span></>
                  ) : (
                    <><span className="text-base leading-none">&#9654;</span><span>{t.deployBtn}</span></>
                  )}
                </button>
              )}
            </div>
          </header>

          <div className="bg-white dark:bg-[#131d31] rounded-[2rem] p-8 lg:p-10 shadow-sm border border-slate-100 dark:border-[#1e293b]">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
