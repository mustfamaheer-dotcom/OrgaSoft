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
      <style>
        {`
          @keyframes seamless-ltr {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes seamless-rtl {
            0% { transform: translateX(0); }
            100% { transform: translateX(50%); }
          }
          .animate-seamless-ltr { animation: seamless-ltr 40s linear infinite; }
          .animate-seamless-rtl { animation: seamless-rtl 40s linear infinite; }
        `}
      </style>
      <div className={`flex whitespace-nowrap w-max hover:[animation-play-state:paused] ${isRTL ? 'animate-seamless-rtl' : 'animate-seamless-ltr'}`}>
        {[...Array(16)].map((_, i) => (
          <div key={i} className="flex items-center">
            <span className="text-xs sm:text-sm font-bold tracking-wider px-8">{text}</span>
            <span className="text-xs opacity-50 px-2">•</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsTicker;
