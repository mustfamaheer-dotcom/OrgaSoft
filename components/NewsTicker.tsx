import React from 'react';
import { useSite } from '../context/SiteContext';

const NewsTicker: React.FC = () => {
  const { siteData, lang, isRTL } = useSite();

  const ticker = siteData.ticker;
  if (!ticker?.enabled) return null;

  const text = ticker.text[lang];
  if (!text) return null;

  const bgColor = ticker.bgColor || '#df4d21';
  const textColor = ticker.textColor || '#ffffff';
  const speed = ticker.speed || 40;

  return (
    <div className="w-full overflow-hidden flex items-center border-b border-white/20 h-8 sm:h-10 relative" style={{ backgroundColor: bgColor, color: textColor }}>
      <style>
        {`
          @keyframes seamless-ltr-to-r {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          @keyframes seamless-rtl-to-l {
            0% { transform: translateX(50%); }
            100% { transform: translateX(0); }
          }
          .animate-seamless-ltr-to-r { animation: seamless-ltr-to-r ${speed}s linear infinite; }
          .animate-seamless-rtl-to-l { animation: seamless-rtl-to-l ${speed}s linear infinite; }
        `}
      </style>
      <div className={`flex items-center h-full whitespace-nowrap w-max hover:[animation-play-state:paused] ${isRTL ? 'animate-seamless-ltr-to-r' : 'animate-seamless-rtl-to-l'}`}>
        {[...Array(16)].map((_, i) => (
          <div key={i} className="flex items-center h-full">
            <span className="text-xs sm:text-sm font-bold tracking-wider px-8 pt-1.5">{text}</span>
            <span className="text-xs opacity-50 px-2 pt-1.5">•</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsTicker;
