import React, { useState } from 'react';
import { Cloud, Plus, Trash2, Edit3, ChevronLeft, ChevronRight, CheckCircle2, Eye, EyeOff, Code2, Server, Shield, Globe, Network, Smartphone, Database, Settings, Headphones, ArrowUp, ArrowDown } from 'lucide-react';
import type { Service, SiteContent, ServiceIcon } from '../../types';
import { SectionHeader, FieldGroup } from './FormComponents';

interface ServicesTabProps {
  data: SiteContent;
  setData: (d: SiteContent) => void;
  isRTL: boolean;
  lang: 'en' | 'ar';
  setDeleteTarget: (t: { id: string; type: 'product' | 'partner' | 'service' } | null) => void;
}

const fieldBase = 'w-full px-5 py-4 rounded-xl border-2 border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#131d31] text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-[#0f639e] outline-none transition-all duration-200';

const sectionTitle = 'text-lg font-black text-[#0f639e] dark:text-white tracking-tight flex items-center gap-3';

const SERVICE_ICONS: { value: ServiceIcon; icon: React.ReactNode; labelEn: string; labelAr: string }[] = [
  { value: 'code', icon: <Code2 className="w-6 h-6" />, labelEn: 'Development', labelAr: 'تطوير' },
  { value: 'server', icon: <Server className="w-6 h-6" />, labelEn: 'Server', labelAr: 'خوادم' },
  { value: 'shield', icon: <Shield className="w-6 h-6" />, labelEn: 'Security', labelAr: 'أمان' },
  { value: 'cloud', icon: <Cloud className="w-6 h-6" />, labelEn: 'Cloud', labelAr: 'سحابة' },
  { value: 'network', icon: <Network className="w-6 h-6" />, labelEn: 'Network', labelAr: 'شبكات' },
  { value: 'smartphone', icon: <Smartphone className="w-6 h-6" />, labelEn: 'Mobile', labelAr: 'جوال' },
  { value: 'globe', icon: <Globe className="w-6 h-6" />, labelEn: 'Web', labelAr: 'ويب' },
  { value: 'database', icon: <Database className="w-6 h-6" />, labelEn: 'Data', labelAr: 'بيانات' },
  { value: 'settings', icon: <Settings className="w-6 h-6" />, labelEn: 'Support', labelAr: 'دعم' },
  { value: 'headphones', icon: <Headphones className="w-6 h-6" />, labelEn: 'Consulting', labelAr: 'استشارات' },
];

