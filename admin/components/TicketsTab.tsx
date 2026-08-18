import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Ticket, Plus, Trash2, Mail, Inbox, Loader2, CheckCircle2, Clock, ExternalLink } from 'lucide-react';
import type { SiteContent, TicketDepartment, TicketRecord, TicketStatus } from '../../types';
import { SectionHeader, InputField, ToggleField } from './FormComponents';

interface TicketsTabProps {
  data: SiteContent;
  updateNestedField: (path: string, value: any) => void;
  isRTL: boolean;
  lang: 'en' | 'ar';
}

const sectionTitle = 'text-lg font-black text-[#0f639e] dark:text-white tracking-tight flex items-center gap-3';
const cardTitle = 'text-sm font-black text-[#0f639e] dark:text-white tracking-tight flex items-center gap-2';
const statusStyles: Record<TicketStatus, string> = {
  new: 'bg-[#0f639e]/10 text-[#0f639e] dark:text-[#3292ca] border-[#0f639e]/20',
  processing: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  closed: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
};
const statusIcons: Record<TicketStatus, any> = {
  new: Inbox, processing: Clock, closed: CheckCircle2,
};

const TicketsTab: React.FC<TicketsTabProps> = ({ data, updateNestedField, isRTL, lang }) => {
  const ar = lang === 'ar';
  const depts = (data.tickets?.departments || []) as TicketDepartment[];
  const [tickets, setTickets] = useState<TicketRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'tickets'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setTickets(snap.docs.map(d => ({ ...(d.data() as TicketRecord), id: d.id })));
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, []);

  const setDepts = (updated: TicketDepartment[]) => updateNestedField('tickets.departments', updated);
  const setTicketsCfg = (path: string, value: any) => updateNestedField(`tickets.${path}`, value);

  const updateStatus = async (id: string, status: TicketStatus) => {
    try { await updateDoc(doc(db, 'tickets', id), { status }); } catch { /* rules/network */ }
  };
  const removeTicket = async (id: string) => {
    try { await deleteDoc(doc(db, 'tickets', id)); } catch { /* rules/network */ }
  };

  const counts = {
    total: tickets.length,
    fresh: tickets.filter(t => t.status === 'new').length,
    processing: tickets.filter(t => t.status === 'processing').length,
    closed: tickets.filter(t => t.status === 'closed').length,
  };

  const deptLabel = (t: TicketRecord) => (t.departmentLabel && (t.departmentLabel[lang] || t.departmentLabel.en)) || t.departmentId;

  return (
    <div className="space-y-10">
      <SectionHeader icon={Ticket} title={ar ? 'نظام التذاكر' : 'Ticket System'} subtitle="Departments, email delivery & incoming tickets" isRTL={isRTL} />

      <div className="pt-6 border-t border-slate-100 dark:border-[#1e293b] space-y-6">
        <div className="flex items-center justify-between">
          <h4 className={sectionTitle}>
            <Ticket className="w-5 h-5 text-[#df4d21]" /> {ar ? 'الأقسام' : 'Departments'}
          </h4>
          <button onClick={() => setDepts([...depts, { id: `d-${Date.now()}`, name: { en: 'New Department', ar: 'قسم جديد' } }])}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#0f639e] to-[#3292ca] text-white rounded-xl font-bold text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-md">
            <Plus className="w-4 h-4" /> {ar ? 'إضافة قسم' : 'Add Department'}
          </button>
        </div>
        <div className="space-y-3">
          {depts.map(d => (
            <div key={d.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-end p-4 rounded-xl border-2 border-slate-100 dark:border-[#1e293b] bg-white dark:bg-[#131d31]">
              <InputField label="EN" value={d.name.en} onChange={v => setDepts(depts.map(x => x.id === d.id ? { ...x, name: { ...x.name, en: v } } : x))} />
              <InputField label="AR" value={d.name.ar} onChange={v => setDepts(depts.map(x => x.id === d.id ? { ...x, name: { ...x.name, ar: v } } : x))} />
              <button onClick={() => setDepts(depts.filter(x => x.id !== d.id))}
                className="w-11 h-[52px] flex items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 dark:border-[#1e293b] space-y-6">
        <h4 className={sectionTitle}>
          <Mail className="w-5 h-5 text-[#df4d21]" /> {ar ? 'إرسال البريد' : 'Email Delivery'}
        </h4>
        <div className="space-y-4">
          <ToggleField
            label={ar ? 'تفعيل الإرسال إلى البريد' : 'Enable email delivery'}
            description={ar ? 'إرسال نسخة من كل تذكرة إلى البريد الإلكتروني المستلم' : 'Send a copy of every ticket to the recipient email'}
            checked={data.tickets?.emailEnabled !== false}
            onChange={v => setTicketsCfg('emailEnabled', v)}
          />
          <InputField label={ar ? 'البريد المستلم للتذاكر' : 'Ticket Recipient Email'} value={data.tickets?.recipientEmail || ''} onChange={v => setTicketsCfg('recipientEmail', v)} />
          <div className="px-5 py-4 rounded-xl border-2 border-[#0f639e]/15 bg-[#0f639e]/5 dark:bg-[#0f639e]/10">
            <p className="text-xs font-bold text-[#0f639e] dark:text-[#3292ca] leading-relaxed">
              {ar
                ? 'التفعيل الأول: عند إرسال أول تذكرة سيصلك بريد تفعيل من FormSubmit على البريد المستلم — افتحه واضغط على رابط التفعيل مرة واحدة فقط، وبعدها تصلك جميع التذاكر تلقائياً.'
                : 'First-time activation: after the first ticket submission, an activation email from FormSubmit arrives at the recipient inbox — open it and click the activation link once. After that, all tickets arrive automatically.'}
            </p>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 dark:border-[#1e293b] space-y-6">
        <h4 className={sectionTitle}>
          <Inbox className="w-5 h-5 text-[#df4d21]" /> {ar ? 'التذاكر الواردة' : 'Incoming Tickets'}
        </h4>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: ar ? 'الكل' : 'All', value: counts.total, icon: Ticket, color: 'text-[#0f639e]' },
            { label: ar ? 'جديدة' : 'New', value: counts.fresh, icon: Inbox, color: 'text-[#0f639e]' },
            { label: ar ? 'قيد المعالجة' : 'Processing', value: counts.processing, icon: Clock, color: 'text-amber-600' },
            { label: ar ? 'مغلقة' : 'Closed', value: counts.closed, icon: CheckCircle2, color: 'text-emerald-600' },
          ].map((s, i) => (
            <div key={i} className="p-5 bg-white dark:bg-[#131d31] rounded-2xl border border-slate-100 dark:border-[#1e293b]">
              <div className={`flex items-center gap-2 mb-2 ${s.color}`}>
                <s.icon className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{s.label}</span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{s.value}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-[#0f639e] animate-spin" />
          </div>
        ) : tickets.length === 0 ? (
          <div className="py-16 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-[#1e293b]">
            <Inbox className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-400 dark:text-slate-500">
              {ar ? 'لا توجد تذاكر بعد — ستظهر هنا فور وصولها' : 'No tickets yet — they will appear here as they arrive'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map(t => {
              const StatusIcon = statusIcons[t.status] || Inbox;
              return (
                <div key={t.id} className="p-5 rounded-2xl border border-slate-100 dark:border-[#1e293b] bg-white dark:bg-[#131d31] hover:shadow-lg transition-all duration-200">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="px-3 py-1.5 rounded-lg bg-[#0f639e]/10 text-[#0f639e] dark:text-[#3292ca] font-mono font-black text-xs" dir="ltr">{t.ref || t.id.slice(-6)}</span>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest ${statusStyles[t.status] || statusStyles.new}`}>
                        <StatusIcon className="w-3 h-3" /> {ar ? ({ new: 'جديدة', processing: 'قيد المعالجة', closed: 'مغلقة' } as Record<TicketStatus, string>)[t.status] : t.status}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500" dir="ltr">
                      {new Date(t.createdAt).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-GB')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <div className="min-w-0">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{ar ? 'الاسم' : 'NAME'}</p>
                      <p className="text-sm font-black text-slate-900 dark:text-white truncate">{t.name} {t.isClient && <span className="ms-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 text-[9px] font-black uppercase tracking-widest">{ar ? 'عميل' : 'Client'}</span>}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{ar ? 'التواصل' : 'CONTACT'}</p>
                      <div className="text-xs font-bold text-slate-600 dark:text-slate-300 truncate" dir="ltr">
                        <a href={`mailto:${t.email}`} className="hover:text-[#0f639e]">{t.email}</a>
                      </div>
                      <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500" dir="ltr">
                        {t.phone}{t.whatsapp ? ` · WA ${t.whatsapp}` : ''}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{ar ? 'القسم' : 'DEPARTMENT'}</p>
                      <p className="text-sm font-black text-[#df4d21] truncate">{deptLabel(t)}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{ar ? 'الموضوع' : 'SUBJECT'}</p>
                    <p className="text-sm font-black text-slate-900 dark:text-white">{t.subject}</p>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-line mt-1.5 line-clamp-3">{t.message}</p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-[#1e293b]">
                    <div className="flex items-center gap-2">
                      <select value={t.status} onChange={e => updateStatus(t.id, e.target.value as TicketStatus)}
                        className="px-3 py-2 rounded-xl border-2 border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#131d31] text-xs font-black text-slate-700 dark:text-slate-300 outline-none focus:border-[#0f639e] cursor-pointer">
                        <option value="new">{ar ? 'جديدة' : 'New'}</option>
                        <option value="processing">{ar ? 'قيد المعالجة' : 'Processing'}</option>
                        <option value="closed">{ar ? 'مغلقة' : 'Closed'}</option>
                      </select>
                      <a href={`mailto:${t.email}?subject=${encodeURIComponent(`Re: [${t.ref || ''}] ${t.subject}`)}`}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0f639e]/10 text-[#0f639e] dark:text-[#3292ca] text-xs font-black hover:bg-[#0f639e] hover:text-white transition-all">
                        <ExternalLink className="w-3.5 h-3.5" /> {ar ? 'رد بالبريد' : 'Reply'}
                      </a>
                    </div>
                    <button onClick={() => removeTicket(t.id)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 text-xs font-black hover:bg-rose-500 hover:text-white transition-all">
                      <Trash2 className="w-3.5 h-3.5" /> {ar ? 'حذف' : 'Delete'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketsTab;