import { readFileSync } from 'fs';

const products = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const siteData = {
  products: products.map((p: any) => ({
    id: p.id,
    name: p.name,
    description: { en: p.descEn, ar: p.descAr },
    longDescription: { en: p.longEn || '', ar: p.longAr || '' },
    showOnHome: p.showOnHome !== false,
  })),
  services: { items: [] },
  orgaProServices: { items: [] },
  partners: [],
  contacts: { address: { en: '', ar: '' }, phoneSupport: '02-26438782', phoneAdmin: '01065541990', email: 'contact@orgasoft.tech', whatsapp: '201129115112', branches: [] },
  about: { title: { en: '', ar: '' }, content: { en: '', ar: '' } },
  companyName: { en: 'Orga Soft', ar: 'أورجا سوفت' },
  hero: { stats: [] },
};

const { processMessage, createSession } = await import(`./lib/chatEngine.ts?t=${Date.now()}`);

// Test scenarios from user
const session = createSession();
const results = [];

for (const query of [
  'محل مستحضرات تجميل',
  'عندي محل مستحضرات تجميل',
  'رشحلي برنامج لمحل مستحضرات تجميل',
]) {
  const result = processMessage(query, siteData, session, 'ar');
  results.push({ query, result });
}

console.log('=== SCENARIO TEST RESULTS ===');
for (const { query, result } of results) {
  const top = result.suggestions.slice(0, 2).map(s => `${s.name.ar}(${s.matchScore})`).join(', ') || 'none';
  console.log(`\nQuery: ${query}`);
  console.log(`Out: ${result.textAr.replace(/\n/g, ' | ').slice(0, 200)}`);
  console.log(`Top: ${top} [Confidence: ${result.confidence}]`);
}

// Also test the exact user scenarios
console.log('\n\n=== USER SCENARIOS ===');

const userScenarios = [
  { label: '[USER] Generic business mgmt', q: 'أريد نظاماً لإدارة نشاطي التجاري' },
  { label: '[USER] Pharmacy follow-up', q: 'عندي صيدليه اي البرنامج المناسب' },
  { label: '[USER] Company policy', q: 'اي هي سياسة الشركه' },
  { label: '[USER] Cosmetics shop', q: 'رشحلي برنامج لمحل مستحضرات تجميل' },
];

for (const test of userScenarios) {
  session.lastSuggestions = null;
  session.messages = [];
  const r = processMessage(test.q, siteData, session, 'ar');
  const top = r.suggestions.slice(0, 2).map(s => `${s.name.ar}(${s.matchScore})`).join(', ') || 'none';
  console.log(`\n${test.label}`);
  console.log(`IN: ${test.q}`);
  console.log(`OUT: ${r.textAr.replace(/\n/g, ' | ').slice(0, 200)}`);
  console.log(`TOP: ${top} [Confidence: ${r.confidence}]`);
}
