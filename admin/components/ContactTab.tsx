import React, { useState } from 'react';
import { Map, Plus, Trash2, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Building2 } from 'lucide-react';
import type { SiteContent, Branch } from '../../types';
import { SectionHeader, InputField, FieldGroup, ToggleField } from './FormComponents';

interface ContactTabProps {
  data: SiteContent;
  updateNestedField: (path: string, value: any) => void;
  setData: (d: SiteContent) => void;
  isRTL: boolean;
}

const fieldBase = 'w-full px-5 py-4 rounded-xl border-2 border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#131d31] text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-[#0f639e] outline-none transition-all duration-200';

const sectionTitle = 'text-lg font-black text-[#0f639e] dark:text-white tracking-tight flex items-center gap-3';

const ContactTab: React.FC<ContactTabProps> = ({ data, updateNestedField, isRTL }) => {
  const [activeBranchId, setActiveBranchId] = useState<string | null>(null);

  const branches = data.contacts.branches || [];
  const activeBranch = activeBranchId ? branches.find(b => b.id === activeBranchId) : null;

  const setBranches = (updated: Branch[]) => {
    updateNestedField('contacts.branches', updated);
  };

  return (
    <div className="space-y-10">
      <SectionHeader icon={Map} title={isRTL ? 'روابط الاتصال' : 'Contact Hub'} subtitle="Support channels, branches, and physical locations" isRTL={isRTL} />

      <div className="pt-6 border-t border-slate-100 dark:border-[#1e293b] space-y-6">
        <div className="flex items-center justify-between">
          <h4 className={sectionTitle}>
            <Building2 className="w-5 h-5 text-[#df4d21]" /> {isRTL ? 'فروع الشركة' : 'Company Branches'}
          </h4>
          <div className="flex items-center gap-2">
            {activeBranch && (
              <button onClick={() => setActiveBranchId(null)}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-[#1a2744] text-slate-400 font-black text-[11px] uppercase tracking-widest rounded-xl hover:text-[#0f639e] transition-all">
                {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />} {isRTL ? 'القائمة' : 'LIST'}
              </button>
            )}
            <button onClick={() => {
              const newBranch: Branch = {
                id: `b-${Date.now()}`,
                name: { en: 'New Branch', ar: 'فرع جديد' },
                address: { en: '', ar: '' },
                mapEmbedUrl: '',
                phoneSupport: '',
                phoneAdmin: '',
                email: '',
                whatsapp: '',
              };
              setBranches([...branches, newBranch]);
              setActiveBranchId(newBranch.id);
            }} className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#0f639e] to-[#3292ca] text-white rounded-xl font-bold text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-md">
              <Plus className="w-4 h-4" /> {isRTL ? 'إضافة فرع' : 'Add Branch'}
            </button>
          </div>
        </div>

        {activeBranch ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label={isRTL ? 'اسم الفرع (إنجليزي)' : 'Branch Name (EN)'} value={activeBranch.name.en} onChange={v => {
                setBranches(branches.map(b => b.id === activeBranch.id ? { ...b, name: { ...b.name, en: v } } : b));
              }} />
              <InputField label={isRTL ? 'اسم الفرع (عربي)' : 'Branch Name (AR)'} value={activeBranch.name.ar} onChange={v => {
                setBranches(branches.map(b => b.id === activeBranch.id ? { ...b, name: { ...b.name, ar: v } } : b));
              }} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Support Hotline" value={activeBranch.phoneSupport} onChange={v => {
                setBranches(branches.map(b => b.id === activeBranch.id ? { ...b, phoneSupport: v } : b));
              }} />
              <InputField label="Admin Line" value={activeBranch.phoneAdmin} onChange={v => {
                setBranches(branches.map(b => b.id === activeBranch.id ? { ...b, phoneAdmin: v } : b));
              }} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Official Email" value={activeBranch.email} onChange={v => {
                setBranches(branches.map(b => b.id === activeBranch.id ? { ...b, email: v } : b));
              }} />
              <InputField label="WhatsApp Number" value={activeBranch.whatsapp} onChange={v => {
                setBranches(branches.map(b => b.id === activeBranch.id ? { ...b, whatsapp: v } : b));
              }} />
            </div>
            <InputField label="Map Embed URL" placeholder="https://www.google.com/maps/embed?pb=!1m18..." value={activeBranch.mapEmbedUrl} onChange={v => {
              setBranches(branches.map(b => b.id === activeBranch.id ? { ...b, mapEmbedUrl: v } : b));
            }} />
            <FieldGroup label="Physical Address" valueEn={activeBranch.address.en} valueAr={activeBranch.address.ar} onUpdateEn={v => {
              setBranches(branches.map(b => b.id === activeBranch.id ? { ...b, address: { ...b.address, en: v } } : b));
            }} onUpdateAr={v => {
              setBranches(branches.map(b => b.id === activeBranch.id ? { ...b, address: { ...b.address, ar: v } } : b));
            }} isTextArea isRTL={isRTL} />
            <button onClick={() => {
              setBranches(branches.filter(b => b.id !== activeBranch.id));
              setActiveBranchId(null);
            }} className="flex items-center gap-2 px-5 py-3 bg-rose-500/10 text-rose-500 rounded-xl font-bold text-sm hover:bg-rose-500 hover:text-white transition-all">
              <Trash2 className="w-4 h-4" /> {isRTL ? 'حذف الفرع' : 'Delete Branch'}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {branches.length === 0 ? (
              <div className="text-center py-8 text-slate-400 font-medium">
                {isRTL ? 'لا توجد فروع. أضف فرعاً للبدء.' : 'No branches yet. Click "Add Branch" to start.'}
              </div>
            ) : (
              branches.map((branch, idx) => (
                <div key={branch.id} onClick={() => setActiveBranchId(branch.id)}
                  className="p-4 rounded-xl border bg-white dark:bg-[#131d31] border-slate-100 dark:border-[#1e293b] flex items-center justify-between group hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#df4d21]/10 rounded-xl flex items-center justify-center text-[#df4d21]">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-[#0f639e] dark:text-white">{branch.name[isRTL ? 'ar' : 'en']}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{branch.phoneSupport || branch.email || (isRTL ? 'لا توجد بيانات' : 'No data')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button disabled={idx === 0} onClick={(e) => { e.stopPropagation(); const a = [...branches]; [a[idx - 1], a[idx]] = [a[idx], a[idx - 1]]; setBranches(a); }}
                      className="w-7 h-7 bg-slate-100 dark:bg-[#1a2744] text-slate-400 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-[#0f639e] hover:text-white disabled:opacity-0 disabled:pointer-events-none">
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button disabled={idx === branches.length - 1} onClick={(e) => { e.stopPropagation(); const a = [...branches]; [a[idx + 1], a[idx]] = [a[idx], a[idx + 1]]; setBranches(a); }}
                      className="w-7 h-7 bg-slate-100 dark:bg-[#1a2744] text-slate-400 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-[#0f639e] hover:text-white disabled:opacity-0 disabled:pointer-events-none">
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setBranches(branches.filter(b => b.id !== branch.id)); }}
                      className="w-9 h-9 bg-slate-100 dark:bg-[#1a2744] text-rose-500 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="pt-6 border-t border-slate-100 dark:border-[#1e293b] space-y-6">
        <h4 className={sectionTitle}>
          <Building2 className="w-5 h-5 text-[#0f639e]" /> {isRTL ? 'الإعدادات الافتراضية' : 'Default Settings'}
        </h4>
        <p className="text-xs font-medium text-slate-400">{isRTL ? 'تُستخدم عند عدم وجود فروع مضافة' : 'Used when no branches are configured'}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-5">
            <InputField label="Support Hotline" value={data.contacts.phoneSupport} onChange={v => updateNestedField('contacts.phoneSupport', v)} />
            <InputField label="Admin Line" value={data.contacts.phoneAdmin} onChange={v => updateNestedField('contacts.phoneAdmin', v)} />
            <InputField label="Official Email" value={data.contacts.email} onChange={v => updateNestedField('contacts.email', v)} />
            <InputField label="WhatsApp Number" value={data.contacts.whatsapp} onChange={v => updateNestedField('contacts.whatsapp', v)} />
          </div>
          <div className="space-y-5">
            <InputField label="Map Embed URL" placeholder="https://www.google.com/maps/embed?pb=!1m18..." value={data.contacts.mapEmbedUrl} onChange={v => updateNestedField('contacts.mapEmbedUrl', v)} />
            <InputField label="Facebook URL" value={data.contacts.facebook} onChange={v => updateNestedField('contacts.facebook', v)} />
            <InputField label="Twitter URL" value={data.contacts.twitter} onChange={v => updateNestedField('contacts.twitter', v)} />
            <InputField label="YouTube URL" value={data.contacts.youtube} onChange={v => updateNestedField('contacts.youtube', v)} />
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-[#1e293b]">
          <div className="flex items-center gap-2 px-1 mb-5">
            <div className="w-1 h-5 bg-[#0f639e] rounded-full shrink-0" />
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em]">
              {isRTL ? 'ظهور أيقونات التواصل في التذييل' : 'Footer Social Icon Visibility'}
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ToggleField label={isRTL ? 'فيسبوك' : 'Facebook'} description={isRTL ? 'إظهار أيقونة فيسبوك في التذييل' : 'Show Facebook icon in footer'}
              checked={data.contacts.showFacebook !== false} onChange={v => updateNestedField('contacts.showFacebook', v)} />
            <ToggleField label={isRTL ? 'تويتر' : 'Twitter / X'} description={isRTL ? 'إظهار أيقونة تويتر في التذييل' : 'Show Twitter icon in footer'}
              checked={data.contacts.showTwitter !== false} onChange={v => updateNestedField('contacts.showTwitter', v)} />
            <ToggleField label={isRTL ? 'يوتيوب' : 'YouTube'} description={isRTL ? 'إظهار أيقونة يوتيوب في التذييل' : 'Show YouTube icon in footer'}
              checked={data.contacts.showYoutube !== false} onChange={v => updateNestedField('contacts.showYoutube', v)} />
            <ToggleField label={isRTL ? 'واتساب' : 'WhatsApp'} description={isRTL ? 'إظهار أيقونة واتساب في التذييل' : 'Show WhatsApp icon in footer'}
              checked={data.contacts.showWhatsapp !== false} onChange={v => updateNestedField('contacts.showWhatsapp', v)} />
          </div>
        </div>

        <FieldGroup label="Physical Address" valueEn={data.contacts.address.en} valueAr={data.contacts.address.ar} onUpdateEn={v => updateNestedField('contacts.address.en', v)} onUpdateAr={v => updateNestedField('contacts.address.ar', v)} isTextArea isRTL={isRTL} />
      </div>
    </div>
  );
};

export default ContactTab;
