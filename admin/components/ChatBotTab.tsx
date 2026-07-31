import React from 'react';
import { Bot, Plus, Trash2, ArrowUp, ArrowDown, MessageSquare, AlignLeft } from 'lucide-react';
import type { SiteContent, ChatQuickReply } from '../../types';
import { SectionHeader, FieldGroup, ToggleField } from './FormComponents';

interface ChatBotTabProps {
  data: SiteContent;
  setData: (d: SiteContent) => void;
  isRTL: boolean;
  lang: 'en' | 'ar';
}

const fieldBase = 'w-full px-5 py-4 rounded-xl border-2 border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#131d31] text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-[#0f639e] outline-none transition-all duration-200';

const sectionTitle = 'text-lg font-black text-[#0f639e] dark:text-white tracking-tight flex items-center gap-3';

const ChatBotTab: React.FC<ChatBotTabProps> = ({ data, setData, isRTL, lang }) => {
  const chatbot = data.chatbot;
  const setChatbot = (updated: typeof chatbot) => setData({ ...data, chatbot: updated });

  const moveReply = (idx: number, direction: -1 | 1) => {
    const items = [...chatbot.quickReplies];
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    [items[idx], items[targetIdx]] = [items[targetIdx], items[idx]];
    setChatbot({ ...chatbot, quickReplies: items });
  };

  const addReply = () => {
    const newReply: ChatQuickReply = { id: `qr-${Date.now()}`, label: { en: 'New Question', ar: 'سؤال جديد' }, value: { en: '', ar: '' } };
    setChatbot({ ...chatbot, quickReplies: [...chatbot.quickReplies, newReply] });
  };

  return (
    <div className="space-y-10">
      <SectionHeader icon={Bot} title={isRTL ? 'إعدادات المساعد الذكي' : 'ChatBot Settings'} subtitle="UNIVERSAL ASSET MANAGEMENT" isRTL={isRTL} />

      <ToggleField
        label={isRTL ? 'تفعيل المساعد الذكي' : 'Enable ChatBot'}
        checked={chatbot.enabled}
        onChange={v => setChatbot({ ...chatbot, enabled: v })}
        description={isRTL ? 'إظهار زر المساعد الذكي في جميع صفحات الموقع' : 'Show the chatbot button across all site pages'}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FieldGroup
          label={isRTL ? 'اسم المساعد' : 'BOT NAME'}
          valueEn={chatbot.name.en}
          valueAr={chatbot.name.ar}
          onUpdateEn={v => setChatbot({ ...chatbot, name: { ...chatbot.name, en: v } })}
          onUpdateAr={v => setChatbot({ ...chatbot, name: { ...chatbot.name, ar: v } })}
          isRTL={isRTL}
        />
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            {isRTL ? 'موضع الزر' : 'BUTTON POSITION'}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['left', 'right'] as const).map(pos => (
              <button key={pos} type="button" onClick={() => setChatbot({ ...chatbot, position: pos })}
                className={`px-5 py-4 rounded-xl border-2 font-bold text-sm transition-all ${
                  chatbot.position === pos
                    ? 'border-[#0f639e] bg-[#0f639e]/10 text-[#0f639e] dark:text-[#3292ca]'
                    : 'border-slate-200 dark:border-[#1e293b] text-slate-400 hover:border-[#0f639e]/40'
                }`}>
                {pos === 'left' ? (isRTL ? 'يسار' : 'Left') : (isRTL ? 'يمين' : 'Right')}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h4 className={sectionTitle}>
          <MessageSquare className="w-5 h-5 text-[#0f639e]" /> {isRTL ? 'رسالة الترحيب' : 'GREETING MESSAGE'}
        </h4>
        <FieldGroup
          label={isRTL ? 'نص الترحيب' : 'GREETING TEXT'}
          valueEn={chatbot.greeting.en}
          valueAr={chatbot.greeting.ar}
          onUpdateEn={v => setChatbot({ ...chatbot, greeting: { ...chatbot.greeting, en: v } })}
          onUpdateAr={v => setChatbot({ ...chatbot, greeting: { ...chatbot.greeting, ar: v } })}
          isTextArea
          textAreaHeight="h-44"
          isRTL={isRTL}
        />
      </div>

      <div className="pt-6 border-t border-slate-100 dark:border-[#1e293b] space-y-6">
        <div className="flex items-center justify-between">
          <h4 className={sectionTitle}>
            <AlignLeft className="w-5 h-5 text-[#0f639e]" /> {isRTL ? 'الردود السريعة' : 'QUICK REPLIES'}
          </h4>
          <button onClick={addReply} className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#0f639e] to-[#3292ca] text-white rounded-xl font-bold text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-md">
            <Plus className="w-4 h-4" /> {isRTL ? 'إضافة رد سريع' : 'Add Quick Reply'}
          </button>
        </div>

        <div className="space-y-3">
          {chatbot.quickReplies.map((qr, idx) => (
            <div key={qr.id} className="p-4 rounded-xl border-2 border-slate-100 dark:border-[#1e293b] space-y-4 group">
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1">
                  <button onClick={() => moveReply(idx, -1)} disabled={idx === 0}
                    className="w-8 h-6 bg-slate-100 dark:bg-[#1a2744] text-slate-400 rounded-lg flex items-center justify-center hover:bg-[#0f639e] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => moveReply(idx, 1)} disabled={idx === chatbot.quickReplies.length - 1}
                    className="w-8 h-6 bg-slate-100 dark:bg-[#1a2744] text-slate-400 rounded-lg flex items-center justify-center hover:bg-[#0f639e] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-[#0f639e] dark:text-white truncate">{qr.label[lang]}</p>
                  <p className="text-[10px] font-bold text-slate-400 truncate">{qr.value[lang] || '—'}</p>
                </div>
                <button onClick={() => setChatbot({ ...chatbot, quickReplies: chatbot.quickReplies.filter(x => x.id !== qr.id) })}
                  className="w-10 h-10 bg-slate-100 dark:bg-[#1a2744] text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-11">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">EN LABEL</label>
                  <input value={qr.label.en} onChange={e => setChatbot({
                    ...chatbot,
                    quickReplies: chatbot.quickReplies.map(x => x.id === qr.id ? { ...x, label: { ...x.label, en: e.target.value } } : x),
                  })} className={fieldBase} placeholder="Button text" />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">AR LABEL</label>
                  <input value={qr.label.ar} onChange={e => setChatbot({
                    ...chatbot,
                    quickReplies: chatbot.quickReplies.map(x => x.id === qr.id ? { ...x, label: { ...x.label, ar: e.target.value } } : x),
                  })} className={`${fieldBase} text-right`} placeholder="نص الزر" dir="rtl" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">EN MESSAGE</label>
                  <input value={qr.value.en} onChange={e => setChatbot({
                    ...chatbot,
                    quickReplies: chatbot.quickReplies.map(x => x.id === qr.id ? { ...x, value: { ...x.value, en: e.target.value } } : x),
                  })} className={fieldBase} placeholder="Message sent to the bot" />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">AR MESSAGE</label>
                  <input value={qr.value.ar} onChange={e => setChatbot({
                    ...chatbot,
                    quickReplies: chatbot.quickReplies.map(x => x.id === qr.id ? { ...x, value: { ...x.value, ar: e.target.value } } : x),
                  })} className={`${fieldBase} text-right`} placeholder="الرسالة المرسلة للمساعد" dir="rtl" />
                </div>
              </div>
            </div>
          ))}

          {chatbot.quickReplies.length === 0 && (
            <div className="text-center py-8 text-slate-400 font-medium">
              {isRTL ? 'لا توجد ردود سريعة. أضف رداً للبدء.' : 'No quick replies yet. Click "Add Quick Reply" to start.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBotTab;
