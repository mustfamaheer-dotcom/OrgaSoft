import React, { useCallback, useRef, useState, useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import { Rocket, MoveRight, MoveLeft } from 'lucide-react';
import type { OrgaProService, Language } from '../types';
import KitImage from './KitImage';

const TiltCard: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className, onClick }) => {
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
      onClick={onClick}
      onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      {children}
    </div>
  );
};

const OrgaProCard: React.FC<{ service: OrgaProService; lang: Language; isRTL: boolean; onNavigate?: (page: string) => void; idx?: number }> = ({ service, lang, isRTL, onNavigate, idx = 0 }) => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), idx * 80); return () => clearTimeout(t); }, [idx]);

  return (
    <TiltCard
      onClick={onNavigate ? () => onNavigate(`orga-pro-${service.id}`) : undefined}
      className="group h-full cursor-pointer active:scale-[0.98]">
      <div className={`tilt-inner relative h-full rounded-2xl overflow-hidden bg-white dark:bg-[#131d31] border border-slate-100 dark:border-[#1e293b] hover:border-[#0f639e]/30 hover:shadow-xl transition-all duration-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        style={{ transitionDelay: `${idx * 80}ms` }}>
        <div className="relative w-full aspect-[480/462.8] overflow-hidden bg-slate-100 dark:bg-[#1e293b]">
          {service.image ? (
            <KitImage src={service.image} alt={service.name[lang]} className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700" width={480} height={463} />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0f639e]/10 to-[#df4d21]/5 dark:from-[#0f639e]/20 dark:to-[#df4d21]/10">
              <Rocket className="w-14 h-14 text-[#0f639e]/30 dark:text-white/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f639e]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        <div className="relative px-5 sm:px-6 pb-5 sm:pb-6 pt-5 sm:pt-6">
          <h3 className="text-lg sm:text-xl font-black text-[#0f639e] dark:text-white mb-2 group-hover:text-[#df4d21] transition-colors">{service.name[lang]}</h3>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">{service.description[lang]}</p>
          <div className={`flex items-center gap-1.5 mt-3 text-[#df4d21] font-bold uppercase tracking-[0.15em] text-[11px] ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <span>{isRTL ? 'التفاصيل' : 'Learn More'}</span>
            {isRTL ? <MoveLeft className="w-3.5 h-3.5" /> : <MoveRight className="w-3.5 h-3.5" />}
          </div>
        </div>
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-slate-100 dark:ring-[#1e293b] group-hover:ring-[#0f639e]/20 transition-all duration-500 pointer-events-none" />
      </div>
    </TiltCard>
  );
};

const OrgaProServicesSection: React.FC<{ onNavigate?: (page: string) => void }> = ({ onNavigate }) => {
  const { lang, siteData, isRTL } = useSite();
  const section = siteData.orgaProServices;

  if (!section.enabled) return null;

  const visibleItems = section.items.filter(s => s.enabled);
  if (visibleItems.length === 0) return null;

  const [perPage, setPerPage] = useState(1);
  const totalPages = Math.ceil(visibleItems.length / perPage);
  const [page, setPage] = useState(0);
  const [animating, setAnimating] = useState(false);

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');

  useEffect(() => { setDir(isRTL ? 'rtl' : 'ltr'); }, [isRTL]);
  useEffect(() => { setPage(0); }, [visibleItems.length]);

  useEffect(() => {
    const handleResize = () => setPerPage(window.innerWidth >= 1024 ? 3 : 1);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const goToPage = useCallback((p: number) => {
    if (animating) return;
    setAnimating(true);
    setPage(p);
    setTimeout(() => setAnimating(false), 750);
  }, [animating]);

  const prevPage = useCallback(() => {
    if (animating) return;
    setAnimating(true);
    setPage(p => p === 0 ? totalPages - 1 : p - 1);
    setTimeout(() => setAnimating(false), 500);
  }, [animating, totalPages]);

  const nextPage = useCallback(() => {
    if (animating) return;
    setAnimating(true);
    setPage(p => p === totalPages - 1 ? 0 : p + 1);
    setTimeout(() => setAnimating(false), 500);
  }, [animating, totalPages]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dir === 'rtl') { if (dx > 0) nextPage(); else prevPage(); }
      else { if (dx > 0) prevPage(); else nextPage(); }
    }
  }, [dir, prevPage, nextPage]);

  const renderDots = () => (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalPages }).map((_, idx) => (
        <button key={idx} onClick={() => goToPage(idx)}
          className={`rounded-full transition-all duration-300 ${idx === page
            ? 'w-7 h-2.5 bg-gradient-to-r from-[#0f639e] to-[#df4d21] shadow-md'
            : 'w-2.5 h-2.5 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'}`} />
      ))}
    </div>
  );

  const visiblePage = visibleItems.slice(page * perPage, (page + 1) * perPage);

  const renderCard = (service: OrgaProService, idx?: number) => (
    <OrgaProCard key={service.id} service={service} lang={lang} isRTL={isRTL} onNavigate={onNavigate} idx={idx} />
  );

  return (
    <section id="orga-pro-services" className="py-12 sm:py-20 bg-gradient-to-b from-slate-50 to-white dark:from-[#0b1121] dark:to-[#131d31]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8 sm:mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-[2px] w-8 bg-[#df4d21]" />
            <span className="text-[#df4d21] font-black tracking-[0.5em] uppercase text-[10px]">{section.title[lang]}</span>
            <div className="h-[2px] w-8 bg-[#df4d21]" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0f639e] dark:text-white tracking-tight">{section.title[lang]}</h2>
          {section.subtitle[lang] && (
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base font-medium mt-3 max-w-xl mx-auto">{section.subtitle[lang]}</p>
          )}
        </div>

        {/* Mobile (< lg): single-card 3D carousel */}
        <div className="lg:hidden">
          <div className="flex items-center gap-0 sm:gap-2 max-w-[420px] mx-auto" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            <button onClick={prevPage}
              className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-[#0f639e]/20 dark:border-[#0f639e]/40 bg-transparent flex items-center justify-center text-[#0f639e] dark:text-[#3292ca] hover:bg-gradient-to-br hover:from-[#0f639e] hover:to-[#3292ca] hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-[#0f639e]/20 hover:scale-110 active:scale-90 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={animating}>
              <span className="font-mono font-black text-xl leading-none">{'<'}</span>
            </button>
            <div className="overflow-hidden rounded-2xl flex-1" style={{ perspective: '1200px' }}>
              <div className="relative mx-auto min-h-[420px] sm:min-h-[440px]">
                {visibleItems.map((service, idx) => {
                  const isActive = idx === page;
                  const isPrev = idx === (page === 0 ? visibleItems.length - 1 : page - 1);
                  const isNext = idx === (page === visibleItems.length - 1 ? 0 : page + 1);
                  let transform = '', opacity = 0, zIndex = 0, filter = 'blur(0px)';
                  let pointerEvents: React.CSSProperties['pointerEvents'] = 'none';
                  if (isActive) { transform = 'translateX(0) rotateY(0deg) scale(1) translateZ(0)'; opacity = 1; zIndex = 3; pointerEvents = 'auto'; filter = 'blur(0px)'; }
                  else if (isPrev) { transform = 'translateX(-150%) rotateY(-45deg) scale(0.35) translateZ(-350px)'; opacity = animating ? 0.4 : 0; zIndex = 1; filter = animating ? 'blur(6px)' : 'blur(0px)'; }
                  else if (isNext) { transform = 'translateX(150%) rotateY(45deg) scale(0.35) translateZ(-350px)'; opacity = animating ? 0.4 : 0; zIndex = 1; filter = animating ? 'blur(6px)' : 'blur(0px)'; }
                  else { opacity = 0; zIndex = 0; }
                  return (
                    <div key={service.id}
                      className="w-full h-full transition-all duration-700 ease-out absolute inset-0"
                      style={{ transform, opacity, zIndex, pointerEvents, filter, transformStyle: 'preserve-3d', backfaceVisibility: 'hidden', position: isActive ? 'relative' as const : 'absolute' as const }}>
                      {renderCard(service)}
                    </div>
                  );
                })}
              </div>
            </div>
            <button onClick={nextPage}
              className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-[#0f639e]/20 dark:border-[#0f639e]/40 bg-transparent flex items-center justify-center text-[#0f639e] dark:text-[#3292ca] hover:bg-gradient-to-br hover:from-[#0f639e] hover:to-[#3292ca] hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-[#0f639e]/20 hover:scale-110 active:scale-90 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={animating}>
              <span className="font-mono font-black text-xl leading-none">{'>'}</span>
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
              className="shrink-0 mt-[15%] w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-[#0f639e]/20 dark:border-[#0f639e]/40 bg-transparent flex items-center justify-center text-[#0f639e] dark:text-[#3292ca] hover:bg-gradient-to-br hover:from-[#0f639e] hover:to-[#3292ca] hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-[#0f639e]/20 hover:scale-110 active:scale-90 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={animating || totalPages <= 1}>
              <span className="font-mono font-black text-2xl leading-none">{'<'}</span>
            </button>
            <div className="flex-1 overflow-hidden rounded-2xl" style={{ perspective: '1200px' }}>
              <div key={page} className="grid grid-cols-3 gap-5"
                style={{ transformStyle: 'preserve-3d' }}>
                {visiblePage.map((service, idx) => (
                  <div key={service.id}
                    className="transition-all duration-700 ease-out"
                    style={{
                      opacity: animating ? 0 : 1,
                      transform: animating ? 'translateY(40px) rotateX(8deg) scale(0.9)' : 'translateY(0) rotateX(0deg) scale(1)',
                      filter: animating ? 'blur(2px)' : 'blur(0px)',
                      transitionDelay: `${idx * 100}ms`,
                    }}>
                    {renderCard(service, idx)}
                  </div>
                ))}
              </div>
            </div>
            <button onClick={nextPage}
              className="shrink-0 mt-[15%] w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-[#0f639e]/20 dark:border-[#0f639e]/40 bg-transparent flex items-center justify-center text-[#0f639e] dark:text-[#3292ca] hover:bg-gradient-to-br hover:from-[#0f639e] hover:to-[#3292ca] hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-[#0f639e]/20 hover:scale-110 active:scale-90 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={animating || totalPages <= 1}>
              <span className="font-mono font-black text-2xl leading-none">{'>'}</span>
            </button>
          </div>
          <div className="mt-6">{renderDots()}</div>
          <div className="text-center mt-3">
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">{page + 1} / {totalPages}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrgaProServicesSection;
