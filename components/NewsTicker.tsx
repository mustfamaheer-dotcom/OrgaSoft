import React from 'react';
import { useSite } from '../context/SiteContext';

const NewsTicker: React.FC = () => {
  const { siteData, lang, isRTL } = useSite();

  if (!siteData.ticker?.enabled) return null;

  const text = siteData.ticker.text[lang];
  if (!text) return null;

  // Modern CSS-based smooth scrolling ticker
  // No <marquee> tag used.
  // Direction adapts dynamically: 
  // - LTR goes right-to-left
  // - RTL goes left-to-right
  return (
    <div className="w-full bg-[#df4d21] text-white overflow-hidden flex items-center border-b border-white/20 h-8 sm:h-10 relative">
      <div 
        className={`whitespace-nowrap inline-block hover:[animation-play-state:paused] ${isRTL ? 'animate-marquee' : 'animate-marquee-rtl'}`}
        style={{
          paddingLeft: '100%',
          '--marquee-duration': '30s',
        } as React.CSSProperties}
      >
        <span className="text-xs sm:text-sm font-bold tracking-wider">{text}</span>
      </div>
    </div>
  );
};

export default NewsTicker;
