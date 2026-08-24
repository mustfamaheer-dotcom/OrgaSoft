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
          @keyframes scroll-arabic {
            0% { transform: translateX(0); }
            100% { transform: translateX(50%); }
          }
          @keyframes scroll-english {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-scroll-arabic { animation: scroll-arabic ${speed}s linear infinite; }
          .animate-scroll-english { animation: scroll-english ${speed}s linear infinite; }
        `}
      </style>
      <div className={`flex items-center h-full whitespace-nowrap w-max hover:[animation-play-state:paused] ${isRTL ? 'animate-scroll-arabic' : 'animate-scroll-english'}`}>
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
