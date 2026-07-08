import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSite } from '../context/SiteContext';
import { UI_STRINGS } from '../constants';
import { Menu, X, Globe, ChevronRight, MessageCircle, Phone, Terminal, Sun, Moon } from 'lucide-react';

const Navbar: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { lang, setLang, siteData, isRTL, theme, toggleTheme } = useSite();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
      const sections = ['home', 'about', 'products', 'partners', 'contact'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const toggleLang = () => setLang(lang === 'ar' ? 'en' : 'ar');

  const navItems = [
    { id: 'home', label: siteData.navLabels.home },
    { id: 'about', label: siteData.navLabels.about },
    { id: 'products', label: siteData.navLabels.products },
    { id: 'contact', label: siteData.navLabels.contact },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setIsOpen(false);
  };

  const handleWhatsApp = () => {
    const message = lang === 'ar'
      ? 'مرحباً، أرغب في الاستفسار عن خدماتكم'
      : 'Hello, I would like to inquire about your services';
    window.open(`https://wa.me/${siteData.contacts.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 dark:bg-[#0b1121]/95 backdrop-blur-xl shadow-md border-b border-slate-100/50 dark:border-[#1e293b] py-1'
        : 'bg-white/90 dark:bg-[#0b1121]/90 backdrop-blur-md py-1.5'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center gap-2 cursor-pointer group min-w-0 flex-1 sm:flex-none" onClick={() => onNavigate('home')}>
            <div className="relative shrink-0">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                {siteData.logoImageUrl ? (
                  <img
                    src={siteData.logoImageUrl}
                    alt={siteData.logo?.[lang] || 'Orga Soft'}
                    className="w-full h-full object-contain rounded-full"
                    width={56}
                    height={56}
                    loading="eager"
                    decoding="sync"
                    fetchPriority="high"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#0f639e] to-[#3292ca] rounded-full flex items-center justify-center shadow-md">
                    <Terminal className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col leading-none truncate">
              <span className="text-sm sm:text-base font-black text-[#df4d21] tracking-tight uppercase truncate">
                {(siteData.logo?.[lang] || 'Orga').split(' ')[0]}
              </span>
              <span className="text-xs sm:text-xs font-bold text-[#3292ca] tracking-[0.05em] sm:tracking-[0.15em] uppercase truncate">
                {(siteData.logo?.[lang] || 'Orga Soft').split(' ').slice(1).join(' ') || 'SOFT'}
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-0.5">
            {navItems.map(item => (
              <button key={item.id} onClick={() => handleNavClick(item.id)}
                className={`relative px-4 py-2 text-sm font-bold uppercase tracking-[0.1em] transition-all duration-200 ${
                  activeSection === item.id
                    ? 'text-[#0f639e] dark:text-[#3292ca]'
                    : 'text-slate-500 dark:text-slate-400 hover:text-[#0f639e] dark:hover:text-[#3292ca]'
                }`}>
                {item.label[lang]}
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-[#df4d21] rounded-full transition-all duration-200 ${activeSection === item.id ? 'w-5' : 'w-0'}`} />
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <button onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-bold text-sm hover:bg-slate-100 dark:hover:bg-[#1e293b] transition-all"
              title={lang === 'ar' ? 'تغيير المظهر' : 'Toggle theme'}>
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={handleWhatsApp}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              <MessageCircle className="w-5 h-5" />
              <span>{lang === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
            </button>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>
            <button onClick={toggleLang}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-bold text-sm hover:bg-slate-100 dark:hover:bg-[#1e293b] transition-all">
              <Globe className="w-5 h-5" />
              <span>{UI_STRINGS.langSwitch[lang]}</span>
            </button>
          </div>

          <div className="flex lg:hidden items-center gap-1.5">
            <button onClick={toggleTheme}
              className="w-11 h-11 flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-[#1e293b] active:scale-90 transition-transform">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={handleWhatsApp}
              className="w-11 h-11 bg-[#25D366] rounded-xl flex items-center justify-center shadow-md active:scale-90 transition-transform">
              <MessageCircle className="w-5 h-5 text-white" />
            </button>
            <button onClick={toggleLang}
              className="w-11 h-11 flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold text-xs bg-slate-100 dark:bg-[#1e293b] rounded-xl active:scale-90 transition-transform">
              {lang === 'ar' ? 'EN' : 'ع'}
            </button>
            <button onClick={() => setIsOpen(!isOpen)}
              className="w-11 h-11 bg-slate-100 dark:bg-[#1e293b] rounded-xl flex items-center justify-center active:scale-90 transition-transform">
              {isOpen ? <X className="w-5 h-5 text-slate-600 dark:text-slate-400" /> : <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && createPortal(
        <div className="fixed inset-0 z-[60] lg:!hidden" onClick={() => setIsOpen(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="absolute bottom-0 left-0 right-0 max-h-[90vh] bg-white dark:bg-[#0b1121] rounded-t-3xl shadow-2xl overflow-y-auto" onClick={e => e.stopPropagation()}
            style={{ animation: 'slideUp 0.3s ease-out' }}>
            <div className="flex flex-col items-center pt-3 pb-1">
              <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
            </div>
            <div className="flex items-center justify-between px-5 pb-4 border-b border-slate-100 dark:border-[#1e293b]">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-[#0f639e] to-[#3292ca] rounded-xl flex items-center justify-center shadow-md">
                  <Menu className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-black text-[#0f639e] dark:text-white uppercase tracking-widest">{lang === 'ar' ? 'القائمة' : 'MENU'}</span>
              </div>
              <button onClick={() => setIsOpen(false)}
                className="w-10 h-10 bg-slate-100 dark:bg-[#1e293b] rounded-xl flex items-center justify-center hover:bg-slate-200 dark:hover:bg-[#253349] transition-colors active:scale-90">
                <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
            <div className="px-5 space-y-2 pb-4">
              {navItems.map((item, i) => (
                <button key={item.id} onClick={() => handleNavClick(item.id)}
                  style={{ animation: `fadeInUp 0.3s ease-out ${i * 0.05}s both` }}
                  className={`w-full flex items-center justify-between px-4 py-4 rounded-xl ${isRTL ? 'text-right' : 'text-left'} transition-all duration-200 active:scale-[0.98] ${
                    activeSection === item.id
                      ? 'bg-[#0f639e] text-white shadow-lg shadow-[#0f639e]/20'
                      : 'bg-slate-50 dark:bg-[#131d31] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a2744]'
                  }`}>
                  <span className="font-bold tracking-wide text-sm">{item.label[lang]}</span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isRTL ? 'rotate-180' : ''} ${activeSection === item.id ? '' : 'opacity-30'}`} />
                </button>
              ))}
            </div>
            <div className="px-5 pb-8">
              <div className="p-4 bg-gradient-to-br from-[#0f639e] to-[#3292ca] rounded-2xl text-white space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold uppercase opacity-60 tracking-wider">{lang === 'ar' ? 'الدعم الفني' : 'Technical Support'}</div>
                    <div className="font-black text-sm truncate">{siteData.contacts.phoneSupport}</div>
                  </div>
                </div>
                <button onClick={handleWhatsApp}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#25D366] hover:bg-[#20BA5A] rounded-xl font-bold text-sm transition-all active:scale-[0.97]">
                  <MessageCircle className="w-4 h-4" />
                  {lang === 'ar' ? 'تواصل واتساب' : 'Chat on WhatsApp'}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </nav>
  );
};

export default Navbar;
