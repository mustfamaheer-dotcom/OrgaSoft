import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import type { SiteContent } from '../../types';
import { SectionHeader, CloudImageUploader } from './FormComponents';

const fieldBase = 'w-full px-5 py-4 rounded-xl border-2 border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#131d31] text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-[#0f639e] outline-none transition-all duration-200';

const labelStyle = 'block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] px-1';

const GeneralTab: React.FC<{
  data: SiteContent;
  setData: (d: SiteContent | ((prev: SiteContent) => SiteContent)) => void;
  isRTL: boolean;
}> = ({ data, setData, isRTL }) => {
  return (
    <div className="space-y-10">
      <SectionHeader icon={ImageIcon} title={isRTL ? 'الهوية البصرية' : 'Brand Identity'} subtitle="Manage visual branding and meta data" isRTL={isRTL} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className={labelStyle}>Logo Text (English)</label>
          <input value={data.logo.en} onChange={e => setData({ ...data, logo: { ...data.logo, en: e.target.value } })}
            className={fieldBase} placeholder="ORGA SOFT" />
        </div>
        <div className="space-y-1.5">
          <label className={labelStyle}>Logo Text (Arabic)</label>
          <input value={data.logo.ar} onChange={e => setData({ ...data, logo: { ...data.logo, ar: e.target.value } })}
            className={`${fieldBase} text-right`} placeholder="أورجا سوفت" dir="rtl" />
        </div>
        <CloudImageUploader label="Logo Image" value={data.logoImageUrl || ''} onChange={url => setData({...data, logoImageUrl: url})} />
        <CloudImageUploader label="Favicon (Browser Tab Icon)" value={data.favicon || ''} onChange={url => setData({...data, favicon: url})} />
      </div>
    </div>
  );
};

export default GeneralTab;
