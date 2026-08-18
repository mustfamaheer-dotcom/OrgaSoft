import { collection, addDoc } from 'firebase/firestore';
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

export async function submitTicket(input: TicketInput): Promise<string> {
  const ref = generateTicketRef();
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
  };
  await addDoc(collection(db, 'tickets'), record);
  return ref;
}

export async function sendTicketEmail(input: TicketInput, ref: string): Promise<void> {
  const deptEn = input.department.name.en || input.department.id;
  const deptAr = input.department.name.ar || input.department.id;
  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(input.recipientEmail)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      name: input.name,
      phone: input.phone,
      whatsapp: input.whatsapp || '—',
      email: input.email,
      department: `${deptEn} / ${deptAr}`,
      isClient: input.isClient ? 'Yes / نعم' : 'No / لا',
      subject: input.subject,
      message: input.message,
      ticketRef: ref,
      _subject: `[${ref}] New Ticket — ${deptEn}`,
      _replyto: input.email,
      _template: 'table',
      _honey: '',
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(body ? `FormSubmit error ${res.status}: ${body}` : `FormSubmit error ${res.status}`);
  }
}