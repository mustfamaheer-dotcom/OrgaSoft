import React, { useState } from 'react';
import { Handshake, Plus, Trash2, Edit3, ChevronLeft, ChevronRight, ArrowUp, ArrowDown, FolderOpen, Tag, X, Building2, Store, Hospital, GraduationCap, DollarSign, Building, Factory, ShoppingBag, Stethoscope, Globe, Truck, HardHat, UtensilsCrossed, TreePalm, Laptop, Users, HeartHandshake, Landmark, Car, FlaskConical, Crown, Gem, Award, Rocket, Ship, Plane, Bus, Tractor, ConciergeBell, Wine, Shirt, Watch, Armchair, Gamepad2, Music, Palette, Camera, Newspaper, BookOpen, HeartPulse, Leaf, Sun, Zap, Droplets, Mountain, Compass, Map, Radio, Cpu, HardDrive, Printer, Scan, Baby, Dog, Syringe, Bike, Pill, Smartphone, Monitor } from 'lucide-react';
import type { Partner, PartnerCategory, SiteContent } from '../../types';
import { SectionHeader, FieldGroup, CloudImageUploader, InputField } from './FormComponents';

const CATEGORY_ICONS: { value: string; component: React.ComponentType<{ className?: string }> }[] = [
  { value: 'building2', component: Building2 },
  { value: 'store', component: Store },
  { value: 'hospital', component: Hospital },
  { value: 'graduation-cap', component: GraduationCap },
  { value: 'dollar-sign', component: DollarSign },
  { value: 'building', component: Building },
  { value: 'factory', component: Factory },
  { value: 'shopping-bag', component: ShoppingBag },
  { value: 'stethoscope', component: Stethoscope },
  { value: 'globe', component: Globe },
  { value: 'truck', component: Truck },
  { value: 'hard-hat', component: HardHat },
  { value: 'utensils-crossed', component: UtensilsCrossed },
  { value: 'tree-palm', component: TreePalm },
  { value: 'laptop', component: Laptop },
  { value: 'users', component: Users },
  { value: 'heart-handshake', component: HeartHandshake },
  { value: 'landmark', component: Landmark },
  { value: 'car', component: Car },
  { value: 'flask-conical', component: FlaskConical },
  { value: 'crown', component: Crown },
  { value: 'gem', component: Gem },
  { value: 'award', component: Award },
  { value: 'rocket', component: Rocket },
  { value: 'ship', component: Ship },
  { value: 'plane', component: Plane },
  { value: 'bus', component: Bus },
  { value: 'tractor', component: Tractor },
  { value: 'concierge-bell', component: ConciergeBell },
  { value: 'wine', component: Wine },
  { value: 'shirt', component: Shirt },
  { value: 'watch', component: Watch },
  { value: 'armchair', component: Armchair },
  { value: 'gamepad-2', component: Gamepad2 },
  { value: 'music', component: Music },
  { value: 'palette', component: Palette },
  { value: 'camera', component: Camera },
  { value: 'newspaper', component: Newspaper },
  { value: 'book-open', component: BookOpen },
  { value: 'heart-pulse', component: HeartPulse },
  { value: 'leaf', component: Leaf },
  { value: 'sun', component: Sun },
  { value: 'zap', component: Zap },
  { value: 'droplets', component: Droplets },
  { value: 'mountain', component: Mountain },
  { value: 'compass', component: Compass },
  { value: 'map', component: Map },
  { value: 'radio', component: Radio },
  { value: 'cpu', component: Cpu },
  { value: 'hard-drive', component: HardDrive },
  { value: 'printer', component: Printer },
  { value: 'scan', component: Scan },
  { value: 'baby', component: Baby },
  { value: 'dog', component: Dog },
  { value: 'syringe', component: Syringe },
  { value: 'bike', component: Bike },
  { value: 'pill', component: Pill },
  { value: 'smartphone', component: Smartphone },
  { value: 'monitor', component: Monitor },
];

const iconLookup: Record<string, React.ComponentType<{ className?: string }>> = {};
CATEGORY_ICONS.forEach(ic => { iconLookup[ic.value] = ic.component; });

interface PartnersTabProps {
  data: SiteContent;
  setData: (d: SiteContent) => void;
  isRTL: boolean;
  lang: 'en' | 'ar';
  setDeleteTarget: (t: { id: string; type: 'product' | 'partner' | 'partnerCategory' } | null) => void;
}

