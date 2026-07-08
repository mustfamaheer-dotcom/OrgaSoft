import React, { useState } from 'react';
import { Handshake, Plus, Trash2, Edit3, ChevronLeft, ChevronRight, ArrowUp, ArrowDown } from 'lucide-react';
import type { Partner, SiteContent } from '../../types';
import { SectionHeader, FieldGroup, CloudImageUploader } from './FormComponents';

interface PartnersTabProps {
  data: SiteContent;
  setData: (d: SiteContent) => void;
  isRTL: boolean;
  lang: 'en' | 'ar';
  setDeleteTarget: (t: { id: string; type: 'product' | 'partner' } | null) => void;
}

const PartnersTab: React.FC<PartnersTabProps> = ({ data, setData, isRTL, lang, setDeleteTarget }) => {
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);

  const movePartner = (idx: number, direction: -1 | 1) => {
    const newPartners = [...data.partners];
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= newPartners.length) return;
    [newPartners[idx], newPartners[targetIdx]] = [newPartners[targetIdx], newPartners[idx]];
    setData({ ...data, partners: newPartners });
  };

  if (!editingPartner) {
    return (
      <div className="space-y-10">
        <SectionHeader icon={Handshake} title={isRTL ? 'الشركاء والعملاء' : 'Partner Network'} subtitle="Manage your global network" isRTL={isRTL} />
        <div className="space-y-6">
          <button onClick={() => {
            const newP: Partner = { id: `part-${Date.now()}`, name: { en: 'New Partner', ar: 'شريك جديد' }, location: { en: 'Global', ar: 'عالمي' } };
            setData({ ...data, partners: [...data.partners, newP] });
            setEditingPartner(newP);
          }} className="w-full py-8 border-2 border-dashed border-slate-200 dark:border-[#1e293b] rounded-xl text-slate-300 font-black uppercase tracking-widest text-sm hover:border-[#0f639e] hover:text-[#0f639e] transition-all flex items-center justify-center gap-3">
            <Plus className="w-5 h-5" /> {isRTL ? 'إضافة شريك جديد' : 'Add New Partner'}
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.partners.map((p, idx) => (
              <div key={p.id} className="p-5 bg-white dark:bg-[#131d31] rounded-xl border border-slate-100 dark:border-[#1e293b] flex items-center justify-between group hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <button onClick={() => movePartner(idx, -1)} disabled={idx === 0}
                      className="w-7 h-5 bg-slate-100 dark:bg-[#1a2744] text-slate-400 rounded-lg flex items-center justify-center hover:bg-[#0f639e] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button onClick={() => movePartner(idx, 1)} disabled={idx === data.partners.length - 1}
                      className="w-7 h-5 bg-slate-100 dark:bg-[#1a2744] text-slate-400 rounded-lg flex items-center justify-center hover:bg-[#0f639e] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>
                  {p.logo && (
                    <img src={p.logo} alt="" className="w-12 h-12 rounded-xl object-cover border-2 border-slate-100 dark:border-[#1e293b]" loading="lazy" />
                  )}
                  <div className={`flex flex-col ${isRTL ? 'text-right' : 'text-left'}`}>
                    <h4 className="text-base font-black text-[#0f639e] dark:text-white leading-none mb-0.5">{p.name[lang]}</h4>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{p.location[lang]}</p>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => setEditingPartner(p)} className="w-10 h-10 bg-slate-100 dark:bg-[#1a2744] text-[#0f639e] dark:text-[#3292ca] rounded-xl flex items-center justify-center hover:bg-[#0f639e] hover:text-white transition-all"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => setDeleteTarget({ id: p.id, type: 'partner' })} className="w-10 h-10 bg-slate-100 dark:bg-[#1a2744] text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-black text-[#0f639e] dark:text-white">{isRTL ? 'تعديل الشريك' : 'Edit Partner'}</h3>
        <button onClick={() => setEditingPartner(null)} className="flex items-center gap-2 text-slate-400 font-black text-[11px] uppercase tracking-widest hover:text-[#0f639e] transition-colors">
          {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />} {isRTL ? 'العودة للقائمة' : 'BACK TO LIST'}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FieldGroup label={isRTL ? 'اسم الشريك' : 'PARTNER NAME'} valueEn={editingPartner.name.en} valueAr={editingPartner.name.ar} onUpdateEn={v => setEditingPartner({ ...editingPartner, name: { ...editingPartner.name, en: v } })} onUpdateAr={v => setEditingPartner({ ...editingPartner, name: { ...editingPartner.name, ar: v } })} isRTL={isRTL} />
        <FieldGroup label={isRTL ? 'الموقع الجغرافي' : 'GEOGRAPHIC LOCATION'} valueEn={editingPartner.location.en} valueAr={editingPartner.location.ar} onUpdateEn={v => setEditingPartner({ ...editingPartner, location: { ...editingPartner.location, en: v } })} onUpdateAr={v => setEditingPartner({ ...editingPartner, location: { ...editingPartner.location, ar: v } })} isRTL={isRTL} />
      </div>
      <CloudImageUploader label="Partner Logo" value={editingPartner.logo || ''} onChange={url => setEditingPartner({ ...editingPartner, logo: url })} />
      <div className="pt-6 flex gap-4">
        <button onClick={() => { setData({ ...data, partners: data.partners.map(x => x.id === editingPartner.id ? editingPartner : x) }); setEditingPartner(null); }}
          className="px-10 py-3.5 bg-gradient-to-r from-[#0f639e] to-[#3292ca] text-white font-black rounded-xl uppercase text-xs tracking-widest shadow-lg hover:-translate-y-0.5 transition-all">Update Partner</button>
        <button onClick={() => setEditingPartner(null)} className="px-8 py-3.5 bg-slate-100 dark:bg-[#1a2744] text-slate-400 font-black rounded-xl uppercase text-xs tracking-widest transition-all">Discard</button>
      </div>
    </div>
  );
};

export default PartnersTab;
