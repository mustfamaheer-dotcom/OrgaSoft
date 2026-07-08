import React from 'react';
import { useSite } from '../context/SiteContext';
import { Code2, Server, Shield, Cloud, Network, Smartphone, Globe, Database, Settings, Headphones } from 'lucide-react';
import type { ServiceIcon } from '../types';

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

const ServicesSection: React.FC = () => {
  const { lang, siteData, isRTL } = useSite();
  const services = siteData.services;

  if (!services.enabled) return null;

  const visibleItems = services.items.filter(s => s.enabled);
  if (visibleItems.length === 0) return null;

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {visibleItems.map((service) => {
            const IconComp = ICON_MAP[service.icon] || Code2;
            return (
              <div key={service.id}
                className="group bg-white dark:bg-[#131d31] rounded-2xl p-5 sm:p-6 border border-slate-100 dark:border-[#1e293b] hover:border-[#0f639e]/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer active:scale-[0.98]">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-[#0f639e]/10 dark:bg-[#0f639e]/20 rounded-xl flex items-center justify-center text-[#0f639e] dark:text-[#3292ca] mb-4 sm:mb-5 group-hover:bg-[#0f639e] group-hover:text-white transition-all`}>
                  <IconComp className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#0f639e] dark:text-white mb-2 sm:mb-3 group-hover:text-[#df4d21] transition-colors">{service.name[lang]}</h3>
                <p className="text-slate-600 dark:text-slate-400 font-medium text-xs sm:text-sm leading-relaxed">{service.description[lang]}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
