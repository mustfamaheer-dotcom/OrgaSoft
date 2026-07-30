import React, { useState } from 'react';
import { Rocket, Plus, Trash2, Edit3, ChevronLeft, ChevronRight, CheckCircle2, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';
import type { OrgaProService, SiteContent } from '../../types';
import { SectionHeader, FieldGroup, CloudImageUploader } from './FormComponents';

interface OrgaProServicesTabProps {
  data: SiteContent;
  setData: (d: SiteContent) => void;
  isRTL: boolean;
  lang: 'en' | 'ar';
  setDeleteTarget: (t: { id: string; type: 'product' | 'partner' | 'service' | 'orgaProService' } | null) => void;
}

const fieldBase = 'w-full px-5 py-4 rounded-xl border-2 border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#131d31] text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-[#0f639e] outline-none transition-all duration-200';

const sectionTitle = 'text-lg font-black text-[#0f639e] dark:text-white tracking-tight flex items-center gap-3';

const OrgaProServicesTab: React.FC<OrgaProServicesTabProps> = ({ data, setData, isRTL, lang, setDeleteTarget }) => {
  const [editingItem, setEditingItem] = useState<OrgaProService | null>(null);

  const section = data.orgaProServices;
  const setSection = (updated: typeof section) => setData({ ...data, orgaProServices: updated });

  const moveItem = (idx: number, direction: -1 | 1) => {
    const items = [...section.items];
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    [items[idx], items[targetIdx]] = [items[targetIdx], items[idx]];
    setSection({ ...section, items });
  };

  if (!editingItem) {
    return (
      <div className="space-y-10">
        <SectionHeader icon={Rocket} title={isRTL ? 'أورجا المتطورة' : 'Orga Pro Services'} subtitle="Premium service offerings" isRTL={isRTL} />

        <div className="p-5 bg-slate-50/50 dark:bg-[#1a2744]/50 rounded-xl border-2 border-slate-200 dark:border-[#1e293b]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${section.enabled ? 'bg-[#df4d21]/20 text-[#df4d21]' : 'bg-slate-200 dark:bg-[#1e293b] text-slate-400'}`}>
                {section.enabled ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </div>
              <div>
                <h5 className="text-base font-black text-[#0f639e] dark:text-white">{isRTL ? 'إظهار القسم' : 'Show Orga Pro Section'}</h5>
                <p className="text-xs font-medium text-slate-400">
                  {section.enabled
                    ? (isRTL ? 'القسم ظاهر في الصفحة الرئيسية' : 'Section is visible on the home page')
                    : (isRTL ? 'مخفي من الصفحة الرئيسية' : 'Hidden from the home page')}
                </p>
              </div>
            </div>
            <button onClick={() => setSection({ ...section, enabled: !section.enabled })}
              className={`relative w-16 h-8 rounded-full transition-all duration-300 ${section.enabled ? 'bg-[#df4d21]' : 'bg-slate-300 dark:bg-[#1e293b]'}`}>
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${section.enabled ? (isRTL ? 'right-1' : 'left-1') : (isRTL ? 'right-9' : 'left-9')}`} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">EN Section Title</label>
            <input value={section.title.en} onChange={e => setSection({ ...section, title: { ...section.title, en: e.target.value } })}
              className={fieldBase} placeholder="Orga Pro Services" />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">AR Section Title</label>
            <input value={section.title.ar} onChange={e => setSection({ ...section, title: { ...section.title, ar: e.target.value } })}
              className={`${fieldBase} text-right`} placeholder="أورجا المتطورة" dir="rtl" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">EN Section Subtitle</label>
          <input value={section.subtitle.en} onChange={e => setSection({ ...section, subtitle: { ...section.subtitle, en: e.target.value } })}
            className={fieldBase} placeholder="Premium solutions we provide" />
        </div>
        <div className="space-y-1">
          <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">AR Section Subtitle</label>
          <input value={section.subtitle.ar} onChange={e => setSection({ ...section, subtitle: { ...section.subtitle, ar: e.target.value } })}
            className={`${fieldBase} text-right`} placeholder="الحلول المتطورة التي نقدمها" dir="rtl" />
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-[#1e293b] space-y-6">
          <div className="flex items-center justify-between">
            <h4 className={sectionTitle}>
              <CheckCircle2 className="w-5 h-5 text-[#0f639e]" /> {isRTL ? 'الخدمات' : 'Services'}
            </h4>
            <button onClick={() => {
              const newItem: OrgaProService = { id: `ops-${Date.now()}`, name: { en: 'New Service', ar: 'خدمة جديدة' }, description: { en: '', ar: '' }, enabled: true };
              setSection({ ...section, items: [...section.items, newItem] });
              setEditingItem(newItem);
            }} className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#0f639e] to-[#3292ca] text-white rounded-xl font-bold text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-md">
              <Plus className="w-4 h-4" /> {isRTL ? 'إضافة خدمة' : 'Add New Service'}
            </button>
          </div>

          <div className="space-y-3">
            {section.items.map((s, idx) => (
              <div key={s.id} className="p-4 rounded-xl border bg-white dark:bg-[#131d31] border-slate-100 dark:border-[#1e293b] flex items-center justify-between group hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="flex items-center gap-5">
                  <div className="flex flex-col gap-1">
                    <button onClick={() => moveItem(idx, -1)} disabled={idx === 0}
                      className="w-8 h-6 bg-slate-100 dark:bg-[#1a2744] text-slate-400 rounded-lg flex items-center justify-center hover:bg-[#0f639e] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => moveItem(idx, 1)} disabled={idx === section.items.length - 1}
                      className="w-8 h-6 bg-slate-100 dark:bg-[#1a2744] text-slate-400 rounded-lg flex items-center justify-center hover:bg-[#0f639e] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingItem(s)} className="w-10 h-10 bg-slate-100 dark:bg-[#1a2744] text-[#0f639e] dark:text-[#3292ca] rounded-xl flex items-center justify-center hover:bg-[#0f639e] hover:text-white transition-all"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteTarget({ id: s.id, type: 'orgaProService' })} className="w-10 h-10 bg-slate-100 dark:bg-[#1a2744] text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className={`flex flex-col ${isRTL ? 'text-right' : 'text-left'}`}>
                    <div className="flex items-center gap-3">
                      <h4 className="text-lg font-black text-[#0f639e] dark:text-white leading-none">{s.name[lang]}</h4>
                      {s.enabled ? (
                        <div className="px-2.5 py-1 bg-emerald-500/10 rounded-full flex items-center gap-1">
                          <span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest">ACTIVE</span>
                        </div>
                      ) : (
                        <div className="px-2.5 py-1 bg-slate-100 dark:bg-[#1a2744] rounded-full flex items-center gap-1">
                          <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">DISABLED</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {section.items.length === 0 && (
            <div className="text-center py-8 text-slate-400 font-medium">
              {isRTL ? 'لا توجد خدمات. أضف خدمة للبدء.' : 'No services yet. Click "Add New Service" to start.'}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-black text-[#0f639e] dark:text-white">{isRTL ? 'تعديل الخدمة' : 'Edit Service'}</h3>
        <button onClick={() => setEditingItem(null)} className="flex items-center gap-2 text-slate-400 font-black text-[11px] uppercase tracking-widest hover:text-[#0f639e] transition-colors">
          {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />} {isRTL ? 'العودة للقائمة' : 'BACK TO LIST'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FieldGroup label={isRTL ? 'اسم الخدمة' : 'SERVICE NAME'} valueEn={editingItem.name.en} valueAr={editingItem.name.ar} onUpdateEn={v => setEditingItem({ ...editingItem, name: { ...editingItem.name, en: v } })} onUpdateAr={v => setEditingItem({ ...editingItem, name: { ...editingItem.name, ar: v } })} isRTL={isRTL} />
        <FieldGroup label={isRTL ? 'وصف الخدمة' : 'SERVICE DESCRIPTION'} valueEn={editingItem.description.en} valueAr={editingItem.description.ar} onUpdateEn={v => setEditingItem({ ...editingItem, description: { ...editingItem.description, en: v } })} onUpdateAr={v => setEditingItem({ ...editingItem, description: { ...editingItem.description, ar: v } })} isTextArea isRTL={isRTL} />
      </div>

      <CloudImageUploader label={isRTL ? 'صورة الخدمة' : 'Service Image'} value={editingItem.image || ''} onChange={url => setEditingItem({ ...editingItem, image: url })} />

      <div className="p-5 bg-slate-50/50 dark:bg-[#1a2744]/50 rounded-xl border-2 border-slate-200 dark:border-[#1e293b]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${editingItem.enabled ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-200 dark:bg-[#1e293b] text-slate-400'}`}>
              {editingItem.enabled ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </div>
            <div>
              <h5 className="text-base font-black text-[#0f639e] dark:text-white">{isRTL ? 'تفعيل الخدمة' : 'Enable Service'}</h5>
              <p className="text-xs font-medium text-slate-400">
                {editingItem.enabled
                  ? (isRTL ? 'الخدمة ظاهرة للزوار' : 'Service is visible to visitors')
                  : (isRTL ? 'الخدمة مخفية' : 'Service is hidden')}
              </p>
            </div>
          </div>
          <button onClick={() => setEditingItem({ ...editingItem, enabled: !editingItem.enabled })}
            className={`relative w-16 h-8 rounded-full transition-all duration-300 ${editingItem.enabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-[#1e293b]'}`}>
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${editingItem.enabled ? (isRTL ? 'right-1' : 'left-1') : (isRTL ? 'right-9' : 'left-9')}`} />
          </button>
        </div>
      </div>

      <div className="pt-6 flex gap-4">
        <button onClick={() => { setSection({ ...section, items: section.items.map(x => x.id === editingItem.id ? editingItem : x) }); setEditingItem(null); }}
          className="px-10 py-3.5 bg-gradient-to-r from-[#0f639e] to-[#3292ca] text-white font-black rounded-xl uppercase text-xs tracking-widest shadow-lg hover:-translate-y-0.5 transition-all">Update Service</button>
        <button onClick={() => setEditingItem(null)} className="px-8 py-3.5 bg-slate-100 dark:bg-[#1a2744] text-slate-400 font-black rounded-xl uppercase text-xs tracking-widest transition-all">Discard</button>
      </div>
    </div>
  );
};

export default OrgaProServicesTab;
