import React, { useEffect, useRef, useState } from 'react';
import { X, User, Phone, MessageCircle, Mail, FolderKanban, PenLine, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import type { TicketDepartment } from '../types';
import { submitTicket, sendTicketEmail, markTicketEmailResult, generateTicketRef } from '../lib/tickets';

interface TicketModalProps {
  open: boolean;
  onClose: () => void;
  departments: TicketDepartment[];
  recipientEmail: string;
  emailEnabled: boolean;
  lang: 'en' | 'ar';
  isRTL: boolean;
}

interface FormState {
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  departmentId: string;
  isClient: boolean;
  subject: string;
  message: string;
}

const emptyForm: FormState = {
  name: '', phone: '', whatsapp: '', email: '',
  departmentId: '', isClient: false, subject: '', message: '',
};

const inputBase = `w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 dark:border-[#1e293b]
  bg-white dark:bg-[#131d31] text-slate-900 dark:text-white font-medium text-sm
  focus:ring-2 focus:ring-blue-500/10 focus:border-[#0f639e] outline-none
  transition-all duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-600`;

const labelStyle = `block text-[10px] font-black text-slate-400 dark:text-slate-500
  uppercase tracking-[0.15em] mb-1.5`;

const TicketModal: React.FC<TicketModalProps> = ({ open, onClose, departments, recipientEmail, emailEnabled, lang, isRTL }) => {
  const ar = lang === 'ar';
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [honey, setHoney] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ref: string; emailOk: boolean; emailError?: string } | null>(null);
  const lastSubmitRef = useRef(0);

  const t = {
    title: ar ? 'إنشاء تذكرة دعم' : 'Create Support Ticket',
    subtitle: ar ? 'أرسل استفسارك وسيتواصل معك فريق الدعم خلال 24 ساعة' : 'Send your inquiry — our support team replies within 24 hours',
    name: ar ? 'الاسم الكامل' : 'Full Name',
    namePh: ar ? 'مثال: أحمد محمد' : 'e.g. Ahmed Mohamed',
    phone: ar ? 'رقم الهاتف' : 'Phone Number',
    phonePh: ar ? '01xxxxxxxxx' : '01xxxxxxxxx',
    whatsapp: ar ? 'رقم الواتساب (اختياري)' : 'WhatsApp Number (optional)',
    email: ar ? 'البريد الإلكتروني' : 'Email Address',
    emailPh: ar ? 'name@example.com' : 'name@example.com',
    department: ar ? 'القسم' : 'Department',
    isClient: ar ? 'هل أنت عميل لدى أورجا سوفت؟' : 'Are you an OrgaSoft client?',
    subject: ar ? 'الموضوع' : 'Subject',
    subjectPh: ar ? 'مثال: مشكلة في تسجيل الدخول' : 'e.g. Login issue',
    message: ar ? 'تفاصيل التذكرة' : 'Ticket Details',
    messagePh: ar ? 'اشرح المشكلة أو الطلب بالتفصيل...' : 'Describe the issue or request in detail...',
    submit: ar ? 'إرسال التذكرة' : 'SEND TICKET',
    sending: ar ? 'جاري الإرسال...' : 'SENDING...',
    successTitle: ar ? 'تم استلام تذكرتك بنجاح!' : 'Ticket Received Successfully!',
    successRef: ar ? 'رقم التذكرة' : 'Ticket Reference',
    successMsg: ar ? 'تم تسجيل تذكرتك وإرسالها لفريق الدعم. سيتواصل معك الفريق خلال 24 ساعة.' : 'Your ticket has been recorded and sent to the support team. We will contact you within 24 hours.',
    note: ar ? 'بياناتك آمنة وتُستخدم فقط للرد على استفسارك.' : 'Your data is safe and used only to respond to your inquiry.',
    close: ar ? 'إغلاق' : 'Close',
    newTicket: ar ? 'تذكرة جديدة' : 'New Ticket',
    required: ar ? 'هذا الحقل مطلوب' : 'This field is required',
    phoneInvalid: ar ? 'يرجى إدخال رقم هاتف صحيح' : 'Please enter a valid phone number',
    emailInvalid: ar ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email address',
    messageShort: ar ? 'يرجى كتابة تفاصيل أكثر (10 أحرف على الأقل)' : 'Please provide more details (at least 10 characters)',
    cooldown: ar ? 'يرجى الانتظار 30 ثانية بين كل تذكرة' : 'Please wait 30 seconds between tickets',
    emailWarn: ar ? 'ملاحظة: البريد قيد التفعيل الأول، سيظهر الرابط في أول رسالة تصل' : 'Note: first-time email activation is pending',
  };

  useEffect(() => {
    if (open) {
      setForm({ ...emptyForm, departmentId: departments[0]?.id || '' });
      setErrors({});
      setHoney('');
      setResult(null);
    }
  }, [open, departments]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, onClose]);

  if (!open) return null;

  const set = (key: keyof FormState, value: string | boolean) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) e.name = t.required;
    if (!form.phone.trim()) e.phone = t.required;
    else if (!/^[+0-9 ()-]{7,20}$/.test(form.phone.trim())) e.phone = t.phoneInvalid;
    if (form.whatsapp.trim() && !/^[+0-9 ()-]{7,20}$/.test(form.whatsapp.trim())) e.whatsapp = t.phoneInvalid;
    if (!form.email.trim()) e.email = t.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) e.email = t.emailInvalid;
    if (!form.departmentId) e.departmentId = t.required;
    if (!form.subject.trim()) e.subject = t.required;
    if (!form.message.trim()) e.message = t.required;
    else if (form.message.trim().length < 10) e.message = t.messageShort;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (submitting) return;
    if (honey) return;
    const now = Date.now();
    if (now - lastSubmitRef.current < 30000) { setErrors({ subject: t.cooldown }); return; }
    if (!validate()) return;

    const dept = departments.find(d => d.id === form.departmentId) || departments[0];
    setSubmitting(true);
    let ref = '';
    let ticketId = '';
    let emailOk = true;
    let emailError = '';
    try {
      const res = await submitTicket({
        name: form.name.trim(),
        phone: form.phone.trim(),
        whatsapp: form.whatsapp.trim(),
        email: form.email.trim(),
        department: dept,
        isClient: form.isClient,
        subject: form.subject.trim(),
        message: form.message.trim(),
        lang,
        recipientEmail,
      });
      ticketId = res.id;
      ref = res.ref;
    } catch {
      ref = generateTicketRef();
    }
    if (emailEnabled && recipientEmail) {
      try {
        await sendTicketEmail({
          name: form.name.trim(),
          phone: form.phone.trim(),
          whatsapp: form.whatsapp.trim(),
          email: form.email.trim(),
          department: dept,
          isClient: form.isClient,
          subject: form.subject.trim(),
          message: form.message.trim(),
          lang,
          recipientEmail,
        });
      } catch (e: any) {
        emailOk = false;
        emailError = (e && e.message) ? String(e.message).slice(0, 200) : 'Email delivery failed';
      }
    }
    if (ticketId) await markTicketEmailResult(ticketId, emailOk, emailError);
    lastSubmitRef.current = Date.now();
    setSubmitting(false);
    setResult({ ref, emailOk, emailError });
  };

  const errCls = (key: keyof FormState) => errors[key] ? 'border-rose-400 dark:border-rose-500/60' : '';

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className={`relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-[#131d31] shadow-2xl border border-slate-100 dark:border-[#1e293b] overflow-hidden ${ar ? 'font-tajawal' : 'font-inter'}`} dir={isRTL ? 'rtl' : 'ltr'} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between gap-3 p-5 sm:p-6 border-b border-slate-100 dark:border-[#1e293b] bg-gradient-to-r from-[#0f639e] to-[#3292ca]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center shrink-0">
              <FolderKanban className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-lg font-black text-white uppercase tracking-widest truncate">{t.title}</h3>
              <p className="text-[10px] font-bold text-white/70 truncate">{t.subtitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto">
          {result ? (
            <div className="flex flex-col items-center text-center py-10">
              <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2">{t.successTitle}</h4>
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0f639e]/10 dark:bg-[#0f639e]/20 mb-4">
                <span className="text-[10px] font-black text-[#0f639e] dark:text-[#3292ca] uppercase tracking-widest">{t.successRef}:</span>
                <span className="text-sm font-black text-[#0f639e] dark:text-[#3292ca] font-mono" dir="ltr">{result.ref}</span>
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">{t.successMsg}</p>
              {!result.emailOk && (
                <div className="mt-3 flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 max-w-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span className="text-start">
                    {t.emailWarn}
                    {result.emailError && <span className="block text-[10px] font-mono text-amber-500/80 mt-0.5 truncate" dir="ltr">{result.emailError}</span>}
                  </span>
                </div>
              )}
              <div className="flex gap-3 mt-8 w-full max-w-xs">
                <button onClick={() => { setForm({ ...emptyForm, departmentId: departments[0]?.id || '' }); setResult(null); }}
                  className="flex-1 py-3.5 rounded-xl bg-slate-100 dark:bg-[#1a2744] text-slate-600 dark:text-slate-300 font-black text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-[#1e293b] transition-all">
                  {t.newTicket}
                </button>
                <button onClick={onClose} className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#0f639e] to-[#3292ca] text-white font-black text-xs uppercase tracking-widest hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  {t.close}
                </button>
              </div>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>{t.name} *</label>
                  <div className="relative">
                    <User className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 ${isRTL ? 'right-4' : 'left-4'}`} />
                    <input value={form.name} onChange={e => set('name', e.target.value)} placeholder={t.namePh}
                      className={`${inputBase} ${errCls('name')} ${isRTL ? 'pr-11' : 'pl-11'}`} />
                  </div>
                  {errors.name && <p className="mt-1 text-[11px] font-bold text-rose-500">{errors.name}</p>}
                </div>
                <div>
                  <label className={labelStyle}>{t.phone} *</label>
                  <div className="relative">
                    <Phone className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 ${isRTL ? 'right-4' : 'left-4'}`} />
                    <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder={t.phonePh} dir="ltr"
                      className={`${inputBase} ${errCls('phone')} ${isRTL ? 'pr-11' : 'pl-11'}`} />
                  </div>
                  {errors.phone && <p className="mt-1 text-[11px] font-bold text-rose-500">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>{t.whatsapp}</label>
                  <div className="relative">
                    <MessageCircle className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 ${isRTL ? 'right-4' : 'left-4'}`} />
                    <input value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder={t.phonePh} dir="ltr"
                      className={`${inputBase} ${errCls('whatsapp')} ${isRTL ? 'pr-11' : 'pl-11'}`} />
                  </div>
                  {errors.whatsapp && <p className="mt-1 text-[11px] font-bold text-rose-500">{errors.whatsapp}</p>}
                </div>
                <div>
                  <label className={labelStyle}>{t.email} *</label>
                  <div className="relative">
                    <Mail className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 ${isRTL ? 'right-4' : 'left-4'}`} />
                    <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder={t.emailPh} dir="ltr"
                      className={`${inputBase} ${errCls('email')} ${isRTL ? 'pr-11' : 'pl-11'}`} />
                  </div>
                  {errors.email && <p className="mt-1 text-[11px] font-bold text-rose-500">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>{t.department} *</label>
                  <select value={form.departmentId} onChange={e => set('departmentId', e.target.value)}
                    className={`${inputBase} ${errCls('departmentId')} ${isRTL ? 'text-right' : 'text-left'} appearance-none cursor-pointer`}>
                    <option value="" disabled>{ar ? 'اختر القسم...' : 'Select department...'}</option>
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name[lang] || d.name.en}</option>
                    ))}
                  </select>
                  {errors.departmentId && <p className="mt-1 text-[11px] font-bold text-rose-500">{errors.departmentId}</p>}
                </div>
                <div>
                  <label className={labelStyle}>{t.isClient}</label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => set('isClient', true)}
                      className={`flex-1 px-4 py-3.5 rounded-xl border-2 font-black text-xs uppercase tracking-widest transition-all ${
                        form.isClient
                          ? 'border-[#0f639e] bg-[#0f639e]/10 text-[#0f639e] dark:text-[#3292ca]'
                          : 'border-slate-200 dark:border-[#1e293b] text-slate-400 dark:text-slate-500 hover:border-slate-300'
                      }`}>
                      {ar ? 'نعم' : 'YES'}
                    </button>
                    <button type="button" onClick={() => set('isClient', false)}
                      className={`flex-1 px-4 py-3.5 rounded-xl border-2 font-black text-xs uppercase tracking-widest transition-all ${
                        !form.isClient
                          ? 'border-[#df4d21] bg-[#df4d21]/10 text-[#df4d21]'
                          : 'border-slate-200 dark:border-[#1e293b] text-slate-400 dark:text-slate-500 hover:border-slate-300'
                      }`}>
                      {ar ? 'لا' : 'NO'}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className={labelStyle}>{t.subject} *</label>
                <div className="relative">
                  <PenLine className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 ${isRTL ? 'right-4' : 'left-4'}`} />
                  <input value={form.subject} onChange={e => set('subject', e.target.value)} placeholder={t.subjectPh}
                    className={`${inputBase} ${errCls('subject')} ${isRTL ? 'pr-11' : 'pl-11'}`} />
                </div>
                {errors.subject && <p className="mt-1 text-[11px] font-bold text-rose-500">{errors.subject}</p>}
              </div>

              <div>
                <label className={labelStyle}>{t.message} *</label>
                <textarea value={form.message} onChange={e => set('message', e.target.value)} placeholder={t.messagePh} rows={4}
                  className={`${inputBase} resize-y min-h-[110px] ${errCls('message')} ${isRTL ? 'text-right' : 'text-left'}`} />
                {errors.message && <p className="mt-1 text-[11px] font-bold text-rose-500">{errors.message}</p>}
              </div>

              <input type="text" name="website" value={honey} onChange={e => setHoney(e.target.value)}
                style={{ display: 'none' }} tabIndex={-1} autoComplete="off" aria-hidden="true" />

              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">{t.note}</p>

              <button type="submit" disabled={submitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-[#df4d21] to-[#0f639e] text-white text-xs sm:text-sm font-black uppercase tracking-widest shadow-lg shadow-[#df4d21]/20 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-300 disabled:opacity-60 disabled:translate-y-0">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {submitting ? t.sending : t.submit}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketModal;