import React, { useState } from 'react';
import { Database, Plus, Trash2, Edit3, ChevronLeft, ChevronRight, CheckCircle2, Eye, EyeOff, PhoneCall, Settings2, ArrowUp, ArrowDown, Search, Handshake } from 'lucide-react';
import type { Product, SiteContent } from '../../types';
import { SectionHeader, FieldGroup, CloudImageUploader, InputField } from './FormComponents';

interface ProductsTabProps {
  data: SiteContent;
  setData: (d: SiteContent) => void;
  isRTL: boolean;
  lang: 'en' | 'ar';
  setDeleteTarget: (t: { id: string; type: 'product' | 'partner' } | null) => void;
}

const fieldBase = 'w-full px-5 py-4 rounded-xl border-2 border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#131d31] text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-[#0f639e] outline-none transition-all duration-200';

const sectionTitle = 'text-lg font-black text-[#0f639e] dark:text-white tracking-tight flex items-center gap-3';

const ProductsTab: React.FC<ProductsTabProps> = ({ data, setData, isRTL, lang, setDeleteTarget }) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const moveProduct = (idx: number, direction: -1 | 1) => {
    const newProducts = [...data.products];
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= newProducts.length) return;
    [newProducts[idx], newProducts[targetIdx]] = [newProducts[targetIdx], newProducts[idx]];
    setData({ ...data, products: newProducts });
  };

  const filteredProducts = data.products.filter(p => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return p.name.en.toLowerCase().includes(q) || p.name.ar.includes(q) || p.id.toLowerCase().includes(q);
  });

  if (!editingProduct) {
    return (
      <div className="space-y-10">
        <SectionHeader icon={Database} title={isRTL ? 'المنظومة التقنية' : 'System Stack'} subtitle="Manage your software ecosystem" isRTL={isRTL} />
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder={isRTL ? 'بحث عن منتج...' : 'Search products...'}
              className="w-full pl-12 pr-5 py-4 rounded-xl border-2 border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#131d31] text-slate-900 dark:text-white font-medium text-sm outline-none focus:border-[#0f639e] transition-all" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
          <button onClick={() => {
            const newP: Product = {
              id: `p-${Date.now()}`, name: { en: 'New', ar: 'جديد' },
              description: { en: '', ar: '' }, longDescription: { en: '', ar: '' },
              features: { en: [], ar: [] }, specs: [], image: '', icon: 'database', showOnHome: true,
            };
            setData({ ...data, products: [...data.products, newP] });
            setEditingProduct(newP);
          }} className="w-full py-8 border-2 border-dashed border-slate-200 dark:border-[#1e293b] rounded-xl text-slate-300 font-black uppercase tracking-widest text-sm hover:border-[#0f639e] hover:text-[#0f639e] transition-all flex items-center justify-center gap-3">
            <Plus className="w-5 h-5" /> {isRTL ? 'إضافة منظومة تقنية جديدة' : 'Add New Logic Node'}
          </button>
          <div className="space-y-3">
            {filteredProducts.map((p, idx) => {
              const realIdx = data.products.findIndex(x => x.id === p.id);
              return (
              <div key={p.id} className={`p-4 rounded-xl border flex items-center justify-between group hover:shadow-md hover:-translate-y-0.5 transition-all ${
                p.showOnHome !== false
                  ? 'bg-white dark:bg-[#131d31] border-slate-100 dark:border-[#1e293b]'
                  : 'bg-slate-50/50 dark:bg-[#1a2744]/50 border-slate-200/50 dark:border-[#1e293b] opacity-70'
              }`}>
                <div className="flex items-center gap-5">
                  <div className="flex flex-col gap-1">
                    <button onClick={() => moveProduct(realIdx, -1)} disabled={realIdx === 0}
                      className="w-8 h-6 bg-slate-100 dark:bg-[#1a2744] text-slate-400 rounded-lg flex items-center justify-center hover:bg-[#0f639e] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => moveProduct(realIdx, 1)} disabled={realIdx === data.products.length - 1}
                      className="w-8 h-6 bg-slate-100 dark:bg-[#1a2744] text-slate-400 rounded-lg flex items-center justify-center hover:bg-[#0f639e] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingProduct(p)} className="w-10 h-10 bg-slate-100 dark:bg-[#1a2744] text-[#0f639e] dark:text-[#3292ca] rounded-xl flex items-center justify-center hover:bg-[#0f639e] hover:text-white transition-all"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteTarget({ id: p.id, type: 'product' })} className="w-10 h-10 bg-slate-100 dark:bg-[#1a2744] text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  {p.image ? (
                    <img src={p.image} className="w-16 h-16 rounded-xl object-cover border-2 border-slate-100 dark:border-[#1e293b]" loading="lazy" />
                  ) : (
                    <div className="w-16 h-16 bg-slate-100 dark:bg-[#1a2744] rounded-xl border-2 border-slate-200 dark:border-[#1e293b]" />
                  )}
                  <div className={`flex flex-col ${isRTL ? 'text-right' : 'text-left'}`}>
                    <div className="flex items-center gap-3">
                      <h4 className="text-lg font-black text-[#0f639e] dark:text-white leading-none">{p.name[lang]}</h4>
                      {p.showOnHome !== false ? (
                        <div className="px-2.5 py-1 bg-[#df4d21]/10 rounded-full flex items-center gap-1">
                          <Eye className="w-3 h-3 text-[#df4d21]" />
                          <span className="text-[7px] font-black text-[#df4d21] uppercase tracking-widest">HOME</span>
                        </div>
                      ) : (
                        <div className="px-2.5 py-1 bg-slate-100 dark:bg-[#1a2744] rounded-full flex items-center gap-1">
                          <EyeOff className="w-3 h-3 text-slate-400" />
                          <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">HIDDEN</span>
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{p.id}</span>
                    {p.productPartners && p.productPartners.length > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 mt-1 bg-[#0f639e]/10 rounded-full text-[8px] font-black text-[#0f639e] uppercase tracking-widest w-fit">
                        <Handshake className="w-2.5 h-2.5" /> {p.productPartners.length}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const addSpec = () => {
    setEditingProduct({
      ...editingProduct,
      specs: [...(editingProduct.specs || []), { key: { en: '', ar: '' }, value: { en: '', ar: '' } }]
    });
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-black text-[#0f639e] dark:text-white">{isRTL ? 'تعديل المنتج' : 'Edit Product'}</h3>
        <button onClick={() => setEditingProduct(null)} className="flex items-center gap-2 text-slate-400 font-black text-[11px] uppercase tracking-widest hover:text-[#0f639e] transition-colors">
          {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />} {isRTL ? 'العودة للقائمة' : 'BACK TO LIST'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FieldGroup label={isRTL ? 'اسم النظام' : 'PRODUCT NAME'} valueEn={editingProduct.name.en} valueAr={editingProduct.name.ar} onUpdateEn={v => setEditingProduct({ ...editingProduct, name: { ...editingProduct.name, en: v } })} onUpdateAr={v => setEditingProduct({ ...editingProduct, name: { ...editingProduct.name, ar: v } })} isRTL={isRTL} />
        <FieldGroup label={isRTL ? 'نبذة مختصرة' : 'BRIEF PITCH'} valueEn={editingProduct.description.en} valueAr={editingProduct.description.ar} onUpdateEn={v => setEditingProduct({ ...editingProduct, description: { ...editingProduct.description, en: v } })} onUpdateAr={v => setEditingProduct({ ...editingProduct, description: { ...editingProduct.description, ar: v } })} isTextArea isRTL={isRTL} />
      </div>

      <FieldGroup label="Detailed Overview" valueEn={editingProduct.longDescription.en} valueAr={editingProduct.longDescription.ar} onUpdateEn={v => setEditingProduct({ ...editingProduct, longDescription: { ...editingProduct.longDescription, en: v } })} onUpdateAr={v => setEditingProduct({ ...editingProduct, longDescription: { ...editingProduct.longDescription, ar: v } })} isTextArea textAreaHeight="h-64" isRTL={isRTL} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CloudImageUploader label="Card Image (shown in product card)" value={editingProduct.image} onChange={url => setEditingProduct({ ...editingProduct, image: url })} />
        <CloudImageUploader label="EN Banner Image" value={editingProduct.bannerImage?.en || ''} onChange={url => setEditingProduct({ ...editingProduct, bannerImage: { ...editingProduct.bannerImage, en: url } })} />
        <CloudImageUploader label="AR Banner Image" value={editingProduct.bannerImage?.ar || ''} onChange={url => setEditingProduct({ ...editingProduct, bannerImage: { ...editingProduct.bannerImage, ar: url } })} />
      </div>

      <div className="pt-6 border-t border-slate-100 dark:border-[#1e293b] space-y-6">
        <h4 className={sectionTitle}>
          <CheckCircle2 className="w-5 h-5 text-[#0f639e]" /> {isRTL ? 'الميزات' : 'Features'}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">EN Features (one per line)</label>
            <textarea value={(editingProduct.features?.en || []).join('\n')} onChange={e => setEditingProduct({ ...editingProduct, features: { ...editingProduct.features, en: e.target.value.split('\n').filter(Boolean) } })}
              className={`${fieldBase} min-h-[120px] resize-y`} placeholder="24/7 Support" />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">AR Features (واحدة لكل سطر)</label>
            <textarea value={(editingProduct.features?.ar || []).join('\n')} onChange={e => setEditingProduct({ ...editingProduct, features: { ...editingProduct.features, ar: e.target.value.split('\n').filter(Boolean) } })}
              className={`${fieldBase} min-h-[120px] resize-y text-right`} placeholder="دعم 24/7" dir="rtl" />
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 dark:border-[#1e293b] space-y-6">
        <h4 className={sectionTitle}>
          <CheckCircle2 className="w-5 h-5 text-[#df4d21]" /> {isRTL ? 'المميزات الجوهرية' : 'Key Features'}
        </h4>
        <button onClick={addSpec}
          className="flex items-center gap-2 px-5 py-3 bg-slate-100 dark:bg-[#1a2744] text-[#0f639e] dark:text-[#3292ca] rounded-xl font-bold text-sm hover:bg-[#0f639e] hover:text-white dark:hover:bg-[#0f639e] dark:hover:text-white transition-all">
          <Plus className="w-4 h-4" /> {isRTL ? 'إضافة مواصفة' : 'Add Spec'}
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(editingProduct.specs || []).map((spec, idx) => (
            <div key={idx} className="p-5 bg-slate-50/50 dark:bg-[#1a2744]/50 rounded-xl border-2 border-slate-200 dark:border-[#1e293b] space-y-4 relative group">
              <button onClick={() => {
                const updated = [...(editingProduct.specs || [])]; updated.splice(idx, 1);
                setEditingProduct({ ...editingProduct, specs: updated });
              }} className="absolute top-3 right-3 w-7 h-7 bg-rose-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">EN Key</label>
                  <input value={spec.key.en} onChange={e => { const u = [...(editingProduct.specs || [])]; u[idx] = { ...u[idx], key: { ...u[idx].key, en: e.target.value } }; setEditingProduct({ ...editingProduct, specs: u }); }}
                    className={fieldBase} placeholder="Processor" />
                </div>
                <div className="space-y-1">
                  <label className="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">AR Key</label>
                  <input value={spec.key.ar} onChange={e => { const u = [...(editingProduct.specs || [])]; u[idx] = { ...u[idx], key: { ...u[idx].key, ar: e.target.value } }; setEditingProduct({ ...editingProduct, specs: u }); }}
                    className={`${fieldBase} text-right`} placeholder="المعالج" dir="rtl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">EN Value</label>
                  <input value={spec.value.en} onChange={e => { const u = [...(editingProduct.specs || [])]; u[idx] = { ...u[idx], value: { ...u[idx].value, en: e.target.value } }; setEditingProduct({ ...editingProduct, specs: u }); }}
                    className={fieldBase} placeholder="2.4 GHz" />
                </div>
                <div className="space-y-1">
                  <label className="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">AR Value</label>
                  <input value={spec.value.ar} onChange={e => { const u = [...(editingProduct.specs || [])]; u[idx] = { ...u[idx], value: { ...u[idx].value, ar: e.target.value } }; setEditingProduct({ ...editingProduct, specs: u }); }}
                    className={`${fieldBase} text-right`} placeholder="2.4 جيجاهرتز" dir="rtl" />
                </div>
              </div>
            </div>
          ))}
        </div>
        {(!editingProduct.specs || editingProduct.specs.length === 0) && (
          <div className="text-center py-8 text-slate-400 font-medium">
            {isRTL ? 'لا توجد مواصفات. أضف مواصفة للبدء.' : 'No specs yet. Click "Add Spec" to start.'}
          </div>
        )}
      </div>

      <div className="pt-6 border-t border-slate-100 dark:border-[#1e293b] space-y-6">
        <div className="flex items-center justify-between">
          <h4 className={sectionTitle}>
            <CheckCircle2 className="w-5 h-5 text-[#df4d21]" /> {isRTL ? 'المميزات الجوهرية' : 'Key Features'}
          </h4>
          <button onClick={() => {
            setEditingProduct({ ...editingProduct, keyFeatures: [...(editingProduct.keyFeatures || []), { id: `kf-${Date.now()}`, text: { en: 'New Feature', ar: 'ميزة جديدة' } }] });
          }} className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#df4d21] to-[#c43d18] text-white rounded-xl font-bold text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-md">
            <Plus className="w-4 h-4" /> <span>{isRTL ? 'إضافة ميزة' : 'Add Feature'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(editingProduct.keyFeatures || []).map((feature, index) => (
            <div key={feature.id} className="p-5 bg-slate-50/50 dark:bg-[#1a2744]/50 rounded-xl border-2 border-slate-200 dark:border-[#1e293b] space-y-3 relative group">
              <button onClick={() => setEditingProduct({ ...editingProduct, keyFeatures: editingProduct.keyFeatures?.filter(f => f.id !== feature.id) })}
                className="absolute top-3 right-3 w-7 h-7 bg-rose-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">EN</label>
                <input value={feature.text.en} onChange={e => {
                  const u = [...(editingProduct.keyFeatures || [])]; u[index] = { ...u[index], text: { ...u[index].text, en: e.target.value } };
                  setEditingProduct({ ...editingProduct, keyFeatures: u });
                }} className={fieldBase} placeholder="Feature in English" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">AR</label>
                <input value={feature.text.ar} onChange={e => {
                  const u = [...(editingProduct.keyFeatures || [])]; u[index] = { ...u[index], text: { ...u[index].text, ar: e.target.value } };
                  setEditingProduct({ ...editingProduct, keyFeatures: u });
                }} className={`${fieldBase} text-right`} placeholder="الميزة بالعربية" dir="rtl" />
              </div>
            </div>
          ))}
        </div>

        {(!editingProduct.keyFeatures || editingProduct.keyFeatures.length === 0) && (
          <div className="text-center py-8 text-slate-400 font-medium">
            {isRTL ? 'لا توجد مميزات. اضغط "إضافة ميزة" للبدء.' : 'No features yet. Click "Add Feature" to start.'}
          </div>
        )}
      </div>

      <div className="pt-6 border-t border-slate-100 dark:border-[#1e293b] space-y-6">
        <h4 className={sectionTitle}>
          <PhoneCall className="w-5 h-5 text-[#df4d21]" /> {isRTL ? 'إعدادات الدعم والظهور' : 'Support & Visibility'}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputField label={isRTL ? 'رقم الدعم الفني' : 'Support Phone Number'} value={editingProduct.supportPhone || ''} onChange={v => setEditingProduct({ ...editingProduct, supportPhone: v })} />
          <InputField label={isRTL ? 'رابط النسخة التجريبية' : 'Application Demo URL'} value={editingProduct.demoUrl || ''} onChange={v => setEditingProduct({ ...editingProduct, demoUrl: v })} />
        </div>
        <div className="p-5 bg-slate-50/50 dark:bg-[#1a2744]/50 rounded-xl border-2 border-slate-200 dark:border-[#1e293b]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${editingProduct.showOnHome !== false ? 'bg-[#df4d21]/20 text-[#df4d21]' : 'bg-slate-200 dark:bg-[#1e293b] text-slate-400'}`}>
                {editingProduct.showOnHome !== false ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </div>
              <div>
                <h5 className="text-base font-black text-[#0f639e] dark:text-white">{isRTL ? 'الظهور في الصفحة الرئيسية' : 'Show on Home Page'}</h5>
                <p className="text-xs font-medium text-slate-400">
                  {editingProduct.showOnHome !== false
                    ? (isRTL ? 'يظهر في قسم "المجموعة البرمجية" بالصفحة الرئيسية' : 'Appears in "The Software Stack" section on the home page')
                    : (isRTL ? 'مخفي من الصفحة الرئيسية (يظهر فقط في قائمة جميع التطبيقات)' : 'Hidden from home page (appears only in All Applications')}
                </p>
              </div>
            </div>
            <button onClick={() => setEditingProduct({ ...editingProduct, showOnHome: !editingProduct.showOnHome })}
              className={`relative w-16 h-8 rounded-full transition-all duration-300 ${editingProduct.showOnHome !== false ? 'bg-[#df4d21]' : 'bg-slate-300 dark:bg-[#1e293b]'}`}>
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${editingProduct.showOnHome !== false ? (isRTL ? 'right-1' : 'left-1') : (isRTL ? 'right-9' : 'left-9')}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 dark:border-[#1e293b] space-y-6">
        <div className="flex items-center justify-between">
          <h4 className={sectionTitle}>
            <Handshake className="w-5 h-5 text-[#0f639e]" /> {isRTL ? 'شركاء النجاح' : 'Success Partners'}
          </h4>
          <button onClick={() => {
            setEditingProduct({ ...editingProduct, productPartners: [...(editingProduct.productPartners || []), { id: `pp-${Date.now()}`, name: { en: 'New Partner', ar: 'شريك جديد' }, logo: '', link: '' }] });
          }} className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#0f639e] to-[#3292ca] text-white rounded-xl font-bold text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-md">
            <Plus className="w-4 h-4" /> <span>{isRTL ? 'إضافة شريك' : 'Add Partner'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(editingProduct.productPartners || []).map((partner, index) => (
            <div key={partner.id} className="p-5 bg-slate-50/50 dark:bg-[#1a2744]/50 rounded-xl border-2 border-slate-200 dark:border-[#1e293b] space-y-3 relative group">
              <div className="absolute top-3 right-3 flex items-center gap-1">
                <button disabled={index === 0} onClick={() => { const u = [...(editingProduct.productPartners || [])]; [u[index - 1], u[index]] = [u[index], u[index - 1]]; setEditingProduct({ ...editingProduct, productPartners: u }); }}
                  className="w-7 h-7 bg-slate-200 dark:bg-[#1e293b] text-slate-400 rounded-lg flex items-center justify-center hover:bg-[#0f639e] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button disabled={index === (editingProduct.productPartners || []).length - 1} onClick={() => { const u = [...(editingProduct.productPartners || [])]; [u[index + 1], u[index]] = [u[index], u[index + 1]]; setEditingProduct({ ...editingProduct, productPartners: u }); }}
                  className="w-7 h-7 bg-slate-200 dark:bg-[#1e293b] text-slate-400 rounded-lg flex items-center justify-center hover:bg-[#0f639e] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setEditingProduct({ ...editingProduct, productPartners: editingProduct.productPartners?.filter(p => p.id !== partner.id) })}
                  className="w-7 h-7 bg-rose-500 text-white rounded-lg flex items-center justify-center hover:bg-rose-600 transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">EN Name</label>
                  <input value={partner.name.en} onChange={e => {
                    const u = [...(editingProduct.productPartners || [])]; u[index] = { ...u[index], name: { ...u[index].name, en: e.target.value } };
                    setEditingProduct({ ...editingProduct, productPartners: u });
                  }} className={fieldBase} placeholder="Partner Name" />
                </div>
                <div className="space-y-1">
                  <label className="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">AR Name</label>
                  <input value={partner.name.ar} onChange={e => {
                    const u = [...(editingProduct.productPartners || [])]; u[index] = { ...u[index], name: { ...u[index].name, ar: e.target.value } };
                    setEditingProduct({ ...editingProduct, productPartners: u });
                  }} className={`${fieldBase} text-right`} placeholder="اسم الشريك" dir="rtl" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{isRTL ? 'شعار الشريك (رابط)' : 'Partner Logo (URL or ImageKit)'}</label>
                <input value={partner.logo || ''} onChange={e => {
                  const u = [...(editingProduct.productPartners || [])]; u[index] = { ...u[index], logo: e.target.value };
                  setEditingProduct({ ...editingProduct, productPartners: u });
                }} className={fieldBase} placeholder="https://ik.imagekit.io/... or https://example.com" />
              </div>
            </div>
          ))}
        </div>

        {(!editingProduct.productPartners || editingProduct.productPartners.length === 0) && (
          <div className="text-center py-8 text-slate-400 font-medium">
            {isRTL ? 'لا يوجد شركاء نجاح لهذا المنتج. أضف شريكاً للبدء.' : 'No success partners for this product. Click "Add Partner" to start.'}
          </div>
        )}
      </div>

      <div className="pt-6 flex gap-4">
        <button onClick={() => { setData({ ...data, products: data.products.map(x => x.id === editingProduct.id ? editingProduct : x) }); setEditingProduct(null); }}
          className="px-10 py-3.5 bg-gradient-to-r from-[#0f639e] to-[#3292ca] text-white font-black rounded-xl uppercase text-xs tracking-widest shadow-lg hover:-translate-y-0.5 transition-all">Update Node</button>
        <button onClick={() => setEditingProduct(null)} className="px-8 py-3.5 bg-slate-100 dark:bg-[#1a2744] text-slate-400 font-black rounded-xl uppercase text-xs tracking-widest transition-all">Discard</button>
      </div>
    </div>
  );
};

export default ProductsTab;
