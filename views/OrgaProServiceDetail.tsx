import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSite } from '../context/SiteContext';
import { ChevronLeft, ChevronRight, CheckCircle2, PhoneCall, MessageCircle, Rocket, ArrowUpRight } from 'lucide-react';
import KitImage from '../components/KitImage';
import { visitorTracker } from '../lib/visitorTracker';

interface OrgaProServiceDetailProps {
  serviceId: string;
  onBack: () => void;
  onNavigate: (page: string) => void;
}

const OrgaProServiceDetail: React.FC<OrgaProServiceDetailProps> = ({ serviceId, onBack, onNavigate }) => {
  const { lang, siteData, isRTL } = useSite();
  const service = siteData.orgaProServices.items.find(s => s.id === serviceId);
  const visibleItems = siteData.orgaProServices.items.filter(s => s.enabled);
  const relatedServices = service ? visibleItems.filter(s => s.id !== service.id) : [];

  useEffect(() => {
    if (service) visitorTracker.trackPageView(`orga-pro:${service.id}`);
  }, [service]);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfdfe] dark:bg-[#0b1121]">
        <div className="text-center">
          <div className="w-20 h-20 bg-slate-100 dark:bg-[#1e293b] rounded-[2rem] flex items-center justify-center mx-auto mb-6">
            <Rocket className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-4">{lang === 'ar' ? 'الخدمة غير موجودة' : 'Service Not Found'}</h2>
          <button onClick={onBack} className="text-[#0f639e] dark:text-[#3292ca] font-black uppercase tracking-widest text-sm underline">{lang === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}</button>
        </div>
      </div>
    );
  }

  const section = siteData.orgaProServices;
  const descLines = service.description[lang].split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const features = service.features || [];

  const handleWhatsApp = (msg: string) => {
    visitorTracker.trackCTAClick('whatsapp_click', `orga-pro:${service.id}`, service.id);
    window.open(`https://wa.me/${siteData.contacts.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const orderMsg = lang === 'ar'
    ? `السلام عليكم، أرغب في الاستفسار عن خدمة: ${service.name[lang]}`
    : `Hello, I would like to inquire about the service: ${service.name[lang]}`;

  return (
    <div className="bg-[#fcfdfe] dark:bg-[#0b1121] min-h-screen">
      <Helmet>
        <title>{service.name[lang]} | Orga Soft</title>
        <meta property="og:title" content={`${service.name[lang]} | Orga Soft`} />
        <meta property="og:description" content={service.description[lang]} />
        <meta property="og:image" content={service.image || siteData.logoImageUrl || 'https://ik.imagekit.io/y2t2putyl/orgasoft/ORGANEWLOGOtbg.png'} />
      </Helmet>

      <div className="sticky top-0 z-30 bg-white/80 dark:bg-[#0b1121]/80 backdrop-blur-md border-b border-slate-100 dark:border-[#1e293b]">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-12 sm:h-14">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-[#0f639e] dark:hover:text-[#3292ca] font-bold text-sm transition-colors py-2 -my-2 active:scale-95"
            >
              {isRTL ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
              <span className="uppercase tracking-widest text-xs">{lang === 'ar' ? 'العودة' : 'Back'}</span>
            </button>
            <div className="flex items-center gap-2 px-3 py-2 bg-[#df4d21]/10 text-[#df4d21] font-bold text-[10px] uppercase tracking-widest rounded-xl">
              <Rocket className="w-3.5 h-3.5" />
              <span>{section.title[lang]}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 lg:px-6 pt-6 sm:pt-10 pb-16 sm:pb-20">
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-[3px] w-6 sm:w-10 bg-[#df4d21] rounded-full" />
            <span className="text-[#df4d21] font-black text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em]">
              {lang === 'ar' ? 'خدمة متطورة' : 'Advanced Service'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0f639e] dark:text-white leading-tight tracking-tight">
            {service.name[lang]}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 sm:mb-12" style={{ minHeight: '500px' }}>
          <div className="bg-white dark:bg-[#131d31] rounded-2xl p-4 sm:p-6 lg:p-8 shadow-md border border-slate-100 dark:border-[#1e293b] flex flex-col h-full">
            <div className="flex items-center gap-3 mb-5 sm:mb-6 lg:mb-8">
              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-[#df4d21]/10 rounded-xl flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 sm:w-6 h-5 sm:h-6 text-[#df4d21]" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-xl font-black text-[#0f639e] dark:text-white">{lang === 'ar' ? 'تفاصيل الخدمة' : 'Service Details'}</h3>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{lang === 'ar' ? 'ما تقدمه الخدمة' : 'What the service covers'}</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {service.description[lang] && service.description[lang].trim().length > 0 ? (
                <div className={`p-4 sm:p-6 bg-slate-50 dark:bg-[#1a2744] rounded-xl border border-slate-100 dark:border-[#1e293b] h-full ${isRTL ? 'text-right' : 'text-left'}`}>
                  <div className="prose prose-sm sm:prose max-w-none text-slate-900 dark:text-slate-100 leading-relaxed">
                    {service.description[lang].split('\n').map((paragraph, idx) => (
                      paragraph.trim() ? (
                        <p key={idx} className="mb-4 last:mb-0 text-xs sm:text-sm font-medium leading-relaxed">
                          {paragraph.trim()}
                        </p>
                      ) : null
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-slate-400 dark:text-slate-500 font-medium text-sm h-full flex items-center justify-center">
                  {lang === 'ar' ? 'أضف تفاصيل الخدمة من لوحة التحكم' : 'Add service details from the admin panel'}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-[#131d31] rounded-2xl overflow-hidden shadow-md border border-slate-100 dark:border-[#1e293b] h-full">
            {service.image ? (
              <div className="w-full h-full bg-slate-50 dark:bg-[#1a2744]">
                <KitImage src={service.image} alt={service.name[lang]} className="w-full h-full object-cover" width={480} height={463} />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0f639e]/10 to-[#df4d21]/5 dark:from-[#0f639e]/20 dark:to-[#df4d21]/10">
                <Rocket className="w-16 h-16 text-[#0f639e]/30 dark:text-white/20" />
              </div>
            )}
          </div>
        </div>

        {features.length > 0 && (
          <div className="bg-white dark:bg-[#131d31] rounded-2xl p-4 sm:p-6 lg:p-8 shadow-md border border-slate-100 dark:border-[#1e293b] mb-8 sm:mb-12">
            <div className="flex items-center gap-3 mb-5 sm:mb-6 lg:mb-8">
              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-[#df4d21]/10 rounded-xl flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 sm:w-6 h-5 sm:h-6 text-[#df4d21]" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-xl font-black text-[#0f639e] dark:text-white">{lang === 'ar' ? 'المميزات' : 'Features'}</h3>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{lang === 'ar' ? 'ما يميز هذه الخدمة' : 'What makes this service stand out'}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-stretch">
              {features.map((f) => (
                <div key={f.id} className={`flex items-center gap-3 p-3 sm:p-5 bg-slate-50 dark:bg-[#1a2744] rounded-xl border border-slate-100 dark:border-[#1e293b] hover:border-[#df4d21]/20 hover:shadow-md transition-all group ${isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'} h-24 sm:h-28`}>
                  <div className="w-9 sm:w-10 h-9 sm:h-10 bg-white dark:bg-[#131d31] rounded-xl flex items-center justify-center text-[#df4d21] group-hover:bg-[#df4d21] group-hover:text-white transition-all shrink-0 shadow-sm">
                    <CheckCircle2 className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-slate-900 dark:text-slate-100 font-bold text-xs sm:text-sm leading-snug">{f.text[lang]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-[#0f639e] p-4 sm:p-6 lg:p-8 rounded-2xl text-white shadow-md overflow-hidden relative mb-8 sm:mb-12">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 dark:bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-5 sm:mb-8">
              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center border border-white/10 shrink-0">
                <Rocket className="w-5 sm:w-6 h-5 sm:h-6 text-[#df4d21]" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm sm:text-xl font-black">{lang === 'ar' ? 'ابدأ الآن' : 'Get Started'}</h4>
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
                  {lang === 'ar' ? `تواصل مع فريقنا لخدمة ${service.name[lang]}` : `Contact our team for ${service.name.en}`}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a href={`tel:${siteData.contacts.phoneSupport}`}
                onClick={() => visitorTracker.trackCTAClick('phone_click', `orga-pro:${service.id}`, service.id)}
                className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <PhoneCall className="w-4 h-4 text-[#df4d21] shrink-0" />
                <div className="min-w-0">
                  <div className="text-[9px] font-bold text-white/70 uppercase tracking-wider">{lang === 'ar' ? 'رقم الدعم' : 'Support Line'}</div>
                  <div className="font-black text-xs sm:text-sm truncate" dir="ltr">{siteData.contacts.phoneSupport}</div>
                </div>
              </a>
              <button
                onClick={() => handleWhatsApp(orderMsg)}
                className="flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] sm:px-5 sm:py-3 bg-[#df4d21] hover:bg-[#aa4832] text-white font-black rounded-xl text-xs uppercase tracking-widest transition-all active:scale-[0.97]"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>{lang === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
              </button>
            </div>
          </div>
        </div>

        {relatedServices.length > 0 && (
          <div className="bg-white dark:bg-[#131d31] rounded-2xl p-4 sm:p-6 lg:p-8 shadow-md border border-slate-100 dark:border-[#1e293b]">
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-[#0f639e]/10 rounded-xl flex items-center justify-center shrink-0">
                <Rocket className="w-5 sm:w-6 h-5 sm:h-6 text-[#0f639e]" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-xl font-black text-[#0f639e] dark:text-white">{lang === 'ar' ? 'خدمات أخرى' : 'Other Services'}</h3>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{section.title[lang]}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
              {relatedServices.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onNavigate(`orga-pro-${s.id}`)}
                  className="group flex flex-col h-full text-left overflow-hidden rounded-xl border border-slate-100 dark:border-[#1e293b] hover:border-[#0f639e]/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 bg-slate-50 dark:bg-[#1a2744] active:scale-[0.98]"
                >
                  <div className="relative w-full aspect-[480/462.8] sm:aspect-auto sm:h-36 overflow-hidden bg-slate-100 dark:bg-[#1e293b]">
                    {s.image ? (
                      <KitImage src={s.image} alt={s.name[lang]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" width={480} height={200} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0f639e]/10 to-[#df4d21]/5 dark:from-[#0f639e]/20 dark:to-[#df4d21]/10">
                        <Rocket className="w-10 h-10 text-[#0f639e]/30 dark:text-white/20" />
                      </div>
                    )}
                  </div>
                  <div className={`flex items-center justify-between gap-2 p-4 sm:p-5 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className="text-sm font-black text-[#0f639e] dark:text-white leading-tight">{s.name[lang]}</span>
                    <ArrowUpRight className="w-4 h-4 text-[#df4d21] shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrgaProServiceDetail;