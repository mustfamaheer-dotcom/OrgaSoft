import React from 'react';
import { Globe, Star, Plus, Trash2 } from 'lucide-react';
import type { SiteContent } from '../../types';
import { SectionHeader, FieldGroup } from './FormComponents';

const ICON_OPTIONS = [
  { value: 'clock', label: 'Clock' },
  { value: 'users', label: 'Users' },
  { value: 'award', label: 'Award' },
  { value: 'activity', label: 'Activity' },
  { value: 'database', label: 'Database' },
];

const fieldBase = 'w-full px-5 py-4 rounded-xl border-2 border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#131d31] text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-[#0f639e] outline-none transition-all duration-200';

const HeroTab: React.FC<{ data: SiteContent; updateNestedField: (path: string, value: any) => void; isRTL: boolean }> = ({ data, updateNestedField, isRTL }) => {
  const stats = data.hero.stats || [];
  const updateStat = (idx: number, field: string, value: any) => {
    updateNestedField('hero.stats', stats.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };
  const updateStatLabel = (idx: number, lang: 'en' | 'ar', value: string) => {
    updateNestedField('hero.stats', stats.map((s, i) =>
      i === idx ? { ...s, label: { ...s.label, [lang]: value } } : s
    ));
  };
  const addStat = () => updateNestedField('hero.stats', [...stats, { value: '', label: { en: '', ar: '' }, icon: 'users' }]);
  const removeStat = (idx: number) => updateNestedField('hero.stats', stats.filter((_, i) => i !== idx));

  return (
    <div className="space-y-10">
      <SectionHeader icon={Globe} title={isRTL ? 'القسم الرئيسي' : 'Hero Interface'} subtitle="Edit main landing section content" isRTL={isRTL} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FieldGroup label="Hero Title" valueEn={data.hero.title.en} valueAr={data.hero.title.ar} onUpdateEn={v => updateNestedField('hero.title.en', v)} onUpdateAr={v => updateNestedField('hero.title.ar', v)} isTextArea isRTL={isRTL} />
        <FieldGroup label="Hero Subtitle" valueEn={data.hero.subtitle.en} valueAr={data.hero.subtitle.ar} onUpdateEn={v => updateNestedField('hero.subtitle.en', v)} onUpdateAr={v => updateNestedField('hero.subtitle.ar', v)} isTextArea isRTL={isRTL} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FieldGroup label="Glass Card Subtitle" valueEn={data.hero.cardSubtitle.en} valueAr={data.hero.cardSubtitle.ar} onUpdateEn={v => updateNestedField('hero.cardSubtitle.en', v)} onUpdateAr={v => updateNestedField('hero.cardSubtitle.ar', v)} isRTL={isRTL} />
      </div>
      <div className="pt-6 border-t border-slate-100 dark:border-[#1e293b]">
        <div className="flex items-center gap-3 mb-6 px-1">
          <Star className="w-5 h-5 text-[#0f639e]" />
          <h3 className="text-lg font-black text-[#0f639e] dark:text-white">{isRTL ? 'تقييم الهيرو' : 'Hero Rating'}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] px-1">{isRTL ? 'التقييم (من 5)' : 'Rating (out of 5)'}</label>
            <input type="number" min="0" max="5" step="0.1" value={data.hero.rating ?? 4.9}
              onChange={e => updateNestedField('hero.rating', parseFloat(e.target.value) || 4.9)}
              className={fieldBase} />
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 dark:border-[#1e293b]">
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-[#0f639e]" />
            <h3 className="text-lg font-black text-[#0f639e] dark:text-white">{isRTL ? 'إحصائيات الهيرو' : 'Hero Stats'}</h3>
          </div>
          <button onClick={addStat}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#0f639e] to-[#3292ca] text-white rounded-xl font-bold text-xs hover:shadow-lg hover:shadow-[#0f639e]/20 hover:-translate-y-0.5 transition-all">
            <Plus className="w-4 h-4" />
            {isRTL ? 'إضافة' : 'Add Stat'}
          </button>
        </div>
        {stats.length === 0 && (
          <p className="text-center text-slate-400 font-bold py-10">{isRTL ? 'لا توجد إحصائيات. أضف واحدة.' : 'No stats yet. Add one.'}</p>
        )}
        <div className="space-y-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="p-5 rounded-xl border-2 border-slate-100 dark:border-[#1e293b] bg-slate-50/50 dark:bg-[#1a2744]/50 relative group">
              <button onClick={() => removeStat(idx)}
                className="absolute -top-2.5 -right-2.5 w-7 h-7 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-600 shadow-lg">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{isRTL ? 'القيمة' : 'Value'}</label>
                  <input value={stat.value} onChange={e => updateStat(idx, 'value', e.target.value)}
                    className={fieldBase} placeholder="18+" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">EN Label</label>
                  <input value={stat.label.en} onChange={e => updateStatLabel(idx, 'en', e.target.value)}
                    className={fieldBase} placeholder="Years Exp." />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">AR Label</label>
                  <input value={stat.label.ar} onChange={e => updateStatLabel(idx, 'ar', e.target.value)}
                    className={`${fieldBase} text-right`} placeholder="سنوات خبرة" dir="rtl" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Icon</label>
                  <select value={stat.icon} onChange={e => updateStat(idx, 'icon', e.target.value)}
                    className={fieldBase}>
                    {ICON_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroTab;
