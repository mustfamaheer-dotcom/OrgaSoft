import { readFileSync } from 'fs';

const products = JSON.parse(readFileSync(process.argv[2], 'utf8'));

const siteData = {
  products: products.map((p: any) => ({
    id: p.id,
    name: p.name,
    description: { en: p.descEn, ar: p.descAr },
    longDescription: { en: p.longEn || '', ar: p.longAr || '' },
    showOnHome: p.showOnHome !== false,
    enabled: p.enabled !== false,
  })),
  services: { items: [] },
  orgaProServices: { items: [] },
  partners: [],
  contacts: { address: { en: '', ar: '' }, phoneSupport: '02-26438782', phoneAdmin: '01065541990', email: 'contact@orgasoft.tech', whatsapp: '201129115112', branches: [] },
  about: { title: { en: '', ar: '' }, content: { en: '', ar: '' } },
  companyName: { en: 'Orga Soft', ar: 'أورجا سوفت' },
  hero: { stats: [] },
};

// Force fresh import (bust any cache)
const { processMessage, createSession } = await import(`./lib/chatEngine.ts?t=${Date.now()}`);

const tests = [
  // === USER'S 4 SCENARIOS ===
  { label: '[USER] Generic business mgmt', q: 'أريد نظاماً لإدارة نشاطي التجاري' },
  { label: '[USER] Pharmacy follow-up', q: 'عندي صيدليه اي البرنامج المناسب', sessionCarry: true },
  { label: '[USER] Company policy', q: 'اي هي سياسة الشركه' },
  { label: '[USER] Cosmetics shop', q: 'رشحلي برنامج لمحل مستحضرات تجميل' },
  // === STANDARD TESTS ===
  { label: 'Pharmacy', q: 'عندي صيدليه' },
  { label: 'Mobile shop', q: 'عندي محل موبايلات' },
  { label: 'Computer shop', q: 'عندي محل كمبيوتر' },
  { label: 'Bookshop', q: 'عندي مكتبه' },
  { label: 'Cosmetics', q: 'محل مستحضرات تجميل' },
  { label: 'Pharma factory', q: 'مصنع ادويه' },
  { label: 'Toy/gift shop', q: 'عندي محل هدايا' },
  { label: 'Feed store', q: 'عندي محل علافه' },
  // === CONFIRM TRIGGERS ===
  { label: 'Confirm after rec', q: 'تمام', sessionCarry: true },
  { label: 'ممتاز confirm', q: 'ممتاز', sessionCarry: true },
  { label: 'Word: المناسب (BUG?)', q: 'البرنامج المناسب', sessionCarry: true },
  // === EDGE CASES ===
  { label: 'Pricing query', q: 'محتاج اعرف سعر البرنامج' },
  { label: 'Product detail exists', q: 'عايز اعرف تفاصيل عن Orga 10 M' },
  { label: 'Product detail not exists', q: 'عايز اعرف تفاصيل عن orga mobile' },
];

let session: any = null;

for (const t of tests) {
  if (!t.sessionCarry) session = createSession();
  const r = processMessage(t.q, siteData, session, 'ar');
  const top = r.suggestions.slice(0, 2).map((s: any) => `${s.name.ar}(${s.matchScore})`).join(', ') || 'none';
  console.log(`\n[${t.label}]`);
  console.log(`IN : ${t.q}`);
  console.log(`OUT: ${r.textAr.replace(/\n/g, ' | ').slice(0, 250)}`);
  console.log(`TOP: ${top} [${r.confidence}]`);
}
process.exit(0);
