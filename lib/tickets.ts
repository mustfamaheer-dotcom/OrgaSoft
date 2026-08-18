import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import type { TicketDepartment, TicketRecord, TicketStatus } from '../types';

export interface TicketInput {
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  department: TicketDepartment;
  isClient: boolean;
  subject: string;
  message: string;
  lang: 'en' | 'ar';
  recipientEmail: string;
}

const REF_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateTicketRef(): string {
  let s = '';
  for (let i = 0; i < 5; i++) s += REF_CHARS[Math.floor(Math.random() * REF_CHARS.length)];
  return `T-${s}`;
}

export function departmentLabel(dept: TicketDepartment, lang: 'en' | 'ar'): string {
  return (dept.name && (dept.name[lang] || dept.name.en)) || dept.id;
}

export interface TicketSubmitResult {
  id: string;
  ref: string;
}

export async function submitTicket(input: TicketInput, ref: string): Promise<TicketSubmitResult> {
  const record: Omit<TicketRecord, 'id'> = {
    ref,
    createdAt: new Date().toISOString(),
    name: input.name,
    phone: input.phone,
    whatsapp: input.whatsapp || '',
    email: input.email,
    departmentId: input.department.id,
    departmentLabel: input.department.name,
    isClient: input.isClient,
    subject: input.subject,
    message: input.message,
    status: 'new' as TicketStatus,
    lang: input.lang,
    emailSent: false,
  };
  const docRef = await addDoc(collection(db, 'tickets'), record);
  return { id: docRef.id, ref };
}

export async function markTicketEmailResult(id: string, ok: boolean, error?: string): Promise<void> {
  try {
    await updateDoc(doc(db, 'tickets', id), { emailSent: ok, emailError: ok ? '' : (error || 'unknown') });
  } catch {
    // non-blocking
  }
}

export async function sendTicketEmail(input: TicketInput, ref: string): Promise<void> {
  const deptEn = input.department.name.en || input.department.id;
  const deptAr = input.department.name.ar || input.department.id;
  const isAr = input.lang === 'ar';
  const autoresponse = isAr
    ? `أهلاً ${input.name} 👋\n\nتم استلام تذكرتك بنجاح برقم: ${ref}\nالقسم: ${deptAr}\n\nسيتواصل معك فريق الدعم خلال 24 ساعة.\nيمكنك الرد على هذا البريد الإلكتروني لمتابعة التذكرة.\n\n— فريق OrgaSoft`
    : `Hi ${input.name} 👋\n\nYour ticket has been received successfully:\nReference: ${ref}\nDepartment: ${deptEn}\n\nOur support team will contact you within 24 hours.\nYou can reply to this email to follow up on your ticket.\n\n— OrgaSoft Team`;
  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(input.recipientEmail)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      'Ticket Ref': ref,
      Name: input.name,
      Phone: input.phone,
      WhatsApp: input.whatsapp || '—',
      Email: input.email,
      Department: `${deptEn} / ${deptAr}`,
      Client: input.isClient ? 'Yes / نعم' : 'No / لا',
      Subject: input.subject,
      Message: input.message,
      _subject: `[${ref}] New Ticket — ${deptEn}`,
      _replyto: input.email,
      _template: 'modern',
      _autoresponse: autoresponse,
      _captcha: 'false',
      _honey: '',
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(body ? `FormSubmit error ${res.status}: ${body}` : `FormSubmit error ${res.status}`);
  }
}