import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSite } from '../context/SiteContext';
import Hero from '../components/Hero';
import KitImage from '../components/KitImage';
import AnimatedCounter from '../components/AnimatedCounter';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ServicesSection from '../components/ServicesSection';
import { Pill, Building2, Store, Users, Clock, Award, MapPin, Activity, Database, MoveRight, MoveLeft, Mail, PhoneCall, Globe, Info, Handshake, Shield, Rocket, Grid3X3, ArrowUpRight, PlayCircle, ExternalLink } from 'lucide-react';

const iconMap: Record<string, any> = {
  users: Users, clock: Clock, activity: Activity, pill: Pill,
  hospital: Building2, store: Store, database: Database, award: Award,
};

const TiltCard: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className, onClick }) => {
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -8;
    const rotateY = ((x - cx) / cx) * 8;
    const inner = card.querySelector('.tilt-inner') as HTMLElement;
    if (inner) inner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
  }, []);
  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const inner = e.currentTarget.querySelector('.tilt-inner') as HTMLElement;
    if (inner) inner.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)';
  }, []);
  return (
    <div className={className} onClick={onClick} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      {children}
    </div>
  );
};

const Section: React.FC<{ id?: string; className?: string; children: React.ReactNode }> = ({ id, className, children }) => {
  return <div id={id} className={className || ''}>{children}</div>;
};

