import React, { useCallback, useRef, useState, useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import { Code2, Server, Shield, Cloud, Network, Smartphone, Globe, Database, Settings, Headphones, MoveRight, MoveLeft } from 'lucide-react';
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
    const rotateX = ((y - cy) / cy) * -10;
    const rotateY = ((x - cx) / cx) * 10;
    const inner = card.querySelector('.tilt-inner') as HTMLElement;
    if (inner) inner.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03,1.03,1.03)`;
  }, []);
  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const inner = e.currentTarget.querySelector('.tilt-inner') as HTMLElement;
    if (inner) inner.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) scale3d(1,1,1)';
  }, []);
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const cx = rect.width / 2, cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -10;
    const rotateY = ((x - cx) / cx) * 10;
    const inner = card.querySelector('.tilt-inner') as HTMLElement;
    if (inner) inner.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03,1.03,1.03)`;
  }, []);
  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const inner = e.currentTarget.querySelector('.tilt-inner') as HTMLElement;
    if (inner) inner.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) scale3d(1,1,1)';
  }, []);
  return (
    <div className={className}
      onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      {children}
    </div>
  );
};

const ServiceCard: React.FC<{ service: Service; lang: Language; idx?: number }> = ({ service, lang, idx = 0 }) => {
  const IconComp = ICON_MAP[service.icon] || Code2;
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), idx * 80); return () => clearTimeout(t); }, [idx]);

  return (
    <TiltCard className="group h-full">
      <div className={`tilt-inner relative h-full rounded-2xl overflow-hidden bg-white dark:bg-[#131d31] border border-slate-100 dark:border-[#1e293b] hover:border-[#0f639e]/30 hover:shadow-xl transition-all duration-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        style={{ transitionDelay: `${idx * 80}ms` }}>
        <div className="relative h-56 sm:h-64 overflow-hidden bg-slate-100 dark:bg-[#1e293b]">
          {service.image ? (
            <KitImage src={service.image} alt={service.name[lang]} className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700" width={480} height={256} />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0f639e]/10 to-[#df4d21]/5 dark:from-[#0f639e]/20 dark:to-[#df4d21]/10">
              <IconComp className="w-14 h-14 text-[#0f639e]/30 dark:text-white/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f639e]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        <div className="relative px-5 sm:px-6 pb-5 sm:pb-6 pt-16">
          {!service.image && (
            <div className="absolute -top-7 left-5 sm:left-6 z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0f639e] to-[#3292ca] flex items-center justify-center text-white shadow-lg shadow-[#0f639e]/30 group-hover:shadow-xl group-hover:shadow-[#0f639e]/40 group-hover:-translate-y-1 transition-all duration-300">
                <IconComp className="w-6 h-6" />
              </div>
            </div>
          )}
          <h3 className="text-lg sm:text-xl font-black text-[#0f639e] dark:text-white mb-2 group-hover:text-[#df4d21] transition-colors">{service.name[lang]}</h3>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">{service.description[lang]}</p>
        </div>
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-slate-100 dark:ring-[#1e293b] group-hover:ring-[#0f639e]/20 transition-all duration-500 pointer-events-none" />
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
    setTimeout(() => setAnimating(false), 550);
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

  const renderCard = (service: Service, idx?: number) => <ServiceCard key={service.id} service={service} lang={lang as Language} idx={idx} />;

  const renderDots = () => (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalPages }).map((_, idx) => (
        <button key={idx} onClick={() => goToPage(idx)}
          className={`rounded-full transition-all duration-500 ${idx === page
            ? 'w-8 h-2.5 bg-gradient-to-r from-[#0f639e] to-[#df4d21] shadow-md shadow-[#0f639e]/30'
            : 'w-2.5 h-2.5 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'}`} />
      ))}
    </div>
  );

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
              className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 border-[#0f639e]/20 dark:border-[#0f639e]/40 bg-transparent flex items-center justify-center text-[#0f639e] dark:text-[#3292ca] hover:bg-gradient-to-br hover:from-[#0f639e] hover:to-[#3292ca] hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-[#0f639e]/20 hover:scale-110 active:scale-90 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={animating || totalPages <= 1}>
              {isRTL ? <MoveRight className="w-5 h-5" /> : <MoveLeft className="w-5 h-5" />}
            </button>
            <div className="overflow-hidden rounded-2xl flex-1" style={{ perspective: '1200px' }}>
              <div className="relative mx-auto min-h-[460px] sm:min-h-[480px]">
                {visibleItems.map((service, idx) => {
                  const isActive = idx === page;
                  const isPrev = idx === (page === 0 ? visibleItems.length - 1 : page - 1);
                  const isNext = idx === (page === visibleItems.length - 1 ? 0 : page + 1);
                  let transform = '', opacity = 0, zIndex = 0;
                  let pointerEvents: React.CSSProperties['pointerEvents'] = 'none';
                  if (isActive) { transform = 'translateX(0) rotateY(0deg) scale(1)'; opacity = 1; zIndex = 3; pointerEvents = 'auto'; }
                  else if (isPrev) { transform = 'translateX(-110%) rotateY(35deg) scale(0.8) translateZ(-100px)'; opacity = animating ? 0.6 : 0; zIndex = 1; }
                  else if (isNext) { transform = 'translateX(110%) rotateY(-35deg) scale(0.8) translateZ(-100px)'; opacity = animating ? 0.6 : 0; zIndex = 1; }
                  else { opacity = 0; zIndex = 0; }
                  return (
                    <div key={service.id}
                      className="w-full h-full transition-all duration-500 ease-out absolute inset-0"
                      style={{ transform, opacity, zIndex, pointerEvents, transformStyle: 'preserve-3d', backfaceVisibility: 'hidden', position: isActive ? 'relative' as const : 'absolute' as const }}>
                      {renderCard(service)}
                    </div>
                  );
                })}
              </div>
            </div>
            <button onClick={nextPage}
              className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 border-[#0f639e]/20 dark:border-[#0f639e]/40 bg-transparent flex items-center justify-center text-[#0f639e] dark:text-[#3292ca] hover:bg-gradient-to-br hover:from-[#0f639e] hover:to-[#3292ca] hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-[#0f639e]/20 hover:scale-110 active:scale-90 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={animating || totalPages <= 1}>
              {isRTL ? <MoveLeft className="w-5 h-5" /> : <MoveRight className="w-5 h-5" />}
            </button>
          </div>
          <div className="mt-5">{renderDots()}</div>
          <div className="text-center mt-3">
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">{page + 1} / {totalPages}</p>
          </div>
        </div>

        {/* Desktop (lg+): 3-column grid pagination */}
        <div className="hidden lg:block relative">
          <div className="flex items-start gap-4 xl:gap-6">
            <button onClick={prevPage}
              className="shrink-0 mt-[15%] w-12 h-12 sm:w-14 sm:h-14 rounded-xl border-2 border-[#0f639e]/20 dark:border-[#0f639e]/40 bg-transparent flex items-center justify-center text-[#0f639e] dark:text-[#3292ca] hover:bg-gradient-to-br hover:from-[#0f639e] hover:to-[#3292ca] hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-[#0f639e]/20 hover:scale-110 active:scale-90 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={animating || totalPages <= 1}>
              {isRTL ? <MoveRight className="w-5 h-5 sm:w-6 sm:h-6" /> : <MoveLeft className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
            <div className="flex-1 overflow-hidden rounded-2xl" style={{ perspective: '1200px' }}>
              <div key={page} className="grid grid-cols-3 gap-5"
                style={{ transformStyle: 'preserve-3d' }}>
                {visiblePage.map((service, idx) => (
                  <div key={service.id}
                    className="transition-all duration-500 ease-out"
                    style={{
                      opacity: animating ? 0 : 1,
                      transform: animating ? 'translateY(20px) scale(0.95)' : 'translateY(0) scale(1)',
                      transitionDelay: `${idx * 100}ms`,
                    }}>
                    {renderCard(service, idx)}
                  </div>
                ))}
              </div>
            </div>
            <button onClick={nextPage}
              className="shrink-0 mt-[15%] w-12 h-12 sm:w-14 sm:h-14 rounded-xl border-2 border-[#0f639e]/20 dark:border-[#0f639e]/40 bg-transparent flex items-center justify-center text-[#0f639e] dark:text-[#3292ca] hover:bg-gradient-to-br hover:from-[#0f639e] hover:to-[#3292ca] hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-[#0f639e]/20 hover:scale-110 active:scale-90 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={animating || totalPages <= 1}>
              {isRTL ? <MoveLeft className="w-5 h-5" /> : <MoveRight className="w-5 h-5" />}
            </button>
          </div>
          <div className="mt-6">{renderDots()}</div>
          <div className="text-center mt-3">
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">{lang === 'ar' ? `الصفحة ${page + 1} من ${totalPages}` : `Page ${page + 1} of ${totalPages}`}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;