const ServicesTab: React.FC<ServicesTabProps> = ({ data, setData, isRTL, lang, setDeleteTarget }) => {
  const [editingService, setEditingService] = useState<Service | null>(null);

  const services = data.services;
  const setServices = (updated: typeof services) => setData({ ...data, services: updated });

  const moveService = (idx: number, direction: -1 | 1) => {
    const items = [...services.items];
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    [items[idx], items[targetIdx]] = [items[targetIdx], items[idx]];
    setServices({ ...services, items });
  };

  if (!editingService) {
    return (
      <div className="space-y-10">
        <SectionHeader icon={Cloud} title={isRTL ? 'الخدمات التقنية' : 'IT Services'} subtitle="Manage your technology service offerings" isRTL={isRTL} />

        <div className="p-5 bg-slate-50/50 dark:bg-[#1a2744]/50 rounded-xl border-2 border-slate-200 dark:border-[#1e293b]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${services.enabled ? 'bg-[#df4d21]/20 text-[#df4d21]' : 'bg-slate-200 dark:bg-[#1e293b] text-slate-400'}`}>
                {services.enabled ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </div>
              <div>
                <h5 className="text-base font-black text-[#0f639e] dark:text-white">{isRTL ? 'إظهار قسم الخدمات' : 'Show Services Section'}</h5>
                <p className="text-xs font-medium text-slate-400">
                  {services.enabled
                    ? (isRTL ? 'قسم الخدمات ظاهر في الصفحة الرئيسية' : 'Services section is visible on the home page')
                    : (isRTL ? 'مخفي من الصفحة الرئيسية' : 'Hidden from the home page')}
                </p>
              </div>
            </div>
            <button onClick={() => setServices({ ...services, enabled: !services.enabled })}
              className={`relative w-16 h-8 rounded-full transition-all duration-300 ${services.enabled ? 'bg-[#df4d21]' : 'bg-slate-300 dark:bg-[#1e293b]'}`}>
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${services.enabled ? (isRTL ? 'right-1' : 'left-1') : (isRTL ? 'right-9' : 'left-9')}`} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">EN Section Title</label>
            <input value={services.title.en} onChange={e => setServices({ ...services, title: { ...services.title, en: e.target.value } })}
              className={fieldBase} placeholder="IT Services" />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">AR Section Title</label>
            <input value={services.title.ar} onChange={e => setServices({ ...services, title: { ...services.title, ar: e.target.value } })}
              className={`${fieldBase} text-right`} placeholder="الخدمات التقنية" dir="rtl" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">EN Section Subtitle</label>
          <input value={services.subtitle.en} onChange={e => setServices({ ...services, subtitle: { ...services.subtitle, en: e.target.value } })}
            className={fieldBase} placeholder="Technology solutions we provide" />
        </div>
        <div className="space-y-1">
          <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">AR Section Subtitle</label>
          <input value={services.subtitle.ar} onChange={e => setServices({ ...services, subtitle: { ...services.subtitle, ar: e.target.value } })}
            className={`${fieldBase} text-right`} placeholder="الحلول التقنية التي نقدمها" dir="rtl" />
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-[#1e293b] space-y-6">
          <div className="flex items-center justify-between">
            <h4 className={sectionTitle}>
              <CheckCircle2 className="w-5 h-5 text-[#0f639e]" /> {isRTL ? 'الخدمات' : 'Services'}
            </h4>
            <button onClick={() => {
              const newS: Service = { id: `s-${Date.now()}`, name: { en: 'New Service', ar: 'خدمة جديدة' }, description: { en: '', ar: '' }, icon: 'code', enabled: true };
              setServices({ ...services, items: [...services.items, newS] });
              setEditingService(newS);
            }} className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#0f639e] to-[#3292ca] text-white rounded-xl font-bold text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-md">
              <Plus className="w-4 h-4" /> {isRTL ? 'إضافة خدمة جديدة' : 'Add New Service'}
            </button>
          </div>

          <div className="space-y-3">
            {services.items.map((s, idx) => (
              <div key={s.id} className="p-4 rounded-xl border bg-white dark:bg-[#131d31] border-slate-100 dark:border-[#1e293b] flex items-center justify-between group hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="flex items-center gap-5">
                  <div className="flex flex-col gap-1">
                    <button onClick={() => moveService(idx, -1)} disabled={idx === 0}
                      className="w-8 h-6 bg-slate-100 dark:bg-[#1a2744] text-slate-400 rounded-lg flex items-center justify-center hover:bg-[#0f639e] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => moveService(idx, 1)} disabled={idx === services.items.length - 1}
                      className="w-8 h-6 bg-slate-100 dark:bg-[#1a2744] text-slate-400 rounded-lg flex items-center justify-center hover:bg-[#0f639e] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingService(s)} className="w-10 h-10 bg-slate-100 dark:bg-[#1a2744] text-[#0f639e] dark:text-[#3292ca] rounded-xl flex items-center justify-center hover:bg-[#0f639e] hover:text-white transition-all"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteTarget({ id: s.id, type: 'service' })} className="w-10 h-10 bg-slate-100 dark:bg-[#1a2744] text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
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

          {services.items.length === 0 && (
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
        <button onClick={() => setEditingService(null)} className="flex items-center gap-2 text-slate-400 font-black text-[11px] uppercase tracking-widest hover:text-[#0f639e] transition-colors">
          {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />} {isRTL ? 'العودة للقائمة' : 'BACK TO LIST'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FieldGroup label={isRTL ? 'اسم الخدمة' : 'SERVICE NAME'} valueEn={editingService.name.en} valueAr={editingService.name.ar} onUpdateEn={v => setEditingService({ ...editingService, name: { ...editingService.name, en: v } })} onUpdateAr={v => setEditingService({ ...editingService, name: { ...editingService.name, ar: v } })} isRTL={isRTL} />
        <FieldGroup label={isRTL ? 'وصف الخدمة' : 'SERVICE DESCRIPTION'} valueEn={editingService.description.en} valueAr={editingService.description.ar} onUpdateEn={v => setEditingService({ ...editingService, description: { ...editingService.description, en: v } })} onUpdateAr={v => setEditingService({ ...editingService, description: { ...editingService.description, ar: v } })} isTextArea isRTL={isRTL} />
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{isRTL ? 'أيقونة الخدمة' : 'Service Icon'}</label>
        <div className="flex flex-wrap gap-2">
          {SERVICE_ICONS.map((ic) => (
            <button key={ic.value} type="button" onClick={() => setEditingService({ ...editingService, icon: ic.value })}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all border-2 ${
                editingService.icon === ic.value
                  ? 'border-[#0f639e] bg-[#0f639e]/10 text-[#0f639e]'
                  : 'border-transparent bg-slate-100 dark:bg-[#1e293b] text-slate-400 hover:bg-[#0f639e]/10 hover:text-[#0f639e]'
              }`} title={isRTL ? ic.labelAr : ic.labelEn}>
              {ic.icon}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 bg-slate-50/50 dark:bg-[#1a2744]/50 rounded-xl border-2 border-slate-200 dark:border-[#1e293b]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${editingService.enabled ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-200 dark:bg-[#1e293b] text-slate-400'}`}>
              {editingService.enabled ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </div>
            <div>
              <h5 className="text-base font-black text-[#0f639e] dark:text-white">{isRTL ? 'تفعيل الخدمة' : 'Enable Service'}</h5>
              <p className="text-xs font-medium text-slate-400">
                {editingService.enabled
                  ? (isRTL ? 'الخدمة ظاهرة للزوار' : 'Service is visible to visitors')
                  : (isRTL ? 'الخدمة مخفية' : 'Service is hidden')}
              </p>
            </div>
          </div>
          <button onClick={() => setEditingService({ ...editingService, enabled: !editingService.enabled })}
            className={`relative w-16 h-8 rounded-full transition-all duration-300 ${editingService.enabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-[#1e293b]'}`}>
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${editingService.enabled ? (isRTL ? 'right-1' : 'left-1') : (isRTL ? 'right-9' : 'left-9')}`} />
          </button>
        </div>
      </div>

      <div className="pt-6 flex gap-4">
        <button onClick={() => { setServices({ ...services, items: services.items.map(x => x.id === editingService.id ? editingService : x) }); setEditingService(null); }}
          className="px-10 py-3.5 bg-gradient-to-r from-[#0f639e] to-[#3292ca] text-white font-black rounded-xl uppercase text-xs tracking-widest shadow-lg hover:-translate-y-0.5 transition-all">Update Service</button>
        <button onClick={() => setEditingService(null)} className="px-8 py-3.5 bg-slate-100 dark:bg-[#1a2744] text-slate-400 font-black rounded-xl uppercase text-xs tracking-widest transition-all">Discard</button>
      </div>
    </div>
  );
};

export default ServicesTab;
