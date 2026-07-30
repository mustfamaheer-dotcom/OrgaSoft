import React, { useCallback, useRef, useState, useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import { Code2, Server, Shield, Cloud, Network, Smartphone, Globe, Database, Settings, Headphones, MoveRight, MoveLeft, Image as ImageIcon } from 'lucide-react';
import type { Service, ServiceIcon, Language } from '../types';
import KitImage from './KitImage';

const ICON_MAP: Record<ServiceIcon, React.ComponentType<{ className?: string }>> = {
  code: Code2, server: Server, shield: Shield, cloud: Cloud, network: Network,
  smartphone: Smartphone, globe: Globe, database: Database, settings: Settings, headphones: Headphones,
};

const TiltCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2, cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -8;
    const rotateY = ((x - cx) / cx) * 8;
    const inner = card.querySelector('.tilt-inner') as HTMLElement;
    if (inner) inner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
  }, []);
  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const inner = e.currentTarget.querySelector('.tilt-inner') as HTMLElement;
    if (inner) inner.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)';
  }, []);
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const cx = rect.width / 2, cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -8;
    const rotateY = ((x - cx) / cx) * 8;
    const inner = card.querySelector('.tilt-inner') as HTMLElement;
    if (inner) inner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
  }, []);
  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const inner = e.currentTarget.querySelector('.tilt-inner') as HTMLElement;
    if (inner) inner.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)';
  }, []);
  return (
    <div className={className}
      onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      {children}
    </div>
  );
};

const ServiceCard: React.FC<{ service: Service; lang: Language }> = ({ service, lang }) => {
  const IconComp = ICON_MAP[service.icon] || Code2;
  return (
    <TiltCard className="group bg-white dark:bg-[#131d31] rounded-2xl overflow-hidden border border-slate-100 dark:border-[#1e293b] hover:border-[#0f639e]/30 hover:shadow-xl transition-all duration-300 h-full flex flex-col cursor-default active:scale-[0.98]">
      <div className="tilt-inner flex flex-col h-full">
        <div className="relative w-full aspect-[480/320] shrink-0 overflow-hidden bg-slate-100 dark:bg-[#1e293b]">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent z-10" />
          {service.image ? (
            <KitImage src={service.image} alt={service.name[lang]} className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700" width={480} height={320} />
          ) : (
            <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-16 h-16 text-slate-300 dark:text-slate-500" /></div>
          )}
          <div className="absolute top-4 left-4 z-20 w-12 h-12 sm:w-14 sm:h-14 bg-white/90 dark:bg-[#131d31]/90 backdrop-blur rounded-xl flex items-center justify-center text-[#0f639e] dark:text-[#3292ca] shadow-lg group-hover:bg-[#0f639e] group-hover:text-white transition-all">
            <IconComp className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
        </div>
        <div className="p-5 sm:p-6 flex flex-col flex-grow">
          <h3 className="text-base sm:text-lg font-black text-[#0f639e] dark:text-white mb-2 sm:mb-3 group-hover:text-[#df4d21] transition-colors">{service.name[lang]}</h3>
          <p className="text-slate-600 dark:text-slate-400 font-medium text-xs sm:text-sm leading-relaxed">{service.description[lang]}</p>
        </div>
      </div>
    </TiltCard>
  );
};

