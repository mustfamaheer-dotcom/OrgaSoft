import React from 'react';
import { Type } from 'lucide-react';
import type { SiteContent } from '../../types';
import { SectionHeader } from './FormComponents';

const fieldBase = 'w-full px-5 py-4 rounded-xl border-2 border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#131d31] text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-[#0f639e] outline-none transition-all duration-200';
const labelStyle = 'block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] px-1';

const TickerTab: React.FC<{
  data: SiteContent;
  setData: (d: SiteContent | ((prev: SiteContent) => SiteContent)) => void;
  isRTL: boolean;
}> = ({ data, setData, isRTL }) => {
  return (
    <div className="space-y-10">
      <SectionHeader icon={Type} title={isRTL ? 'الشريط الإخباري' : 'News Ticker'} subtitle="Manage the scrolling text banner below navigation" isRTL={isRTL} />
      <div className="space-y-6">
        <label className="flex items-center gap-3 cursor-pointer w-max">
          <input type="checkbox" checked={data.ticker?.enabled ?? true}
            onChange={e => setData(d => ({ ...d, ticker: { ...d.ticker!, enabled: e.target.checked } }))}
            className="w-5 h-5 rounded text-[#0f639e] focus:ring-[#0f639e]" />
          <span className="font-bold text-sm">{isRTL ? 'تفعيل الشريط' : 'Enable Ticker'}</span>
        </label>
        
        {(data.ticker?.enabled ?? true) && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className={labelStyle}>Ticker Text (English)</label>
                <textarea value={data.ticker?.text.en || ''} 
                  onChange={e => setData(d => ({ ...d, ticker: { ...d.ticker!, text: { ...d.ticker!.text, en: e.target.value } } }))}
                  className={`${fieldBase} min-h-[100px]`} placeholder="News text..." />
              </div>
              <div className="space-y-1.5">
                <label className={labelStyle}>Ticker Text (Arabic)</label>
                <textarea value={data.ticker?.text.ar || ''} 
                  onChange={e => setData(d => ({ ...d, ticker: { ...d.ticker!, text: { ...d.ticker!.text, ar: e.target.value } } }))}
                  className={`${fieldBase} text-right min-h-[100px]`} placeholder="النص..." dir="rtl" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              <div className="space-y-1.5">
                <label className={labelStyle}>Background Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={data.ticker?.bgColor || '#df4d21'}
                    onChange={e => setData(d => ({ ...d, ticker: { ...d.ticker!, text: d.ticker!.text, bgColor: e.target.value } }))}
                    className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-0 p-0" />
                  <input type="text" value={data.ticker?.bgColor || '#df4d21'}
                    onChange={e => setData(d => ({ ...d, ticker: { ...d.ticker!, text: d.ticker!.text, bgColor: e.target.value } }))}
                    className={fieldBase} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className={labelStyle}>Text Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={data.ticker?.textColor || '#ffffff'}
                    onChange={e => setData(d => ({ ...d, ticker: { ...d.ticker!, text: d.ticker!.text, textColor: e.target.value } }))}
                    className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-0 p-0" />
                  <input type="text" value={data.ticker?.textColor || '#ffffff'}
                    onChange={e => setData(d => ({ ...d, ticker: { ...d.ticker!, text: d.ticker!.text, textColor: e.target.value } }))}
                    className={fieldBase} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className={labelStyle}>Scroll Speed (seconds)</label>
                <input type="number" min="10" max="200" value={data.ticker?.speed || 40}
                  onChange={e => setData(d => ({ ...d, ticker: { ...d.ticker!, text: d.ticker!.text, speed: Number(e.target.value) } }))}
                  className={fieldBase} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TickerTab;