const Home: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { lang, siteData, isRTL, isLoading } = useSite();
  const { about, products, partners, contacts, uiStrings } = siteData;

  const branches = contacts.branches || [];
  const [activeBranchIdx, setActiveBranchIdx] = useState(0);
  const activeBranch = branches.length > 0 ? branches[activeBranchIdx] : null;

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="bg-[#fcfdfe] dark:bg-[#0b1121] overflow-x-hidden">
      <Helmet>
        <title>Orga Soft | أورجا سوفت</title>
        <meta property="og:title" content="Orga Soft | أورجا سوفت" />
        <meta property="og:description" content={siteData.hero.subtitle[lang]} />
      </Helmet>

      <Hero onNavigate={onNavigate} />

      <div className="relative z-20 -mt-6 pb-6 sm:pb-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {about.stats.map((stat, idx) => {
              const Icon = iconMap[stat.icon] || Activity;
              return (
                <div key={idx} className="relative group">
                    <div className="relative bg-white/70 dark:bg-[#131d31]/70 backdrop-blur-xl p-4 rounded-2xl shadow-lg border border-white/50 dark:border-white/10 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#0f639e] to-[#3292ca] text-white rounded-xl flex items-center justify-center shadow-lg shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-2xl font-black text-[#0f639e] dark:text-white tracking-tight">
                        <AnimatedCounter value={stat.value} />
                      </div>
                      <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
                        {stat.label[lang]}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Section id="about" className="py-12 sm:py-20 bg-white dark:bg-[#131d31]">
        <div className="max-w-6xl mx-auto px-4 relative">
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="h-[2px] w-8 bg-[#df4d21]" />
              <span className="text-[#df4d21] font-black tracking-[0.5em] uppercase text-[10px]">{uiStrings.aboutLabel[lang]}</span>
              <div className="h-[2px] w-8 bg-[#df4d21]" />
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0f639e] dark:text-white tracking-tight">{about.title[lang]}</h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium text-center mb-8 sm:mb-10">{about.content[lang]}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {[
                { icon: Award, en: 'ISO Certified', ar: 'معايير دولية' },
                { icon: Clock, en: 'Since 2006', ar: 'منذ 2006' },
                { icon: Shield, en: 'Secure Systems', ar: 'أنظمة آمنة' },
                { icon: Rocket, en: 'Fast Support', ar: 'دعم سريع' },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 p-4 bg-slate-50 dark:bg-[#1a2744] rounded-xl border border-slate-100 dark:border-[#1e293b] hover:border-[#df4d21]/30 hover:shadow-md transition-all duration-200 group text-center">
                    <div className="w-10 h-10 bg-white dark:bg-[#131d31] rounded-xl flex items-center justify-center text-[#df4d21] shadow-sm group-hover:bg-[#df4d21] group-hover:text-white transition-all shrink-0">
                      <item.icon className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-[#0f639e] dark:text-white text-xs leading-tight">{item[lang]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section id="products" className="py-12 sm:py-20 bg-gradient-to-b from-slate-50 to-white dark:from-[#0b1121] dark:to-[#131d31]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="h-[2px] w-8 bg-[#df4d21]" />
              <span className="text-[#df4d21] font-black tracking-[0.5em] uppercase text-[10px]">{uiStrings.productsLabel[lang]}</span>
              <div className="h-[2px] w-8 bg-[#df4d21]" />
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0f639e] dark:text-white tracking-tight mb-2">{uiStrings.productsTitle[lang]}</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm max-w-lg mx-auto">{uiStrings.productsSubtitle[lang]}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {products.filter(p => p.showOnHome !== false).map((product) => (
              <TiltCard key={product.id}
                onClick={() => onNavigate(`product-${product.id}`)}
                className="group bg-white dark:bg-[#131d31] rounded-2xl overflow-hidden border border-slate-100 dark:border-[#1e293b] hover:border-[#df4d21]/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 sm:h-[580px] flex flex-col cursor-pointer active:scale-[0.98]">
                <div className="tilt-inner flex flex-col h-full">
                  <div className="relative w-full aspect-[480/462.8] shrink-0 overflow-hidden bg-slate-100 dark:bg-[#1e293b]">
                    {product.image ? (
                      <KitImage src={product.image} alt={product.name[lang]} className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500" width={480} height={463} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Grid3X3 className="w-12 h-12 text-slate-300 dark:text-slate-500" /></div>
                    )}
                  </div>
                  <div className="p-4 sm:p-5 flex flex-col flex-grow">
                    <h3 className="text-base sm:text-lg font-black text-[#0f639e] dark:text-white mb-2 group-hover:text-[#df4d21] transition-colors">{product.name[lang]}</h3>
                    <p className="text-slate-600 dark:text-slate-400 font-medium text-xs sm:text-sm leading-relaxed line-clamp-2 mb-3">{product.description[lang]}</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {(product.keyFeatures || []).slice(0, 2).map((kf, i) => (
                        <span key={i} className="px-3 py-1.5 bg-slate-100 dark:bg-[#1e293b] rounded-full text-xs font-semibold text-slate-600 dark:text-slate-400">{kf.text[lang]}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mt-auto">
                      <div className={`flex items-center gap-1.5 text-[#df4d21] font-bold uppercase tracking-[0.15em] text-xs ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                        {uiStrings.ctaMore[lang]}
                        {isRTL ? <MoveLeft className="w-3.5 h-3.5" /> : <MoveRight className="w-3.5 h-3.5" />}
                      </div>
                      {product.demoUrl && (
                        <a href={product.demoUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                          className="mr-auto flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#df4d21] to-[#0f639e] text-white font-bold text-xs uppercase tracking-widest rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95">
                          <PlayCircle className="w-4 h-4" />
                          <span>{lang === 'ar' ? 'نسخه تجريبيه' : 'Demo'}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>

          <div className="text-center mt-10 sm:mt-14">
            <button onClick={() => onNavigate('all-applications')}
              className="group inline-flex items-center justify-center gap-2 sm:gap-4 px-6 py-3.5 sm:px-10 sm:py-5 bg-[#0f639e] text-white rounded-[2rem] font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-[#0f639e]/80 shadow-xl shadow-[#0f639e]/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 active:scale-95">
              <Grid3X3 className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{lang === 'ar' ? 'عرض جميع التطبيقات' : 'View All Applications'}</span>
              <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-4">
              {lang === 'ar' ? `${products.filter(p => p.showOnHome !== false).length} من أصل ${products.length} تطبيق معروض` : `${products.filter(p => p.showOnHome !== false).length} of ${products.length} applications displayed`}
            </p>
          </div>
        </div>
      </Section>

      <ServicesSection />

      <Section id="partners" className="py-12 sm:py-20 bg-white dark:bg-[#131d31]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="h-[2px] w-8 bg-[#df4d21]" />
              <span className="text-[#df4d21] font-black tracking-[0.5em] uppercase text-[10px]">{uiStrings.partnersLabel[lang]}</span>
              <div className="h-[2px] w-8 bg-[#df4d21]" />
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0f639e] dark:text-white tracking-tight">{uiStrings.partnersTitle[lang]}</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {partners.map((partner) => (
              <div key={partner.id}
                className="group p-4 sm:p-4 bg-slate-50 dark:bg-[#1a2744] rounded-xl border border-slate-100 dark:border-[#1e293b] hover:border-[#0f639e]/20 hover:bg-[#0f639e] hover:-translate-y-1 transition-all duration-200 cursor-pointer active:scale-95">
                {partner.logo ? (
                  <KitImage src={partner.logo} alt={partner.name[lang]} className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg mb-2 sm:mb-3 object-cover" width={40} height={40} />
                ) : (
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white dark:bg-[#131d31] rounded-lg flex items-center justify-center text-[#df4d21] mb-2 sm:mb-3 shadow-sm group-hover:bg-[#df4d21] group-hover:text-white transition-all">
                    <Handshake className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
                  </div>
                )}
                <h4 className="font-black text-[#0f639e] dark:text-white group-hover:text-white text-xs sm:text-sm leading-tight mb-0.5 truncate">{partner.name[lang]}</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 group-hover:text-white font-semibold uppercase truncate">{partner.location[lang]}</p>
              </div>
            ))}

          </div>
        </div>
      </Section>

      <Section id="contact" className="py-12 sm:py-20 bg-gradient-to-b from-white to-slate-50 dark:from-[#131d31] dark:to-[#0b1121]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="h-[2px] w-8 bg-[#df4d21]" />
              <span className="text-[#df4d21] font-black tracking-[0.5em] uppercase text-[10px]">{uiStrings.contactLabel[lang]}</span>
              <div className="h-[2px] w-8 bg-[#df4d21]" />
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0f639e] dark:text-white tracking-tight">{uiStrings.contactTitle[lang]}</h2>
          </div>

          {branches.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6 sm:mb-8">
              {branches.map((b, idx) => (
                <button key={b.id} onClick={() => setActiveBranchIdx(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    idx === activeBranchIdx
                      ? 'bg-[#0f639e] text-white shadow-lg shadow-[#0f639e]/20'
                      : 'bg-slate-100 dark:bg-[#1a2744] text-slate-500 dark:text-slate-400 hover:bg-[#0f639e]/10 hover:text-[#0f639e]'
                  }`}>
                  {b.name[lang]}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5">
              <div className="bg-[#0f639e] rounded-2xl p-5 sm:p-6 text-white relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
                <div className="relative space-y-4">
                  {activeBranch ? (
                    <>
                      <div className="flex items-center gap-2 pb-2 mb-1 border-b border-white/10">
                        <Building2 className="w-4 h-4 text-[#df4d21]" />
                        <span className="text-sm font-black">{activeBranch.name[lang]}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 text-[#df4d21]"><PhoneCall className="w-5 h-5" /></div>
                        <div className="min-w-0">
                          <div className="text-[10px] font-bold text-white/70 uppercase tracking-wider">{lang === 'ar' ? 'الدعم الفني' : 'Technical Support'}</div>
                          <div className="text-sm font-black truncate" dir="ltr">{activeBranch.phoneSupport}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 text-[#df4d21]"><Users className="w-5 h-5" /></div>
                        <div className="min-w-0">
                          <div className="text-[10px] font-bold text-white/70 uppercase tracking-wider">{lang === 'ar' ? 'الإدارة' : 'Administration'}</div>
                          <div className="text-sm font-black truncate" dir="ltr">{activeBranch.phoneAdmin}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 text-[#df4d21]"><Mail className="w-5 h-5" /></div>
                        <div className="min-w-0">
                          <div className="text-[10px] font-bold text-white/70 uppercase tracking-wider">{lang === 'ar' ? 'البريد' : 'Email'}</div>
                          <div className="text-sm font-medium break-all">{activeBranch.email}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 text-[#df4d21]"><MapPin className="w-5 h-5" /></div>
                        <div className="min-w-0">
                          <div className="text-[10px] font-bold text-white/70 uppercase tracking-wider">{lang === 'ar' ? 'الموقع' : 'Location'}</div>
                          <div className="text-sm font-medium text-white/90 break-words">{activeBranch.address[lang]}</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 text-[#df4d21]"><PhoneCall className="w-5 h-5" /></div>
                        <div className="min-w-0">
                          <div className="text-[10px] font-bold text-white/70 uppercase tracking-wider">{lang === 'ar' ? 'الدعم الفني' : 'Technical Support'}</div>
                          <div className="text-sm font-black truncate" dir="ltr">{contacts.phoneSupport}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 text-[#df4d21]"><Users className="w-5 h-5" /></div>
                        <div className="min-w-0">
                          <div className="text-[10px] font-bold text-white/70 uppercase tracking-wider">{lang === 'ar' ? 'الإدارة' : 'Administration'}</div>
                          <div className="text-sm font-black truncate" dir="ltr">{contacts.phoneAdmin}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 text-[#df4d21]"><Mail className="w-5 h-5" /></div>
                        <div className="min-w-0">
                          <div className="text-[10px] font-bold text-white/70 uppercase tracking-wider">{lang === 'ar' ? 'البريد' : 'Email'}</div>
                          <div className="text-sm font-medium break-all">{contacts.email}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 text-[#df4d21]"><MapPin className="w-5 h-5" /></div>
                        <div className="min-w-0">
                          <div className="text-[10px] font-bold text-white/70 uppercase tracking-wider">{lang === 'ar' ? 'الموقع' : 'Location'}</div>
                          <div className="text-sm font-medium text-white/90 break-words">{contacts.address[lang]}</div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#0a743c] rounded-xl flex items-center justify-center shrink-0"><Info className="w-4 h-4 text-white" /></div>
                  <div className="text-sm font-semibold text-white/70">{uiStrings.contactSubtitle[lang]}</div>
                </div>
              </div>
            </div>
            {(activeBranch?.mapEmbedUrl || contacts.mapEmbedUrl) && (
              <div className="lg:col-span-7 rounded-2xl overflow-hidden shadow-lg relative h-[300px] sm:h-[350px] lg:h-auto">
                <iframe src={activeBranch?.mapEmbedUrl || contacts.mapEmbedUrl} className="w-full h-full border-none grayscale opacity-90" loading="lazy" allowFullScreen />
                <div className="absolute top-4 left-4 bg-white/95 dark:bg-[#131d31]/95 backdrop-blur-xl px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-md">
                  <Globe className="w-3 h-3 text-[#0a743c]" /> LIVE NODE
                </div>
              </div>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Home;
