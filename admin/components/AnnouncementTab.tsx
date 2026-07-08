import React from 'react';
import { Megaphone, Plus, Trash2, ChevronUp, ChevronDown, Save } from 'lucide-react';
import type { SiteContent } from '../../types';
import { SectionHeader, FieldGroup, ToggleField } from './FormComponents';

const SPEED_OPTIONS = [
  { value: 'slow', labelEn: 'Slow', labelAr: 'بطيء' },
  { value: 'normal', labelEn: 'Normal', labelAr: 'عادي' },
  { value: 'fast', labelEn: 'Fast', labelAr: 'سريع' },
];

const fieldBase = 'w-full px-5 py-4 rounded-xl border-2 border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#131d31] text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-[#0f639e] outline-none transition-all duration-200';

const AnnouncementTab: React.FC<{
  data: SiteContent;
  updateNestedField: (path: string, value: any) => void;
  isRTL: boolean;
  onSave?: () => void;
}> = ({ data, updateNestedField, isRTL, onSave }) => {
  const messages = data.announcement?.messages || [];
  const enabled = data.announcement?.enabled ?? false;
  const speed = data.announcement?.speed || 'normal';

  const addMessage = () => {
    const newMsg = {
      id: `ann_${Date.now()}`,
      text: { en: '', ar: '' },
      linkUrl: '',
      linkLabel: { en: '', ar: '' },
    };
    updateNestedField('announcement.messages', [...messages, newMsg]);
  };

  const removeMessage = (idx: number) => {
    updateNestedField('announcement.messages', messages.filter((_, i) => i !== idx));
  };

  const moveMessage = (idx: number, dir: -1 | 1) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= messages.length) return;
    const arr = [...messages];
    [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
    updateNestedField('announcement.messages', arr);
  };

  const updateMessage = (idx: number, field: string, value: any) => {
    updateNestedField(
      'announcement.messages',
      messages.map((m, i) => (i === idx ? { ...m, [field]: value } : m))
    );
  };

  const updateMessageText = (idx: number, lang: 'en' | 'ar', value: string) => {
    updateNestedField(
      'announcement.messages',
      messages.map((m, i) =>
        i === idx ? { ...m, text: { ...m.text, [lang]: value } } : m
      )
    );
  };

  const updateMessageLabel = (idx: number, lang: 'en' | 'ar', value: string) => {
    updateNestedField(
      'announcement.messages',
      messages.map((m, i) =>
        i === idx ? { ...m, linkLabel: { ...(m.linkLabel || { en: '', ar: '' }), [lang]: value } } : m
      )
    );
  };

  return (
    <div className="space-y-10">
      <SectionHeader
        icon={Megaphone}
        title={isRTL ? 'شريط الإعلانات' : 'Announcement Bar'}
        subtitle={isRTL ? 'عرض رسائل متحركة في أعلى قسم الهيرو' : 'Display scrolling messages at the top of the hero section'}
        isRTL={isRTL}
      />

      <div className="space-y-4">
        <ToggleField
          label={isRTL ? 'تفعيل الشريط' : 'Enable Announcement Bar'}
          description={isRTL ? 'إظهار شريط الإعلانات في أعلى الصفحة' : 'Show the announcement bar at the top of the page'}
          checked={enabled}
          onChange={v => updateNestedField('announcement.enabled', v)}
        />

        <div className="space-y-1.5">
          <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] px-1">
            {isRTL ? 'سرعة التمرير' : 'Scroll Speed'}
          </label>
          <div className="flex gap-2">
            {SPEED_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => updateNestedField('announcement.speed', opt.value)}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-200 border-2 ${
                  speed === opt.value
                    ? 'bg-[#0f639e] text-white border-[#0f639e] shadow-lg shadow-[#0f639e]/20'
                    : 'bg-white dark:bg-[#131d31] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#1e293b] hover:border-[#0f639e]/40'
                }`}
              >
                {isRTL ? opt.labelAr : opt.labelEn}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 dark:border-[#1e293b]">
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="flex items-center gap-3">
            <Megaphone className="w-5 h-5 text-[#0f639e]" />
            <h3 className="text-lg font-black text-[#0f639e] dark:text-white">
              {isRTL ? 'الرسائل' : 'Messages'}
            </h3>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-[#1e293b] px-2.5 py-1 rounded-full">
              {messages.length}
            </span>
          </div>
          <button
            onClick={addMessage}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#0f639e] to-[#3292ca] text-white rounded-xl font-bold text-xs hover:shadow-lg hover:shadow-[#0f639e]/20 hover:-translate-y-0.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            {isRTL ? 'إضافة رسالة' : 'Add Message'}
          </button>
        </div>

        {messages.length === 0 && (
          <div className="text-center py-16 bg-slate-50/50 dark:bg-[#1a2744]/30 rounded-2xl border-2 border-dashed border-slate-200 dark:border-[#1e293b]">
            <Megaphone className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 font-bold text-sm">
              {isRTL ? 'لا توجد رسائل بعد. أضف رسالة للبدء.' : 'No messages yet. Add one to get started.'}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={msg.id}
              className="p-5 rounded-2xl border-2 border-slate-100 dark:border-[#1e293b] bg-slate-50/50 dark:bg-[#1a2744]/50 relative group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 bg-[#0f639e] text-white rounded-lg flex items-center justify-center text-xs font-black">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                    {isRTL ? `الرسالة ${idx + 1}` : `Message ${idx + 1}`}
                  </span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => moveMessage(idx, -1)}
                    disabled={idx === 0}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#0f639e] hover:bg-slate-100 dark:hover:bg-[#1e293b] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveMessage(idx, 1)}
                    disabled={idx === messages.length - 1}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#0f639e] hover:bg-slate-100 dark:hover:bg-[#1e293b] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeMessage(idx)}
                    className="w-7 h-7 bg-rose-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-600 shadow-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <FieldGroup
                  label={isRTL ? 'نص الرسالة' : 'Message Text'}
                  valueEn={msg.text?.en || ''}
                  valueAr={msg.text?.ar || ''}
                  onUpdateEn={v => updateMessageText(idx, 'en', v)}
                  onUpdateAr={v => updateMessageText(idx, 'ar', v)}
                  isTextArea
                  textAreaHeight="h-24"
                  isRTL={isRTL}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] px-1">
                      {isRTL ? 'رابط الزر (اختياري)' : 'Button URL (optional)'}
                    </label>
                    <input
                      value={msg.linkUrl || ''}
                      onChange={e => updateMessage(idx, 'linkUrl', e.target.value)}
                      className={fieldBase}
                      placeholder="https://..."
                    />
                  </div>
                  <FieldGroup
                    label={isRTL ? 'نص الزر' : 'Button Label'}
                    valueEn={msg.linkLabel?.en || ''}
                    valueAr={msg.linkLabel?.ar || ''}
                    onUpdateEn={v => updateMessageLabel(idx, 'en', v)}
                    onUpdateAr={v => updateMessageLabel(idx, 'ar', v)}
                    isRTL={isRTL}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {onSave && (
        <div className="pt-6 border-t border-slate-100 dark:border-[#1e293b]">
          <button
            onClick={onSave}
            className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-gradient-to-r from-[#0f639e] to-[#3292ca] text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-[#0f639e]/20 hover:-translate-y-0.5 transition-all active:scale-[0.98]"
          >
            <Save className="w-4 h-4" />
            {isRTL ? 'حفظ شريط الإعلانات' : 'Save Announcement Bar'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AnnouncementTab;
