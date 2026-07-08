import React from 'react';
import { useSite } from '../context/SiteContext';
import { Facebook, Twitter, Youtube, MessageCircle, Terminal, Mail, Phone, MapPin, ArrowRight, ArrowLeft, Building2 } from 'lucide-react';
import { visitorTracker } from '../lib/visitorTracker';

const Footer: React.FC<{ onNavigate: (page: string) => void }> = React.memo(({ onNavigate }) => {
  const { lang, siteData, isRTL } = useSite();
  const { products, contacts, uiStrings } = siteData;
  const mainBranch = (contacts.branches || [])[0];

  const navItems = [
    { id: 'home', label: siteData.navLabels.home },
    { id: 'about', label: siteData.navLabels.about },
    { id: 'products', label: siteData.navLabels.products },
    { id: 'contact', label: siteData.navLabels.contact },
  ];

  return (
    <footer className="relative bg-[#020617] text-slate-400 pt-16 sm:pt-24 pb-16 sm:pb-20 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 sm:mb-20">
          <div className="space-y-4 w-full sm:w-auto">
            <div className="flex items-center gap-3 cursor-pointer group w-fit" onClick={() => onNavigate('home')}>
              <div className="shrink-0 transition-transform group-hover:scale-105 duration-300">
                {siteData.logoImageUrl ? (
                  <div className="w-16 sm:w-24 h-16 sm:h-24 rounded-full overflow-hidden ring-2 ring-[#3292ca]/20">
                    <img src={siteData.logoImageUrl} alt={siteData.logo?.[lang] || 'Orga Soft'} className="w-full h-full object-cover" width={96} height={96} loading="lazy" />
                  </div>
                ) : (
                  <div className="w-16 sm:w-24 h-16 sm:h-24 bg-[#0f639e]/20 backdrop-blur-xl border border-[#3292ca]/20 rounded-full flex items-center justify-center text-white shadow-2xl shadow-[#0f639e]/20 group-hover:bg-[#0f639e] group-hover:border-[#3292ca] group-hover:rotate-3 transition-all duration-500">
                    <Terminal className="w-8 h-8 sm:w-12 sm:h-12" />
                  </div>
                )}
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl sm:text-3xl font-black text-[#df4d21] uppercase tracking-tighter">{(siteData.logo?.[lang] || 'Orga').split(' ')[0]}</span>
                <span className="text-xs sm:text-sm font-bold text-[#3292ca] uppercase tracking-[0.3em] sm:tracking-[0.5em]">{(siteData.logo?.[lang] || 'Orga Soft').split(' ').slice(1).join(' ') || 'SOFT'}</span>
              </div>
            </div>
            <p className="text-sm font-medium leading-relaxed text-slate-400 max-w-full sm:max-w-sm">{uiStrings.footerDescription[lang]}</p>
          </div>

          <div className="flex gap-3 sm:gap-4">
            {contacts.showFacebook !== false && contacts.facebook && (
              <a href={contacts.facebook} target="_blank" rel="noopener noreferrer" onClick={() => visitorTracker.trackCTAClick('cta_click', 'footer', 'facebook')} className="w-11 h-11 sm:w-12 sm:h-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-slate-300 hover:bg-[#df4d21] hover:text-white hover:border-[#df4d21] hover:-translate-y-1 transition-all duration-300 shadow-xl active:scale-90"><Facebook className="w-[18px] h-[18px] sm:w-5 sm:h-5" /></a>
            )}
            {contacts.showTwitter !== false && contacts.twitter && (
              <a href={contacts.twitter} target="_blank" rel="noopener noreferrer" onClick={() => visitorTracker.trackCTAClick('cta_click', 'footer', 'twitter')} className="w-11 h-11 sm:w-12 sm:h-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-slate-300 hover:bg-[#df4d21] hover:text-white hover:border-[#df4d21] hover:-translate-y-1 transition-all duration-300 shadow-xl active:scale-90"><Twitter className="w-[18px] h-[18px] sm:w-5 sm:h-5" /></a>
            )}
            {contacts.showYoutube !== false && contacts.youtube && (
              <a href={contacts.youtube} target="_blank" rel="noopener noreferrer" onClick={() => visitorTracker.trackCTAClick('cta_click', 'footer', 'youtube')} className="w-11 h-11 sm:w-12 sm:h-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-slate-300 hover:bg-[#df4d21] hover:text-white hover:border-[#df4d21] hover:-translate-y-1 transition-all duration-300 shadow-xl active:scale-90"><Youtube className="w-[18px] h-[18px] sm:w-5 sm:h-5" /></a>
            )}
            {contacts.showWhatsapp !== false && contacts.whatsapp && (
              <a href={`https://wa.me/${contacts.whatsapp}`} target="_blank" rel="noopener noreferrer" onClick={() => visitorTracker.trackCTAClick('cta_click', 'footer', 'whatsapp')} className="w-11 h-11 sm:w-12 sm:h-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-slate-300 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] hover:-translate-y-1 transition-all duration-300 shadow-xl active:scale-90"><MessageCircle className="w-[18px] h-[18px] sm:w-5 sm:h-5" /></a>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-24">
          <div>
            <h4 className="text-white font-black uppercase tracking-[0.4em] sm:tracking-[0.5em] text-[10px] mb-5 sm:mb-8 flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#df4d21] rounded-full"></span>{uiStrings.footerColLinks[lang]}</h4>
            <ul className="space-y-3 sm:space-y-4">{navItems.map(item => (
              <li key={item.id}><button onClick={() => onNavigate(item.id)} className="group flex items-center gap-2 hover:text-[#df4d21] transition-all text-sm sm:text-sm font-bold text-slate-400 py-1.5 -my-1.5 active:text-[#df4d21]"><span className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">{isRTL ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}</span>{item.label[lang]}</button></li>
            ))}</ul>
          </div>
          <div className="lg:col-span-2">
            <h4 className="text-white font-black uppercase tracking-[0.4em] sm:tracking-[0.5em] text-[10px] mb-5 sm:mb-8 flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#df4d21] rounded-full"></span>{uiStrings.footerColContact[lang]}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
                <div className="space-y-5 sm:space-y-6">
                  {mainBranch && (
                    <div className="flex items-start gap-3 mb-3 pb-3 border-b border-white/5">
                      <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center shrink-0 text-[#df4d21]"><Building2 className="w-4 h-4" /></div>
                      <div className="min-w-0">
                        <span className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{lang === 'ar' ? 'الفرع الرئيسي' : 'Main Branch'}</span>
                        <span className="text-slate-200 font-bold text-xs">{mainBranch.name[lang]}</span>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3"><div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0 text-[#df4d21]"><Phone className="w-5 h-5" /></div><div className="min-w-0"><span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{lang === 'ar' ? 'الدعم الفني' : 'Technical Support'}</span><span className="text-white font-black tracking-tight text-sm" dir="ltr">{mainBranch ? mainBranch.phoneSupport : contacts.phoneSupport}</span></div></div>
                  <div className="flex items-start gap-3"><div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0 text-[#df4d21]"><Mail className="w-5 h-5" /></div><div className="min-w-0"><span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{lang === 'ar' ? 'البريد الإلكتروني' : 'Mail Gateway'}</span><span className="text-white font-black tracking-tight text-sm break-all">{mainBranch ? mainBranch.email : contacts.email}</span></div></div>
                </div>
                <div className="flex items-start gap-3"><div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0 text-[#df4d21]"><MapPin className="w-5 h-5" /></div><div className="min-w-0"><span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{lang === 'ar' ? (mainBranch ? 'عنوان الفرع' : 'المقر الرئيسي') : (mainBranch ? 'Branch Address' : 'Physical Node')}</span><span className="text-sm font-bold text-slate-400 leading-relaxed block break-words">{mainBranch ? mainBranch.address[lang] : contacts.address[lang]}</span></div></div>
              </div>
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
