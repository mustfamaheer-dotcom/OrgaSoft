import React, { useCallback, useRef, useState } from 'react';
import { useSite } from '../context/SiteContext';
import { Code2, Server, Shield, Cloud, Network, Smartphone, Globe, Database, Settings, Headphones, MoveRight, MoveLeft, Image as ImageIcon } from 'lucide-react';
import type { ServiceIcon } from '../types';
import KitImage from './KitImage';

const ICON_MAP: Record<ServiceIcon, React.ComponentType<{ className?: string }>> = {
  code: Code2,
  server: Server,
  shield: Shield,
  cloud: Cloud,
  network: Network,
  smartphone: Smartphone,
  globe: Globe,
  database: Database,
  settings: Settings,
  headphones: Headphones,
};

const TiltCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
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
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
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

const ServicesSection: React.FC = () => {
  const { lang, siteData, isRTL } = useSite();
  const services = siteData.services;

  if (!services.enabled) return null;

  const visibleItems = services.items.filter(s => s.enabled);
  if (visibleItems.length === 0) return null;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      setScrollProgress(maxScroll > 0 ? (el.scrollLeft / maxScroll) * 100 : 0);
    };
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [visibleItems.length]);

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

        <div className="relative">
          <div ref={scrollRef}
            className="flex overflow-x-auto gap-4 sm:gap-6 pb-6 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {visibleItems.map((service) => {
              const IconComp = ICON_MAP[service.icon] || Code2;
              return (
                <div key={service.id} className="snap-start shrink-0 w-[85vw] sm:w-[380px]" style={{ scrollSnapAlign: 'start' }}>
                  <TiltCard className="group bg-white dark:bg-[#131d31] rounded-2xl overflow-hidden border border-slate-100 dark:border-[#1e293b] hover:border-[#0f639e]/30 hover:shadow-xl transition-all duration-300 h-full flex flex-col cursor-default active:scale-[0.98]">
                    <div className="tilt-inner flex flex-col h-full">
                      <div className="relative w-full aspect-[480/320] shrink-0 overflow-hidden bg-slate-100 dark:bg-[#1e293b]">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent z-10" />
                        {service.image ? (
                          <KitImage src={service.image} alt={service.name[lang]} className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700" width={480} height={320} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-16 h-16 text-slate-300 dark:text-slate-500" />
                          </div>
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
                </div>
              );
            })}
          </div>
          {scrollProgress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 dark:bg-[#1e293b] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#0f639e] to-[#df4d21] rounded-full transition-all duration-150" style={{ width: `${scrollProgress}%` }} />
            </div>
          )}
        </div>

        {visibleItems.length > 3 && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <button onClick={() => { const el = scrollRef.current; if (el) el.scrollBy({ left: -380, behavior: 'smooth' }); }}
              className="w-11 h-11 rounded-full bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] flex items-center justify-center text-[#0f639e] dark:text-white shadow-md hover:shadow-lg hover:scale-110 hover:border-[#df4d21]/50 active:scale-90 transition-all">
              {isRTL ? <MoveRight className="w-5 h-5" /> : <MoveLeft className="w-5 h-5" />}
            </button>
            <button onClick={() => { const el = scrollRef.current; if (el) el.scrollBy({ left: 380, behavior: 'smooth' }); }}
              className="w-11 h-11 rounded-full bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] flex items-center justify-center text-[#0f639e] dark:text-white shadow-md hover:shadow-lg hover:scale-110 hover:border-[#df4d21]/50 active:scale-90 transition-all">
              {isRTL ? <MoveLeft className="w-5 h-5" /> : <MoveRight className="w-5 h-5" />}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;