const PartnersTab: React.FC<PartnersTabProps> = ({ data, setData, isRTL, lang, setDeleteTarget }) => {
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [activeCatId, setActiveCatId] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<PartnerCategory | null>(null);

  const categories = data.partnerCategories || [];
  const activePartners = activeCatId
    ? data.partners.filter(p => p.categoryId === activeCatId)
    : data.partners.filter(p => !p.categoryId);

  const movePartner = (idx: number, direction: -1 | 1) => {
    const newPartners = [...data.partners];
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= newPartners.length) return;
    [newPartners[idx], newPartners[targetIdx]] = [newPartners[targetIdx], newPartners[idx]];
    setData({ ...data, partners: newPartners });
  };

  if (editingCategory) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-[#0f639e] dark:text-white">{isRTL ? 'تعديل التصنيف' : 'Edit Category'}</h3>
          <button onClick={() => setEditingCategory(null)} className="flex items-center gap-2 text-slate-400 font-black text-[11px] uppercase tracking-widest hover:text-[#0f639e] transition-colors">
            {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />} {isRTL ? 'العودة' : 'BACK'}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Category Name (EN)" value={editingCategory.name.en} onChange={v => setEditingCategory({ ...editingCategory, name: { ...editingCategory.name, en: v } })} />
          <InputField label="Category Name (AR)" value={editingCategory.name.ar} onChange={v => setEditingCategory({ ...editingCategory, name: { ...editingCategory.name, ar: v } })} />
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-3 block">{isRTL ? 'أيقونة التصنيف' : 'CATEGORY ICON'}</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_ICONS.map(ic => {
              const Icon = ic.component;
              const selected = editingCategory.icon === ic.value;
              return (
                <button key={ic.value} onClick={() => setEditingCategory({ ...editingCategory, icon: ic.value })}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${selected ? 'bg-[#0f639e] text-white shadow-md shadow-[#0f639e]/30 scale-110' : 'bg-slate-100 dark:bg-[#1a2744] text-slate-400 hover:bg-[#0f639e]/10 hover:text-[#0f639e]'}`}>
                  <Icon className="w-5 h-5" />
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={() => {
            const exists = categories.some(c => c.id === editingCategory.id);
            const updatedCategories = exists ? categories.map(c => c.id === editingCategory.id ? editingCategory : c) : [...categories, editingCategory];
            setData({ ...data, partnerCategories: updatedCategories });
            setEditingCategory(null);
          }} className="px-10 py-3.5 bg-gradient-to-r from-[#0f639e] to-[#3292ca] text-white font-black rounded-xl uppercase text-xs tracking-widest shadow-lg hover:-translate-y-0.5 transition-all">Save</button>
          <button onClick={() => setEditingCategory(null)} className="px-8 py-3.5 bg-slate-100 dark:bg-[#1a2744] text-slate-400 font-black rounded-xl uppercase text-xs tracking-widest transition-all">Discard</button>
        </div>
      </div>
    );
  }

  if (!editingPartner) {
    return (
      <div className="space-y-10">
        <SectionHeader icon={Handshake} title={isRTL ? 'الشركاء والعملاء' : 'Partner Network'} subtitle="Manage categories and partners" isRTL={isRTL} />

        <div className="p-5 bg-white dark:bg-[#131d31] rounded-xl border border-slate-100 dark:border-[#1e293b]">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-black text-[#0f639e] dark:text-white flex items-center gap-2"><FolderOpen className="w-4 h-4 text-[#df4d21]" />{isRTL ? 'التصنيفات' : 'Categories'}</h4>
            <button onClick={() => {
              const newCat: PartnerCategory = { id: `cat-${Date.now()}`, name: { en: 'New Category', ar: 'تصنيف جديد' }, icon: 'building2' };
              setEditingCategory(newCat);
            }} className="flex items-center gap-2 px-4 py-2 bg-[#0f639e]/10 text-[#0f639e] rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#0f639e] hover:text-white transition-all">
              <Plus className="w-3.5 h-3.5" />{isRTL ? 'إضافة تصنيف' : 'ADD'}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => { setActiveCatId(null); setEditingPartner(null); }}
              className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${!activeCatId ? 'bg-[#0f639e] text-white shadow-md' : 'bg-slate-100 dark:bg-[#1a2744] text-slate-500 hover:bg-[#0f639e]/10 hover:text-[#0f639e]'}`}>
              {isRTL ? 'بدون تصنيف' : 'Uncategorized'} ({data.partners.filter(p => !p.categoryId).length})
            </button>
            {categories.map(cat => {
              const CatIcon = iconLookup[cat.icon || ''] || Tag;
              return (
                <div key={cat.id} className={`group flex items-center gap-1 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer ${activeCatId === cat.id ? 'bg-[#0f639e] text-white shadow-md' : 'bg-slate-100 dark:bg-[#1a2744] text-slate-500 hover:bg-[#0f639e]/10 hover:text-[#0f639e]'}`}
                  onClick={() => setActiveCatId(cat.id)}>
                  <CatIcon className="w-3 h-3" />
                  <span>{cat.name[lang]}</span>
                  <span className="text-[9px] opacity-60">({data.partners.filter(p => p.categoryId === cat.id).length})</span>
                  <button onClick={e => { e.stopPropagation(); setEditingCategory(cat); }} className="ml-1 w-5 h-5 bg-white/20 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-white/40 transition-all"><Edit3 className="w-2.5 h-2.5" /></button>
                  <button onClick={e => { e.stopPropagation(); setDeleteTarget({ id: cat.id, type: 'partnerCategory' }); }} className="w-5 h-5 bg-white/20 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-rose-400 transition-all"><X className="w-2.5 h-2.5" /></button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h4 className="text-sm font-black text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Handshake className="w-4 h-4 text-[#df4d21]" />
            {activeCatId ? (categories.find(c => c.id === activeCatId)?.name[lang] || 'Category') : (isRTL ? 'بدون تصنيف' : 'Uncategorized')}
            <span className="text-[10px] font-bold text-slate-400">({activePartners.length})</span>
          </h4>
          <button onClick={() => {
            const newP: Partner = { id: `part-${Date.now()}`, name: { en: 'New Partner', ar: 'شريك جديد' }, location: { en: 'Global', ar: 'عالمي' }, categoryId: activeCatId || undefined };
            setEditingPartner(newP);
          }} className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#0f639e] to-[#3292ca] text-white rounded-xl font-bold text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-md">
            <Plus className="w-4 h-4" /> {isRTL ? 'إضافة شريك' : 'Add Partner'}
          </button>
        </div>

        <div className="space-y-3">
          {activePartners.length === 0 ? (
            <div className="text-center py-10 text-slate-400 font-medium">{isRTL ? 'لا يوجد شركاء في هذا التصنيف' : 'No partners in this category'}</div>
          ) : (
            activePartners.map((p, idx) => (
              <div key={p.id} className="p-5 bg-white dark:bg-[#131d31] rounded-xl border border-slate-100 dark:border-[#1e293b] flex items-center justify-between group hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <button onClick={() => movePartner(idx, -1)} disabled={idx === 0}
                      className="w-7 h-5 bg-slate-100 dark:bg-[#1a2744] text-slate-400 rounded-lg flex items-center justify-center hover:bg-[#0f639e] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button onClick={() => movePartner(idx, 1)} disabled={idx === activePartners.length - 1}
                      className="w-7 h-5 bg-slate-100 dark:bg-[#1a2744] text-slate-400 rounded-lg flex items-center justify-center hover:bg-[#0f639e] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>
                  {p.logo && <img src={p.logo} alt="" className="w-12 h-12 rounded-xl object-cover border-2 border-slate-100 dark:border-[#1e293b]" loading="lazy" />}
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
            ))
          )}
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
      <div>
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 block">{isRTL ? 'التصنيف' : 'CATEGORY'}</label>
        <select value={editingPartner.categoryId || ''} onChange={e => setEditingPartner({ ...editingPartner, categoryId: e.target.value || undefined })}
          className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#131d31] text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-[#0f639e] outline-none transition-all">
          <option value="">{isRTL ? 'بدون تصنيف' : 'Uncategorized'}</option>
          {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name[lang]}</option>)}
        </select>
      </div>
      <CloudImageUploader label="Partner Logo" value={editingPartner.logo || ''} onChange={url => setEditingPartner({ ...editingPartner, logo: url })} />
      <div className="pt-6 flex gap-4">
        <button onClick={() => {
          const exists = data.partners.some(x => x.id === editingPartner.id);
          const updatedPartners = exists ? data.partners.map(x => x.id === editingPartner.id ? editingPartner : x) : [...data.partners, editingPartner];
          setData({ ...data, partners: updatedPartners });
          setEditingPartner(null);
        }}
          className="px-10 py-3.5 bg-gradient-to-r from-[#0f639e] to-[#3292ca] text-white font-black rounded-xl uppercase text-xs tracking-widest shadow-lg hover:-translate-y-0.5 transition-all">Update Partner</button>
        <button onClick={() => setEditingPartner(null)} className="px-8 py-3.5 bg-slate-100 dark:bg-[#1a2744] text-slate-400 font-black rounded-xl uppercase text-xs tracking-widest transition-all">Discard</button>
      </div>
    </div>
  );
};

export default PartnersTab;
