import React from 'react';
import { Image as ImageIcon, Database, AlertTriangle } from 'lucide-react';
import type { SiteContent } from '../../types';
import { SectionHeader, CloudImageUploader } from './FormComponents';

const fieldBase = 'w-full px-5 py-4 rounded-xl border-2 border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#131d31] text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-[#0f639e] outline-none transition-all duration-200';

const labelStyle = 'block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] px-1';

const GeneralTab: React.FC<{
  data: SiteContent;
  setData: (d: SiteContent | ((prev: SiteContent) => SiteContent)) => void;
  isRTL: boolean;
  onResetDatabase?: () => void;
}> = ({ data, setData, isRTL, onResetDatabase }) => {
  const [showResetConfirm, setShowResetConfirm] = React.useState(false);

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

      <div className="pt-6 border-t border-slate-100 dark:border-[#1e293b]">
        <div className="flex items-center gap-3 mb-6 px-1">
          <Database className="w-5 h-5 text-[#0f639e]" />
          <h3 className="text-lg font-black text-[#0f639e] dark:text-white">{isRTL ? 'قاعدة البيانات' : 'Database'}</h3>
        </div>

        <div className="p-5 rounded-2xl border-2 border-amber-200 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-500/5">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                {isRTL ? 'إعادة تعيين قاعدة البيانات' : 'Reset Database'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {isRTL
                  ? 'سيتم حفظ جميع الإعدادات الافتراضية في Firestore. استخدم هذا الخيار إذا كانت قاعدة البيانات ناقصة أو تواجه مشاكل في الحفظ.'
                  : 'Writes the complete default data structure to Firestore. Use this if the database is missing fields or saves are failing.'}
              </p>
            </div>
          </div>

          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-white rounded-xl font-bold text-xs hover:bg-amber-600 hover:shadow-lg transition-all"
            >
              <Database className="w-4 h-4" />
              {isRTL ? 'إعادة تعيين قاعدة البيانات' : 'Reset Database'}
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => { onResetDatabase?.(); setShowResetConfirm(false); }}
                className="flex items-center gap-2 px-4 py-2.5 bg-rose-500 text-white rounded-xl font-bold text-xs hover:bg-rose-600 hover:shadow-lg transition-all"
              >
                {isRTL ? 'نعم، إعادة التعيين' : 'Yes, Reset'}
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2.5 bg-slate-100 dark:bg-[#1e293b] text-slate-600 dark:text-slate-400 rounded-xl font-bold text-xs hover:bg-slate-200 dark:hover:bg-[#1a2744] transition-all"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneralTab;
