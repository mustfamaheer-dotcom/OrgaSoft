import React from 'react';
import { useSite } from '../context/SiteContext';
import { MessageCircle, ArrowRight, ArrowLeft, CheckCircle2, Zap, Shield, TrendingUp, Star, Users, Clock, Award, Database, Activity } from 'lucide-react';
import KitImage from './KitImage';
import { visitorTracker } from '../lib/visitorTracker';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  users: Users,
  clock: Clock,
  award: Award,
  activity: Activity,
  database: Database,
};

const Hero: React.FC<{ onNavigate: (page: string) => void }> = React.memo(({ onNavigate }) => {
  const { lang, siteData, isRTL } = useSite();
  const { hero, contacts, uiStrings, companyName } = siteData;

  const handleWhatsAppClick = () => {
    visitorTracker.trackCTAClick('whatsapp_click', 'hero', 'hero-section');
    const message = lang === 'ar'
      ? 'مرحباً، أرغب في الاستفسار عن خدماتكم'
      : 'Hello, I would like to inquire about your services';
    const whatsappUrl = `https://wa.me/${contacts.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const features = [
    { icon: Zap, en: 'Lightning Fast', ar: 'سرعة فائقة' },
    { icon: Shield, en: 'Secure Data', ar: 'بيانات آمنة' },
    { icon: TrendingUp, en: 'Scalable', ar: 'قابل للتوسع' },
  ];

  return (
    <div className="relative min-h-screen sm:min-h-[95vh] overflow-hidden flex flex-col">
      <div className="relative flex-1 flex items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#3292ca]/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#df4d21]/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#0f639e]/5 rounded-full blur-[150px]"></div>
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.15) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(0,0,0,0.15) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative w-full pt-4 sm:pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div dir={isRTL ? 'rtl' : 'ltr'} className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div className="text-center lg:text-start">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black/5 dark:bg-white/5 backdrop-blur-sm rounded-full border border-black/10 dark:border-white/10 mb-4 sm:mb-6">
              <span className="w-2 h-2 bg-[#0a743c] rounded-full"></span>
              <span className="text-slate-500 dark:text-white/70 font-medium text-xs tracking-wider uppercase">
                {lang === 'ar' ? 'رائدة منذ 2006' : 'Leading Since 2006'}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-3 sm:mb-4 tracking-tight leading-[1.15]">
              {hero.title[lang]}
            </h1>
            <p className="text-base lg:text-lg text-slate-600 dark:text-white/90 mb-5 sm:mb-6 leading-relaxed max-w-lg mx-auto lg:mx-0">
              {hero.subtitle[lang]}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-5 sm:mb-6">
              <button
                onClick={handleWhatsAppClick}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] sm:px-6 sm:py-3.5 bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold rounded-xl shadow-lg shadow-green-500/20 hover:-translate-y-1 transition-all duration-200 text-sm active:scale-[0.97]"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span>{uiStrings.ctaRequest[lang]}</span>
              </button>
              <button
                onClick={() => onNavigate('products')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] sm:px-6 sm:py-3.5 bg-slate-900/10 hover:bg-slate-900/20 dark:bg-white/10 dark:hover:bg-white/20 text-slate-900 dark:text-white font-bold rounded-xl border border-slate-900/20 dark:border-white/20 backdrop-blur-sm hover:-translate-y-1 transition-all duration-200 text-sm active:scale-[0.97]"
              >
                <span>{lang === 'ar' ? 'استكشف' : 'Explore'}</span>
                {isRTL ? <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> : <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />}
              </button>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center lg:justify-start">
              {features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <feat.icon className="w-5 h-5 text-[#df4d21]" />
                  <span className="font-medium text-base sm:text-sm text-slate-700 dark:text-white/90">{feat[lang]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="block relative">
            <div className="absolute -inset-10 bg-[#df4d21]/10 rounded-full blur-[100px]"></div>
            <div dir={isRTL ? 'rtl' : 'ltr'} className="relative bg-white/60 dark:bg-white/10 backdrop-blur-2xl rounded-2xl border border-slate-200 dark:border-white/30 p-4 sm:p-6 shadow-2xl">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#df4d21] to-transparent"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#df4d21]/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#3292ca]/10 rounded-full blur-[80px]"></div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-white dark:bg-[#1a2744] shrink-0 shadow-md flex items-center justify-center">
                  {siteData.logoImageUrl ? (
                    <img src={siteData.logoImageUrl} alt="" className="w-full h-full object-contain" width={56} height={56} loading="eager" decoding="sync" />
                  ) : (
                    <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-[#df4d21]" />
                  )}
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <h3 className="font-black text-xl leading-tight">
                    <span className="text-[#df4d21]">{companyName[lang].split(' ')[0]}</span>
                    {companyName[lang].split(' ').slice(1).join(' ') && (
                      <>
                        {' '}
                        <span className="text-[#3292ca]">{companyName[lang].split(' ').slice(1).join(' ')}</span>
                      </>
                    )}
                  </h3>
                  <p className="text-slate-500 dark:text-white/70 text-sm font-medium leading-snug">{hero.cardSubtitle[lang]}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="w-5 h-5 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-[#df4d21] font-black">{hero.rating || 4.9}/5</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-5">
                {(hero.stats || []).map((stat, idx) => {
                  const Icon = iconMap[stat.icon] || Activity;
                  return (
                  <div key={idx} className="text-center p-3 bg-slate-100/80 dark:bg-white/5 hover:bg-slate-200/80 dark:hover:bg-white/10 transition-colors duration-200 rounded-xl">
                    <Icon className="w-6 h-6 sm:w-5 sm:h-5 text-[#df4d21] mx-auto mb-1" />
                    <div className="text-xl font-black text-[#df4d21]">{stat.value}</div>
                  </div>
                  );
                })}
              </div>
              <div className="space-y-2">
                {[
                  lang === 'ar' ? 'دعم 24/7' : '24/7 Support',
                  lang === 'ar' ? 'تحديثات مجانية' : 'Free Updates',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#df4d21] shrink-0" />
                    <span className="text-slate-600 dark:text-white/70 text-sm sm:text-xs font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
      </div>
    </div>
  );
});

export default Hero;