const ServicesSection: React.FC = () => {
  const { lang, siteData, isRTL } = useSite();
  const services = siteData.services;

  if (!services.enabled) return null;

  const visibleItems = services.items.filter(s => s.enabled);
  if (visibleItems.length === 0) return null;

  const [perPage, setPerPage] = useState(1);
  const totalPages = Math.ceil(visibleItems.length / perPage);
  const [page, setPage] = useState(0);
  const touchStartX = useRef(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const check = () => setPerPage(window.innerWidth >= 1024 ? 3 : 1);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => { setPage(0); }, [perPage]);

  const goToPage = useCallback((p: number) => {
    if (animating || p < 0 || p >= totalPages) return;
    setAnimating(true);
    setPage(p);
    setTimeout(() => setAnimating(false), 500);
  }, [animating, totalPages]);

  const prevPage = useCallback(() => goToPage(page === 0 ? totalPages - 1 : page - 1), [page, totalPages, goToPage]);
  const nextPage = useCallback(() => goToPage(page === totalPages - 1 ? 0 : page + 1), [page, totalPages, goToPage]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; }, []);
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (perPage !== 1) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? nextPage() : prevPage();
  }, [nextPage, prevPage, perPage]);

  const visiblePage = visibleItems.slice(page * perPage, (page + 1) * perPage);

  return (
    <section id="services" className="py-12 sm:py-20 bg-gradient-to-b from-white to-slate-50 dark:from-[#131d31] dark:to-[#0b1121]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-[2px] w-8 bg-[#df4d21]" />
            <span className="text-[#df4d21] font-black tracking-[0.5em] uppercase text-[10px]">{lang === 'ar' ? 'خدماتنا' : 'Our Services'}</span>
            <div className="h-[2px] w-8 bg-[#df4d21]" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0f639e] dark:text-white tracking-tight mb-2">{services.title[lang]}</h2>
          {services.subtitle[lang] && (
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm max-w-lg mx-auto">{services.subtitle[lang]}</p>
          )}
        </div>

        {/* Mobile: single-card 3D carousel */}
        <div className="lg:hidden relative"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}>
          <div className="flex items-center gap-0 sm:gap-2 max-w-[420px] mx-auto">
            <button onClick={prevPage}
              className="shrink-0 w-11 h-11 rounded-full bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] flex items-center justify-center text-[#0f639e] dark:text-white shadow-lg hover:shadow-xl hover:scale-110 hover:border-[#df4d21]/50 active:scale-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={animating || totalPages <= 1}>
              {isRTL ? <MoveRight className="w-5 h-5" /> : <MoveLeft className="w-5 h-5" />}
            </button>
            <div className="overflow-hidden rounded-2xl flex-1" style={{ perspective: '1200px' }}>
              <div className="relative mx-auto max-w-[320px]">
                {visibleItems.map((service, idx) => {
                  const isActive = idx === page;
                  const isPrev = idx === (page === 0 ? visibleItems.length - 1 : page - 1);
                  const isNext = idx === (page === visibleItems.length - 1 ? 0 : page + 1);
                  let transform = '', opacity = 0, zIndex = 0;
                  let pointerEvents: React.CSSProperties['pointerEvents'] = 'none';
                  if (isActive) { transform = 'translateX(0) rotateY(0) scale(1)'; opacity = 1; zIndex = 3; pointerEvents = 'auto'; }
                  else if (isPrev) { transform = 'translateX(-120%) rotateY(25deg) scale(0.85)'; opacity = animating ? 0.5 : 0; zIndex = 1; }
                  else if (isNext) { transform = 'translateX(120%) rotateY(-25deg) scale(0.85)'; opacity = animating ? 0.5 : 0; zIndex = 1; }
                  else { opacity = 0; zIndex = 0; }
                  return (
                    <div key={service.id}
                      className="w-full transition-all duration-500 ease-out absolute inset-0"
                      style={{ transform, opacity, zIndex, pointerEvents, transformStyle: 'preserve-3d', backfaceVisibility: 'hidden', position: isActive ? 'relative' as const : 'absolute' as const }}>
                      <ServiceCard service={service} lang={lang} />
                    </div>
                  );
                })}
              </div>
            </div>
            <button onClick={nextPage}
              className="shrink-0 w-11 h-11 rounded-full bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] flex items-center justify-center text-[#0f639e] dark:text-white shadow-lg hover:shadow-xl hover:scale-110 hover:border-[#df4d21]/50 active:scale-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={animating || totalPages <= 1}>
              {isRTL ? <MoveLeft className="w-5 h-5" /> : <MoveRight className="w-5 h-5" />}
            </button>
          </div>
          <div className="flex items-center justify-center gap-2 mt-5">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button key={idx} onClick={() => goToPage(idx)}
                className={`rounded-full transition-all duration-300 ${idx === page ? 'w-7 h-2.5 bg-gradient-to-r from-[#0f639e] to-[#df4d21] shadow-md' : 'w-2.5 h-2.5 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'}`} />
            ))}
          </div>
          <div className="text-center mt-3">
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">{page + 1} / {totalPages}</p>
          </div>
        </div>

        {/* Desktop (lg+): 3-column grid pagination */}
        <div className="hidden lg:block relative">
          <div className="flex items-start gap-4 xl:gap-6">
            <button onClick={prevPage}
              className="shrink-0 mt-[12%] w-14 h-14 rounded-full bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] flex items-center justify-center text-[#0f639e] dark:text-white shadow-lg hover:shadow-xl hover:scale-110 hover:border-[#df4d21]/50 active:scale-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={animating || totalPages <= 1}>
              {isRTL ? <MoveRight className="w-6 h-6" /> : <MoveLeft className="w-6 h-6" />}
            </button>
            <div className="flex-1 overflow-hidden rounded-2xl">
              <div key={page} className="grid grid-cols-3 gap-5 animate-fadeIn">
                {visiblePage.map(service => (
                  <ServiceCard key={service.id} service={service} lang={lang} />
                ))}
              </div>
            </div>
            <button onClick={nextPage}
              className="shrink-0 mt-[12%] w-14 h-14 rounded-full bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] flex items-center justify-center text-[#0f639e] dark:text-white shadow-lg hover:shadow-xl hover:scale-110 hover:border-[#df4d21]/50 active:scale-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={animating || totalPages <= 1}>
              {isRTL ? <MoveLeft className="w-6 h-6" /> : <MoveRight className="w-6 h-6" />}
            </button>
          </div>
          <div className="flex items-center justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button key={idx} onClick={() => goToPage(idx)}
                className={`rounded-full transition-all duration-300 ${idx === page ? 'w-8 h-2.5 bg-gradient-to-r from-[#0f639e] to-[#df4d21] shadow-md' : 'w-2.5 h-2.5 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'}`} />
            ))}
          </div>
          <div className="text-center mt-3">
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">{lang === 'ar' ? `الصفحة ${page + 1} من ${totalPages}` : `Page ${page + 1} of ${totalPages}`}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;