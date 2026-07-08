import React, { useState, useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import { Megaphone } from 'lucide-react';

const speedMap: Record<string, string> = { slow: '30s', normal: '20s', fast: '12s' };

const displayText = (obj: Record<string, string> | undefined, lang: string): string => {
  if (!obj) return '';
  return obj[lang]?.trim() || obj[lang === 'ar' ? 'en' : 'ar']?.trim() || '';
};

const AnnouncementBar: React.FC = () => {
  const { lang, siteData, isRTL } = useSite();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY < 150);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const announcement = siteData?.announcement;
  if (!announcement) return null;
  if (!announcement.enabled) return null;
  const messages = announcement.messages || [];
  const validMessages = messages.filter(m => m && displayText(m.text, lang));
  if (validMessages.length === 0) return null;

  const duration = speedMap[announcement.speed] || '20s';

  const renderMessage = (m: typeof validMessages[0], idx: number) => {
    const text = displayText(m.text, lang);
    const btnLabel = displayText(m.linkLabel, lang);
    return (
      <span key={idx} className="inline-flex items-center gap-3 px-6 shrink-0">
        <Megaphone className="w-4 h-4 text-white/80 shrink-0" />
        <span className="font-bold text-sm text-white whitespace-nowrap">{text}</span>
        {m.linkUrl && btnLabel && (
          <a
            href={m.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-xs font-bold text-white transition-colors shrink-0 border border-white/10"
          >
            {btnLabel}
          </a>
        )}
        <span className="w-1.5 h-1.5 bg-white/30 rounded-full shrink-0" />
      </span>
    );
  };

  return (
    <div className="mt-14 sm:mt-16">
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isVisible ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div
          className="relative w-full bg-gradient-to-r from-[#0f639e] via-[#1a6fa8] to-[#3292ca] dark:from-[#0a3d5c] dark:via-[#0f5a82] dark:to-[#1a6fa8] border-b border-white/10"
        >
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.06)_50%,transparent_100%)] pointer-events-none" />
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#0f639e] dark:from-[#0a3d5c] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#3292ca] dark:from-[#1a6fa8] to-transparent z-10 pointer-events-none" />

          <div className="relative flex items-center py-4 overflow-hidden">
            <div
              dir={isRTL ? 'rtl' : 'ltr'}
              className={`flex items-center shrink-0 ${isRTL ? 'animate-marquee' : 'animate-marquee-rtl'}`}
              style={{ '--marquee-duration': duration } as React.CSSProperties}
            >
              {validMessages.map((m, i) => renderMessage(m, i))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
