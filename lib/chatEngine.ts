export interface Suggestion {
  id: string;
  name: Record<string, string>;
  image?: string;
  type: 'product' | 'service' | 'orga-service' | 'partner' | 'branch' | 'info';
  matchScore: number;
  description?: string;
  subtitle?: Record<string, string>;
}

export interface ChatResponse {
  text: string;
  textAr: string;
  suggestions: Suggestion[];
  quickReplies?: { label: string; labelAr: string; value: string }[];
  confidence: 'high' | 'medium' | 'low';
}

interface ProductData {
  id: string;
  name: Record<string, string>;
  description: Record<string, string>;
  longDescription?: Record<string, string>;
  image?: string;
  features?: Record<string, string[]>;
  keyFeatures?: { text: Record<string, string> }[];
  specs?: { key: Record<string, string>; value: Record<string, string> }[];
  showOnHome?: boolean;
}

interface ServiceData {
  id: string;
  name: Record<string, string>;
  description: Record<string, string>;
  image?: string;
  icon?: string;
  enabled?: boolean;
}

interface PartnerData {
  id: string;
  name: Record<string, string>;
  location: Record<string, string>;
  logo?: string;
  categoryId?: string;
}

interface BranchData {
  id: string;
  name: Record<string, string>;
  address: Record<string, string>;
  phoneSupport?: string;
  phoneAdmin?: string;
  email?: string;
  whatsapp?: string;
}

interface WebsiteData {
  products: ProductData[];
  services: { items: ServiceData[] };
  orgaProServices: { items: ServiceData[] };
  partners: PartnerData[];
  contacts: {
    address: Record<string, string>;
    phoneSupport: string;
    phoneAdmin: string;
    email: string;
    whatsapp: string;
    branches: BranchData[];
  };
  about: {
    title: Record<string, string>;
    content: Record<string, string>;
  };
  companyName: Record<string, string>;
  hero: {
    stats: { label: Record<string, string>; value: string }[];
  };
}

type Intent = 'product' | 'service' | 'orga-service' | 'location' | 'contact' | 'partner' | 'company' | 'greeting' | 'pricing' | 'product-detail' | 'unknown';

function normalizeArabic(text: string): string {
  return text
    .replace(/[إأآا]/g, 'ا')
    .replace(/[ىة]/g, 'ه')
    .replace(/[ؤ]/g, 'و')
    .replace(/[ئ]/g, 'ي')
    .replace(/[\u064B-\u065F]/g, '')
    .replace(/[ًٌٍَُِّْ]/g, '')
    .trim();
}

function tokenize(text: string): string[] {
  const normalized = normalizeArabic(text.toLowerCase());
  const tokens = normalized.split(/[\s,،.\n\r!?؟;:()\-_]+/).filter(t => t.length > 1);
  const result = new Set<string>();
  for (const t of tokens) result.add(t);
  for (let i = 0; i < tokens.length - 1; i++) {
    result.add(`${tokens[i]} ${tokens[i + 1]}`);
  }
  return Array.from(result);
}

// ── Intent detection ────────────────────────────────────────────────
const INTENT_KEYWORDS: Record<Intent, { en: string[]; ar: string[] }> = {
  greeting: {
    en: ['hi', 'hello', 'hey', 'good morning', 'good evening', 'howdy', 'greetings'],
    ar: ['مرحبا', 'اهلا', 'السلام', 'صباح', 'مساء', 'تحية'],
  },
  location: {
    en: ['location', 'address', 'office', 'branch', 'branches', 'where', 'find us', 'visit', 'headquarters', 'head office', 'place'],
    ar: ['عنوان', 'موقع', 'فرع', 'فروع', 'مكان', 'اين', 'أين', 'المقر', 'مقر', 'الفرع'],
  },
  contact: {
    en: ['phone', 'call', 'contact', 'email', 'whatsapp', 'number', 'mobile number', 'telephone', 'reach', 'get in touch', 'support number', 'phone number'],
    ar: ['هاتف', 'اتصال', 'اتصل', 'رقم هاتف', 'رقم الجوال', 'واتس', 'ايميل', 'بريد', 'تواصل', 'رقم التواصل', 'اتصل بنا'],
  },
  partner: {
    en: ['partner', 'partners', 'client', 'clients', 'customer', 'customers', 'collaboration', 'who work with', 'trusted'],
    ar: ['شريك', 'شركاء', 'عميل', 'عملاء', 'شراكه', 'شراكة', 'يتعامل', 'موزع'],
  },
  service: {
    en: ['service', 'services', 'it service', 'it services', 'development', 'programming', 'design', 'support', 'maintenance', 'hosting', 'cloud', 'network', 'software service'],
    ar: ['خدمه', 'خدمة', 'خدمات', 'تطوير', 'برمجه', 'برمجة', 'تصميم', 'دعم', 'صيانه', 'صيانة', 'استضافه', 'شبكات'],
  },
  'orga-service': {
    en: ['orga pro', 'orgapro', 'premium', 'professional service'],
    ar: ['اورجا برو', 'اورجا المتطوره', 'اورجا المتطورة', 'خدمات برو', 'احترافيه', 'احترافية'],
  },
  company: {
    en: ['about', 'company', 'tell me about', 'who are you', 'what is orga', 'about orga', 'background', 'history', 'mission', 'vision'],
    ar: ['من نحن', 'عن الشركه', 'عن الشركة', 'ما هي اورجا', 'نبذه', 'نبذة', 'تاریخ', 'شركه', 'شركة'],
  },
  pricing: {
    en: ['price', 'cost', 'how much', 'pricing', 'quote', 'afford', 'budget', 'subscription', 'monthly', 'annual'],
    ar: ['سعر', 'ثمن', 'تكلفه', 'تكلفة', 'كم الثمن', 'كم يكلف', 'مجان', 'مجاني', 'اشتراك', 'اشتراكات', 'تقديم عرض', 'عرض سعر'],
  },
  'product-detail': {
    en: ['tell me about', 'details about', 'features of', 'what is', 'describe', 'explain', 'overview of', 'info about'],
    ar: ['اعرف عن', 'اعرف تفاصيل', 'تفاصيل عن', 'مميزات', 'ايش هو', 'وش هو', 'شرح', 'معلومات عن', 'اختصر'],
  },
  product: {
    en: ['product', 'software', 'system', 'program', 'solution', 'manage'],
    ar: ['منتج', 'منتجات', 'نظام', 'حل', 'اداره', 'ادارة', 'سوفت'],
  },
  unknown: { en: [], ar: [] },
};

function arabicStem(word: string): string {
  let w = word;
  if (w.startsWith('وال') && w.length > 5) w = w.slice(3);
  else if (w.startsWith('بال') && w.length > 5) w = w.slice(3);
  else if (w.startsWith('كال') && w.length > 5) w = w.slice(3);
  else if (w.startsWith('لل') && w.length > 4) w = w.slice(2);
  else if (w.startsWith('ال') && w.length > 4) w = w.slice(2);
  if (w.endsWith('ون') && w.length > 4) w = w.slice(0, -2);
  else if (w.endsWith('ين') && w.length > 4) w = w.slice(0, -2);
  if (w.endsWith('يات') && w.length > 5) w = w.slice(0, -3);
  else if (w.endsWith('ات') && w.length > 4) w = w.slice(0, -2);
  if (w.endsWith('ية') || w.endsWith('يه')) w = w.slice(0, -2);
  if (w.endsWith('ية') || w.endsWith('يه')) w = w.slice(0, -2);
  if (w.endsWith('ة') || w.endsWith('ه')) w = w.slice(0, -1);
  return w;
}

function stemMatch(text: string, term: string): number {
  if (term.length < 2) return 0;
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const exact = (text.match(new RegExp(escaped, 'g')) || []).length;
  if (exact > 0) return exact;
  const tStem = arabicStem(term);
  if (tStem.length < 3) return 0;
  const words = text.split(/[\s,،.\n\r!?؟;:()\-_]+/).filter(w => w.length > 1);
  let count = 0;
  for (const w of words) {
    const wStem = arabicStem(w);
    if (wStem === tStem || wStem.startsWith(tStem) || tStem.startsWith(wStem)) count++;
  }
  return count;
}

const NEEDS_AR_KEYWORDS: Record<string, string[]> = {
  management: ['اداره', 'ادارة', 'ادار', 'اداري'],
  accounting: ['محاسبه', 'محاسبة', 'حسابات', 'محاسب', 'مالية'],
  sales: ['مبيعات', 'بيع', 'نقاط بيع', 'بيعا'],
  inventory: ['مخزون', 'مخازن', 'تخزين', 'مستودع', 'مستودعات'],
  hr: ['موظف', 'رواتب', 'موظفين', 'حضور', 'موارد'],
  crm: ['عميل', 'عملاء', 'علاقه'],
  invoicing: ['فاتوره', 'فاتورة', 'فواتير', 'فاتور'],
  analytics: ['تقارير', 'تحليل', 'احصائيه', 'تقرير'],
  cosmetics: ['مستحضر', 'تجميل', 'عطور', 'مكياج'],
};

function detectIntent(_tokens: string[], text: string): Intent {
  const lower = text.toLowerCase();
  const norm = normalizeArabic(lower);

  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
    for (const kw of keywords.en) {
      if (lower.includes(kw)) return intent as Intent;
    }
    for (const kw of keywords.ar) {
      if (norm.includes(normalizeArabic(kw))) return intent as Intent;
    }
  }
  return 'unknown';
}

// ── Industry detection ──────────────────────────────────────────────
interface IndustryCategory {
  name: string;
  keywords: string[];
  keywordsAr: string[];
}

const INDUSTRIES: IndustryCategory[] = [
  { name: 'pharmacy', keywords: ['pharmacy', 'pharma', 'drug', 'medication', 'pharmacist', 'prescription', 'rx', 'pill', 'medicine', 'pharmaceutical'], keywordsAr: ['صيدل', 'دواء', 'ادويه', 'علاج', 'وصفه'] },
  { name: 'cosmetics', keywords: ['cosmetic', 'beauty', 'makeup', 'perfume', 'skincare', 'haircare'], keywordsAr: ['تجميل', 'عطور', 'مكياج', 'تجميلي', 'تجميليه'] },
  { name: 'hospital', keywords: ['hospital', 'clinic', 'medical', 'healthcare', 'patient', 'doctor', 'nurse', 'ward', 'surgery', 'clinical', 'diagnosis', 'inpatient'], keywordsAr: ['مستشفى', 'مستوصف', 'مركز طبي', 'عياده', 'عيادة', 'رعايه'] },
  { name: 'restaurant', keywords: ['restaurant', 'cafe', 'coffee', 'kitchen', 'menu', 'dine', 'food', 'beverage', 'chef', 'catering', 'dining'], keywordsAr: ['مطعم', 'مقهى', 'كافيه', 'اكل', 'طعام', 'مطبخ', 'بقاله', 'سوبر ماركت', 'مأكولات'] },
  { name: 'retail', keywords: ['store', 'shop', 'retail', 'boutique', 'mall', 'ecommerce', 'e-commerce', 'supermarket', 'grocery', 'merchandise', 'checkout', 'accessories', 'gift', 'toy', 'mobile', 'phone', 'electronics'], keywordsAr: ['متجر', 'محل', 'متاجر', 'مول', 'تجاره', 'تجارة', 'بيع', 'سوبر', 'اكسسوارات', 'هدايا', 'هديه', 'لعاب', 'العاب', 'اطفال', 'موبايلات', 'جوالات', 'هواتف', 'الكترونيات', 'اجهزة'] },
  { name: 'warehouse', keywords: ['warehouse', 'inventory', 'stock', 'logistics', 'storage', 'distribution', 'supply chain', 'goods', 'shipment'], keywordsAr: ['مستودع', 'مخزون', 'تخزين', 'مخزن', 'مستلزمات', 'توريد'] },
  { name: 'accounting', keywords: ['accounting', 'finance', 'accountant', 'bookkeeping', 'invoice', 'billing', 'tax', 'audit', 'financial', 'expense', 'revenue', 'ledger', 'balance sheet'], keywordsAr: ['محاسبه', 'محاسبة', 'حسابات', 'ماليه', 'مالية', 'محاسب', 'فاتوره', 'فاتورة', 'ميزانيه', 'ضريبه'] },
  { name: 'hr', keywords: ['hr', 'human resources', 'payroll', 'recruitment', 'employee', 'staff', 'attendance', 'salary', 'hiring', 'personnel', 'timesheet', 'leave'], keywordsAr: ['موظف', 'موارد بشريه', 'موارد بشرية', 'رواتب', 'مرتبات', 'توظيف', 'حضور'] },
  { name: 'education', keywords: ['school', 'education', 'academy', 'university', 'college', 'student', 'teacher', 'learning', 'course', 'training', 'classroom', 'curriculum', 'library', 'book', 'books'], keywordsAr: ['مدرسه', 'مدرسة', 'تعليم', 'اكاديميه', 'أكاديميه', 'جامعه', 'جامعة', 'طالب', 'تدريب', 'مكتبه', 'مكتبة', 'مكتبات', 'كتب', 'كتاب'] },
  { name: 'realestate', keywords: ['real estate', 'property', 'apartment', 'building', 'rent', 'lease', 'mortgage', 'estate', 'housing', 'land', 'tenant', 'broker'], keywordsAr: ['عقار', 'عقارات', 'عقاريه', 'عقارية', 'املاك', 'أملاك', 'ايجار', 'إيجار', 'مبنى'] },
  { name: 'construction', keywords: ['construction', 'engineering', 'contractor', 'architecture', 'project', 'site', 'infrastructure', 'building material', 'tender'], keywordsAr: ['مقاولات', 'بناء', 'هندسه', 'هندسة', 'مشروع', 'انشاء', 'إنشاء', 'تشطيب'] },
  { name: 'transportation', keywords: ['car', 'vehicle', 'fleet', 'transport', 'delivery', 'shipping', 'logistics', 'driver', 'taxi', 'tracking', 'dispatch'], keywordsAr: ['سياره', 'سيارة', 'نقل', 'توصيل', 'شحن', 'مواصلات'] },
  { name: 'hotel', keywords: ['hotel', 'resort', 'hospitality', 'tourism', 'travel', 'booking', 'guest', 'accommodation', 'check-in', 'concierge'], keywordsAr: ['فندق', 'سياحه', 'سياحة', 'سفر', 'حجز', 'نزل', 'ضيافه', 'ضيافة'] },
  { name: 'agriculture', keywords: ['agriculture', 'farm', 'farming', 'crop', 'harvest', 'irrigation', 'livestock', 'plantation', 'greenhouse'], keywordsAr: ['زراعه', 'زراعة', 'مزرعه', 'مزرعة', 'محصول', 'ري', 'مواشي'] },
  { name: 'manufacturing', keywords: ['manufacturing', 'factory', 'production', 'industrial', 'plant', 'manufacture', 'assembly', 'quality control', 'machine'], keywordsAr: ['مصنع', 'مصانع', 'انتاج', 'إنتاج', 'صناعي', 'صناعه', 'صناعة', 'تصنيع'] },
];

export function detectIndustries(text: string): string[] {
  const tokens = tokenize(text);
  const detected = new Set<string>();
  for (const industry of INDUSTRIES) {
    for (const token of tokens) {
      for (const kw of industry.keywords) {
        if (token === kw || token.includes(kw)) { detected.add(industry.name); break; }
      }
      for (const kw of industry.keywordsAr) {
        if (token.includes(kw)) { detected.add(industry.name); break; }
      }
    }
  }
  return Array.from(detected);
}

// ── Need extraction ─────────────────────────────────────────────────
function extractNeeds(text: string): string[] {
  const needs: string[] = [];
  const patterns = [
    { words: ['اداره', 'ادارة', 'management', 'manage', 'organize', 'تنظيم', 'إدارة', 'ادار'], label: 'management' },
    { words: ['محاسبه', 'محاسبة', 'accounting', 'finance', 'حسابات', 'محاسب', 'محاس'], label: 'accounting' },
    { words: ['مبيعات', 'sales', 'بيع', 'point of sale', 'pos', 'نقاط بيع', 'بيعات'], label: 'sales' },
    { words: ['مخزون', 'inventory', 'stock', 'warehouse', 'مستودع', 'تخزين', 'مخازن'], label: 'inventory' },
    { words: ['موظف', 'employee', 'hr', 'payroll', 'رواتب', 'حضور', 'موارد', 'موظفين'], label: 'hr' },
    { words: ['عميل', 'customer', 'client', 'crm', 'عملاء', 'علاقه'], label: 'crm' },
    { words: ['فاتوره', 'فاتورة', 'invoice', 'billing', 'فواتير', 'فاتور'], label: 'invoicing' },
    { words: ['تقارير', 'report', 'analytics', 'تحليل', 'احصائيه', 'dashboard', 'تقار'], label: 'analytics' },
    { words: ['مستحضرات', 'cosmetic', 'تجميل', 'beauty', 'makeup', 'مكياج', 'عطور', 'perfume'], label: 'cosmetics' },
  ];
  const tokens = tokenize(text);
  for (const p of patterns) {
    if (p.words.some(w => tokens.some(t => t.includes(w)))) {
      needs.push(p.label);
    }
  }
  return needs;
}

// ── Extract distinguishing keywords ─────────────────────────────────
function getItemKeywords(name: Record<string, string>, description: Record<string, string>): string[] {
  const text = [name?.en || '', name?.ar || '', description?.en || '', description?.ar || ''].join(' ');
  const tokens = tokenize(text);
  const freq: Record<string, number> = {};
  for (const t of tokens) {
    if (t.length < 3) continue;
    freq[t] = (freq[t] || 0) + 1;
  }
  return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([k]) => k);
}

function areScoresClose(scores: number[], threshold = 0.35): boolean {
  if (scores.length < 2) return false;
  const sorted = [...scores].sort((a, b) => b - a);
  return (sorted[0] - sorted[1]) / Math.max(sorted[0], 1) < threshold;
}

function getConfidence(scores: number[]): 'high' | 'medium' | 'low' {
  if (scores.length === 0) return 'low';
  const max = Math.max(...scores);
  if (max >= 30) return 'high';
  if (max >= 10) return 'medium';
  return 'low';
}

// ── Product scoring ─────────────────────────────────────────────────
function scoreProductMatch(
  product: ProductData,
  industries: string[],
  needs: string[],
  tokens: string[],
): number {
  const descEn = [
    product.description?.en || '',
    product.longDescription?.en || '',
  ].join(' ').toLowerCase();
  const descAr = [
    product.description?.ar || '',
    product.longDescription?.ar || '',
  ].map(t => normalizeArabic(t)).join(' ');
  const nameEn = (product.name?.en || '').toLowerCase();
  const nameAr = normalizeArabic(product.name?.ar || '');
  let score = 0;

  for (const industry of industries) {
    const ind = INDUSTRIES.find(i => i.name === industry);
    if (!ind) continue;
    for (const kw of ind.keywords) {
      score += stemMatch(descEn, kw) * 15;
    }
    for (const kw of ind.keywordsAr) {
      score += stemMatch(descAr, kw) * 15;
    }
  }

  for (const need of needs) {
    const arKws = NEEDS_AR_KEYWORDS[need] || [];
    for (const kw of arKws) {
      score += stemMatch(descAr, kw) * 12;
    }
    score += stemMatch(descEn, need) * 12;
  }

  for (const token of tokens) {
    if (token.length < 3) continue;
    score += stemMatch(descEn, token) * 10;
    score += stemMatch(descAr, token) * 10;
  }

  for (const token of tokens) {
    if (token.length < 3) continue;
    if (stemMatch(nameEn, token) > 0 || stemMatch(nameAr, token) > 0) { score += 5; break; }
  }

  const featuresEn = (product.features?.en || []).join(' ').toLowerCase();
  const featuresAr = normalizeArabic((product.features?.ar || []).join(' '));
  const kfEn = (product.keyFeatures?.map(k => k.text?.en || '') || []).join(' ').toLowerCase();
  const kfAr = normalizeArabic((product.keyFeatures?.map(k => k.text?.ar || '') || []).join(' '));
  for (const token of tokens) {
    if (token.length < 3) continue;
    if (stemMatch(featuresEn, token) > 0 || stemMatch(featuresAr, token) > 0) score += 1;
    if (stemMatch(kfEn, token) > 0 || stemMatch(kfAr, token) > 0) score += 1;
  }

  return score;
}

// ── Service / item scoring ──────────────────────────────────────────
function scoreItemMatch(
  item: { name: Record<string, string>; description: Record<string, string> },
  tokens: string[],
): number {
  const nameEn = (item.name?.en || '').toLowerCase();
  const nameAr = normalizeArabic(item.name?.ar || '');
  const descEn = (item.description?.en || '').toLowerCase();
  const descAr = normalizeArabic(item.description?.ar || '');
  let score = 0;

  for (const token of tokens) {
    if (token.length < 3) continue;
    if (stemMatch(nameEn, token) > 0 || stemMatch(nameAr, token) > 0) score += 20;
    if (stemMatch(descEn, token) > 0) score += 6;
    if (stemMatch(descAr, token) > 0) score += 6;
  }
  return score;
}

function scorePartnerMatch(
  partner: PartnerData,
  tokens: string[],
): number {
  const nameEn = (partner.name?.en || '').toLowerCase();
  const nameAr = normalizeArabic(partner.name?.ar || '');
  const locEn = (partner.location?.en || '').toLowerCase();
  const locAr = normalizeArabic(partner.location?.ar || '');
  let score = 0;

  for (const token of tokens) {
    if (token.length < 3) continue;
    if (nameEn.includes(token) || nameAr.includes(token)) score += 15;
    if (locEn.includes(token) || locAr.includes(token)) score += 8;
  }
  return score;
}

function scoreBranchMatch(
  branch: BranchData,
  tokens: string[],
): number {
  const nameEn = (branch.name?.en || '').toLowerCase();
  const nameAr = normalizeArabic(branch.name?.ar || '');
  const addrEn = (branch.address?.en || '').toLowerCase();
  const addrAr = normalizeArabic(branch.address?.ar || '');
  let score = 0;

  for (const token of tokens) {
    if (token.length < 3) continue;
    if (nameEn.includes(token) || nameAr.includes(token)) score += 15;
    if (addrEn.includes(token) || addrAr.includes(token)) score += 8;
  }
  return score;
}

// ── Handlers per intent ─────────────────────────────────────────────

function handleLocations(siteData: WebsiteData, lang: string, tokens: string[]): ChatResponse | null {
  const branches = siteData.contacts?.branches || [];
  const addr = siteData.contacts?.address;
  if (branches.length === 0 && addr) {
    const text = lang === 'ar'
      ? `📍 **العنوان**: ${addr.ar || addr.en || ''}`
      : `📍 **Address**: ${addr.en || addr.ar || ''}`;
    return { text, textAr: text, suggestions: [], confidence: 'high' };
  }

  const scored = branches.map(b => ({
    id: b.id,
    name: b.name,
    subtitle: b.address,
    matchScore: scoreBranchMatch(b, tokens),
  })).sort((a, b) => b.matchScore - a.matchScore);

  const top = scored.slice(0, 3);
  if (top.length === 0 && addr) {
    const text = lang === 'ar'
      ? `📍 **العنوان**: ${addr.ar || addr.en || ''}`
      : `📍 **Address**: ${addr.en || addr.ar || ''}`;
    return { text, textAr: text, suggestions: [], confidence: 'high' };
  }

  const suggestions: Suggestion[] = top.map(b => ({
    id: `branch-${b.id}`,
    name: b.name,
    subtitle: b.subtitle,
    type: 'branch',
    matchScore: b.matchScore,
  }));

  if (lang === 'ar') {
    return {
      text: `لدينا **${branches.length}** فروع:\n` + top.map((b, i) => `${i + 1}. ${b.name.ar || b.name.en}`).join('\n'),
      textAr: `لدينا **${branches.length}** فروع:\n` + top.map((b, i) => `${i + 1}. ${b.name.ar || b.name.en}`).join('\n'),
      suggestions,
      confidence: 'high',
    };
  }
  return {
    text: `We have **${branches.length}** branches:\n` + top.map((b, i) => `${i + 1}. ${b.name.en || b.name.ar}`).join('\n'),
    textAr: `لدينا **${branches.length}** فروع:\n` + top.map((b, i) => `${i + 1}. ${b.name.ar || b.name.en}`).join('\n'),
    suggestions,
    confidence: 'high',
  };
}

function handleContacts(siteData: WebsiteData, _lang: string, _tokens: string[]): ChatResponse | null {
  const c = siteData.contacts;
  if (!c) return null;

  const fmtMulti = (v: string) => v.replace(/\s*\/\s*/g, '\n   ').replace(/\n/g, '\n   ');

  const en: string[] = [];
  const ar: string[] = [];

  if (c.phoneSupport) {
    en.push(`📞 **Support**\n   ${fmtMulti(c.phoneSupport)}`);
    ar.push(`📞 **الدعم الفني**\n   ${fmtMulti(c.phoneSupport)}`);
  }
  if (c.phoneAdmin) {
    en.push(`📞 **Admin**\n   ${fmtMulti(c.phoneAdmin)}`);
    ar.push(`📞 **الإدارة**\n   ${fmtMulti(c.phoneAdmin)}`);
  }
  if (c.email) {
    en.push(`📧 **Email**\n   ${c.email}`);
    ar.push(`📧 **البريد الإلكتروني**\n   ${c.email}`);
  }
  if (c.whatsapp) {
    const wa = c.whatsapp.replace(/^\+/, '');
    en.push(`💬 **WhatsApp**\n   +${wa}`);
    ar.push(`💬 **واتساب**\n   +${wa}`);
  }
  if (c.address?.en) {
    en.push(`📍 **Address**\n   ${c.address.en}`);
  }
  if (c.address?.ar) {
    ar.push(`📍 **العنوان**\n   ${c.address.ar}`);
  }

  if (en.length === 0 && ar.length === 0) return null;

  const quickReplies: { label: string; labelAr: string; value: string }[] = [];
  if (c.whatsapp) quickReplies.push({ label: 'Send WhatsApp', labelAr: 'أرسل واتساب', value: `Send a message on WhatsApp` });
  if (c.email) quickReplies.push({ label: 'Send Email', labelAr: 'أرسل بريداً', value: `Send an email to ${c.email}` });

  return {
    text: en.join('\n\n'),
    textAr: ar.join('\n\n'),
    suggestions: [],
    confidence: 'high',
    quickReplies: quickReplies.length > 0 ? quickReplies : undefined,
  };
}

function handlePartners(siteData: WebsiteData, lang: string, tokens: string[]): ChatResponse | null {
  const partners = siteData.partners || [];
  if (partners.length === 0) return null;

  const scored = partners.map(p => ({
    ...p,
    matchScore: scorePartnerMatch(p, tokens),
  })).sort((a, b) => b.matchScore - a.matchScore);

  const top = scored.slice(0, 5);
  const suggestions: Suggestion[] = top.map(p => ({
    id: `partner-${p.id}`,
    name: p.name,
    subtitle: p.location,
    image: p.logo,
    type: 'partner',
    matchScore: p.matchScore,
  }));

  if (lang === 'ar') {
    const name = top.map(p => p.name.ar || p.name.en).filter(Boolean).join('، ');
    return {
      text: `نحن نفتخر بشراكتنا مع **${partners.length}** من الشركات والمؤسسات المرموقة${
        name ? `، مثل: ${name}` : ''
      }`,
      textAr: `نحن نفتخر بشراكتنا مع **${partners.length}** من الشركات والمؤسسات المرموقة${
        name ? `، مثل: ${name}` : ''
      }`,
      suggestions,
      confidence: 'high',
    };
  }
  const name = top.map(p => p.name.en || p.name.ar).filter(Boolean).join(', ');
  return {
    text: `We are proud to partner with **${partners.length}** trusted organizations${name ? `, including: ${name}` : ''}`,
    textAr: `نحن نفتخر بشراكتنا مع **${partners.length}** من الشركات والمؤسسات المرموقة${
      name ? `، مثل: ${name}` : ''
    }`,
    suggestions,
    confidence: 'high',
  };
}

function handleServices(
  type: 'service' | 'orga-service',
  siteData: WebsiteData,
  lang: string,
  tokens: string[],
): ChatResponse | null {
  const section = type === 'service' ? siteData.services : siteData.orgaProServices;
  const items = (section?.items || []).filter(i => i.enabled !== false);
  if (items.length === 0) return null;

  const sectionTitle = type === 'service'
    ? (lang === 'ar' ? 'الخدمات' : 'IT Services')
    : (lang === 'ar' ? 'خدمات أورجا المتطورة' : 'Orga Pro Services');

  const scored = items.map(i => ({
    ...i,
    matchScore: scoreItemMatch(i, tokens),
  })).sort((a, b) => b.matchScore - a.matchScore);

  const top = scored.slice(0, 5);
  const suggestions: Suggestion[] = top.map(i => ({
    id: `${type}-${i.id}`,
    name: i.name,
    image: i.image,
    description: lang === 'ar' ? i.description?.ar : i.description?.en,
    type,
    matchScore: i.matchScore,
  }));

  const topName = lang === 'ar' ? top[0]?.name?.ar || '' : top[0]?.name?.en || '';

  if (top[0]?.matchScore >= 15) {
    const text = lang === 'ar'
      ? `أنا متأكد أن خدمة **${topName}** (${sectionTitle}) هي المناسبة لك!`
      : `I'm confident **${topName}** (${sectionTitle}) is the right service for you!`;
    return { text, textAr: text, suggestions: suggestions.slice(0, 1), confidence: 'high' };
  }

  if (top.length > 0) {
    const nameList = top.map(i => lang === 'ar' ? i.name?.ar || i.name?.en : i.name?.en || i.name?.ar).filter(Boolean).join(', ');
    const text = lang === 'ar'
      ? `إليك خدماتنا (${sectionTitle}):\n${nameList}`
      : `Here are our ${sectionTitle}:\n${nameList}`;
    return { text, textAr: text, suggestions, confidence: top[0]?.matchScore >= 10 ? 'medium' : 'low' };
  }

  return null;
}

function handleCompany(siteData: WebsiteData, lang: string): ChatResponse | null {
  const about = siteData.about;
  const companyName = lang === 'ar'
    ? siteData.companyName?.ar || siteData.companyName?.en || 'Orga Soft'
    : siteData.companyName?.en || siteData.companyName?.ar || 'Orga Soft';
  const title = lang === 'ar' ? about?.title?.ar || '' : about?.title?.en || '';
  const content = lang === 'ar' ? about?.content?.ar || '' : about?.content?.en || '';

  if (!content) {
    return {
      text: `${companyName} is a leading software solutions provider.`,
      textAr: `${companyName} هي شركة رائدة في تقديم حلول البرمجيات.`,
      suggestions: [],
      confidence: 'high',
    };
  }

  const cleaned = content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  const displayContent = lang === 'ar' ? cleaned : content;
  const text = `**${title}**\n\n${displayContent}`;
  return { text, textAr: text, suggestions: [], confidence: 'high' };
}

function handleGreeting(lang: string): ChatResponse {
  if (lang === 'ar') {
    return {
      text: 'مرحباً! 👋 أنا **أورجا بوت**، المساعد الذكي.\n\nيمكنني مساعدتك في:\n• اختيار البرنامج المناسب لنشاطك التجاري\n• معلومات عن خدماتنا ومنتجاتنا\n• فروعنا وعناويننا\n• أرقام التواصل\n• معلومات عامة عن الشركة\n\nاكتب استفسارك وسأجيبك فوراً!',
      textAr: 'مرحباً! 👋 أنا **أورجا بوت**، المساعد الذكي.\n\nيمكنني مساعدتك في:\n• اختيار البرنامج المناسب لنشاطك التجاري\n• معلومات عن خدماتنا ومنتجاتنا\n• فروعنا وعناويننا\n• أرقام التواصل\n• معلومات عامة عن الشركة\n\nاكتب استفسارك وسأجيبك فوراً!',
      suggestions: [],
      confidence: 'high',
      quickReplies: [
        { label: 'I need a system', labelAr: 'أريد نظاماً', value: 'I need a management system for my business' },
        { label: 'Our Services', labelAr: 'خدماتنا', value: 'What IT services do you offer?' },
        { label: 'Company Info', labelAr: 'عن الشركة', value: 'Tell me about the company' },
        { label: 'Contact', labelAr: 'اتصال', value: 'What is your phone number?' },
        { label: 'Locations', labelAr: 'فروعنا', value: 'Where are your branches?' },
        { label: 'Partners', labelAr: 'شركاؤنا', value: 'Who are your partners?' },
      ],
    };
  }
  return {
    text: "Hi! 👋 I'm **OrgaBot**, your smart assistant.\n\nI can help you with:\n• Choosing the right software for your business\n• Information about our services & products\n• Our branches and locations\n• Contact information\n• General company info\n\nJust ask away!",
    textAr: 'مرحباً! 👋 أنا **أورجا بوت**، المساعد الذكي.\n\nيمكنني مساعدتك في:\n• اختيار البرنامج المناسب لنشاطك التجاري\n• معلومات عن خدماتنا ومنتجاتنا\n• فروعنا وعناويننا\n• أرقام التواصل\n• معلومات عامة عن الشركة\n\nاكتب استفسارك وسأجيبك فوراً!',
    suggestions: [],
    confidence: 'high',
    quickReplies: [
      { label: 'I need a system', labelAr: 'أريد نظاماً', value: 'I need a management system for my business' },
      { label: 'Our Services', labelAr: 'خدماتنا', value: 'What IT services do you offer?' },
      { label: 'Company Info', labelAr: 'عن الشركة', value: 'Tell me about the company' },
      { label: 'Contact', labelAr: 'اتصال', value: 'What is your phone number?' },
      { label: 'Locations', labelAr: 'فروعنا', value: 'Where are your branches?' },
      { label: 'Partners', labelAr: 'شركاؤنا', value: 'Who are your partners?' },
    ],
  };
}

function handlePricing(siteData: WebsiteData, lang: string, tokens: string[]): ChatResponse | null {
  const c = siteData.contacts;
  const companyName = lang === 'ar'
    ? siteData.companyName?.ar || siteData.companyName?.en || 'أورجا سوفت'
    : siteData.companyName?.en || siteData.companyName?.ar || 'Orga Soft';

  if (lang === 'ar') {
    const parts: string[] = [`للحصول على **أسعار** برامج ${companyName} وعرض سعر مخصص لنشاطك:`];
    if (c.phoneSupport) parts.push(`📞 اتصل بنا: ${c.phoneSupport}`);
    if (c.phoneAdmin) parts.push(`📞 الإدارة: ${c.phoneAdmin}`);
    if (c.whatsapp) parts.push(`💬 واتساب: ${c.whatsapp}`);
    if (c.email) parts.push(`📧 البريد: ${c.email}`);
    parts.push('\nفريقنا جاهز لمساعدتك وتقديم عرض السعر المناسب!');
    return {
      text: parts.join('\n'),
      textAr: parts.join('\n'),
      suggestions: [],
      confidence: 'high',
      quickReplies: c.whatsapp
        ? [{ label: 'WhatsApp', labelAr: 'واتساب', value: `Send a message on WhatsApp` }]
        : undefined,
    };
  }

  const parts: string[] = [`To get **pricing** for ${companyName} programs and a custom quote for your business:`];
  if (c.phoneSupport) parts.push(`📞 Call us: ${c.phoneSupport}`);
  if (c.email) parts.push(`📧 Email: ${c.email}`);
  if (c.whatsapp) parts.push(`💬 WhatsApp: ${c.whatsapp}`);
  parts.push('\nOur team is ready to help you with the right quote!');
  return {
    text: parts.join('\n'),
    textAr: parts.join('\n'),
    suggestions: [],
    confidence: 'high',
    quickReplies: c.whatsapp
      ? [{ label: 'WhatsApp', labelAr: 'واتساب', value: `Send a message on WhatsApp` }]
      : undefined,
  };
}

function handleProductDetail(
  input: string,
  products: ProductData[],
  lang: string,
): ChatResponse | null {
  const tokens = tokenize(input);
  const fullTokens = input.toLowerCase().split(/[\s,.\-!?؟:؛]+/).filter(t => t.length > 1);
  const normInput = normalizeArabic(input.toLowerCase());

  for (const product of products) {
    const nameEn = (product.name?.en || '').toLowerCase();
    const nameAr = normalizeArabic(product.name?.ar || '');
    const nameTokens = nameEn.split(/\s+/).filter(t => t.length > 2);
    const nameArTokens = nameAr.split(/\s+/).filter(t => t.length > 2);

    // Require full name substring match OR at least 2 name tokens matching
    const fullMatch = normInput.includes(nameEn) || normInput.includes(nameAr);
    const tokenMatchCount = nameTokens.filter(t => normInput.includes(t)).length +
      nameArTokens.filter(t => normInput.includes(t)).length;
    const stemMatchCount = fullTokens.filter(t => stemMatch(nameEn, t) > 0 || stemMatch(nameAr, t) > 0).length;
    const nameMatch = fullMatch || tokenMatchCount >= 2 || stemMatchCount >= 2;

    if (nameMatch) {
      const desc = lang === 'ar' ? product.description?.ar : product.description?.en;
      const longDesc = lang === 'ar' ? product.longDescription?.ar : product.longDescription?.en;
      const features = lang === 'ar' ? product.features?.ar : product.features?.en;
      const kf = product.keyFeatures?.map(k => lang === 'ar' ? k.text?.ar : k.text?.en).filter(Boolean);

      const parts: string[] = [];
      parts.push(`**${lang === 'ar' ? product.name.ar : product.name.en}**`);
      if (desc) parts.push(`\n${desc}`);
      if (longDesc) {
        const cleaned = longDesc.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
        parts.push(`\n${cleaned}`);
      }
      if (features && features.length > 0) {
        parts.push(`\n\n${lang === 'ar' ? '✨ المميزات:' : '✨ Features:'}`);
        features.forEach(f => parts.push(`• ${f}`));
      }
      if (kf && kf.length > 0) {
        parts.push(`\n${lang === 'ar' ? '⭐ أبرز المميزات:' : '⭐ Key Features:'}`);
        kf.forEach(f => parts.push(`• ${f}`));
      }

      return {
        text: parts.join('\n'),
        textAr: parts.join('\n'),
        suggestions: [{
          id: `product-${product.id}`,
          name: product.name,
          image: product.image,
          type: 'product' as const,
          matchScore: 100,
        }],
        confidence: 'high',
        quickReplies: [
          { label: lang === 'ar' ? 'أريد هذا النظام' : 'I want this system', labelAr: 'أريد هذا النظام', value: `I'm interested in ${product.name.en}` },
          { label: lang === 'ar' ? 'السعر كم؟' : 'How much?', labelAr: 'السعر كم؟', value: 'How much does this cost?' },
          { label: lang === 'ar' ? 'برامج أخرى' : 'Other programs', labelAr: 'برامج أخرى', value: 'What other programs do you have?' },
        ],
      };
    }
  }
  // If input looks like a product name query but no product matched, show "not found"
  const looksLikeProductQuery = normInput.includes('orga') || normInput.includes('اورجا') ||
    tokens.some(t => t.includes('orga') || t.includes('اورجا'));
  if (looksLikeProductQuery) {
    const allNames = products.map(p => lang === 'ar' ? p.name.ar : p.name.en).filter(Boolean);
    if (lang === 'ar') {
      return {
        text: `لا يوجد برنامج باسم المذكور. برامجنا المتاحة:\n\n${allNames.map((n, i) => `${i + 1}. **${n}**`).join('\n')}\n\nاختر برنامج أو أخبرني بنوع نشاطك!`,
        textAr: `لا يوجد برنامج باسم المذكور. برامجنا المتاحة:\n\n${allNames.map((n, i) => `${i + 1}. **${n}**`).join('\n')}\n\nاختر برنامج أو أخبرني بنوع نشاطك!`,
        suggestions: products.slice(0, 3).map(p => ({
          id: `product-${p.id}`, name: p.name, image: p.image, type: 'product' as const, matchScore: 0,
        })),
        confidence: 'low',
        quickReplies: [
          { label: 'السعر', labelAr: 'السعر', value: 'How much does it cost?' },
          { label: 'اتصال', labelAr: 'اتصال', value: 'What is your phone number?' },
        ],
      };
    }
    return {
      text: `No program found with that name. Our available programs:\n\n${allNames.map((n, i) => `${i + 1}. **${n}**`).join('\n')}\n\nPick one or tell me about your business!`,
      textAr: `لا يوجد برنامج باسم المذكور. برامجنا المتاحة:\n\n${allNames.map((n, i) => `${i + 1}. **${n}**`).join('\n')}\n\nاختر برنامج أو أخبرني بنوع نشاطك!`,
      suggestions: products.slice(0, 3).map(p => ({
        id: `product-${p.id}`, name: p.name, image: p.image, type: 'product' as const, matchScore: 0,
      })),
      confidence: 'low',
      quickReplies: [
        { label: 'Pricing', labelAr: 'السعر', value: 'How much does it cost?' },
        { label: 'Contact', labelAr: 'اتصال', value: 'What is your phone number?' },
      ],
    };
  }

  return null;
}

// ── Product-specific handlers (existing logic, adapted) ─────────────

interface DistinguishResult {
  qEn: string;
  qAr: string;
}

function buildDistinguishQuestion(
  products: ProductData[],
  topIndices: number[],
  lang: string,
): DistinguishResult | null {
  if (topIndices.length < 2) return null;
  const a = products[topIndices[0]];
  const b = products[topIndices[1]];
  if (!a || !b) return null;

  const aKw = new Set(getItemKeywords(a.name, a.description));
  const bKw = new Set(getItemKeywords(b.name, b.description));

  const onlyA = [...aKw].filter(k => !bKw.has(k)).slice(0, 5);
  const onlyB = [...bKw].filter(k => !aKw.has(k)).slice(0, 5);

  const binA = lang === 'ar' ? a.name?.ar || a.name?.en || '' : a.name?.en || '';
  const binB = lang === 'ar' ? b.name?.ar || b.name?.en || '' : b.name?.en || '';

  if (onlyA.length > 0 && onlyB.length > 0) {
    const featA = onlyA.slice(0, 2).join(lang === 'ar' ? '، ' : ', ');
    const featB = onlyB.slice(0, 2).join(lang === 'ar' ? '، ' : ', ');
    if (lang === 'ar') {
      return { qEn: '', qAr: `هل تبحث عن حل يركز على ${featA} (مثل ${binA}) أم ${featB} (مثل ${binB})؟` };
    }
    return { qEn: `Are you looking for a solution focused on ${featA} (like **${binA}**) or ${featB} (like **${binB}**)?`, qAr: '' };
  }

  if (lang === 'ar') {
    return { qEn: '', qAr: `هل تبحث عن ${binA} أم ${binB}؟` };
  }
  return { qEn: `Are you looking for **${binA}** or **${binB}**?`, qAr: '' };
}

function generateProductQuestion(industries: string[], needs: string[], askedTopics: Set<string>, lang: string): string | null {
  if (industries.length === 0 && !askedTopics.has('industry')) {
    askedTopics.add('industry');
    return lang === 'ar'
      ? 'ما هو مجال نشاطك التجاري بالضبط؟ (مثلاً: صيدلية، مستشفى، مطعم، متجر، مستودع، شركة مقاولات...)'
      : 'What is your business field exactly? (e.g., pharmacy, hospital, restaurant, store, warehouse, construction...)';
  }
  if (needs.length === 0 && !askedTopics.has('need')) {
    askedTopics.add('need');
    if (industries.length === 1) {
      if (industries[0] === 'pharmacy') return lang === 'ar'
        ? 'هل تحتاج إلى إدارة المخزون الدوائي، نقاط البيع، متابعة صلاحية الأدوية، أم كل ذلك معاً؟'
        : 'Do you need drug inventory management, point of sale, expiry tracking, or all together?';
      if (industries[0] === 'restaurant') return lang === 'ar'
        ? 'هل تحتاج إلى إدارة الطلبات، شاشة المطبخ، نقاط البيع، أو نظام كامل للمطعم؟'
        : 'Do you need order management, kitchen display, point of sale, or a full restaurant system?';
      if (industries[0] === 'hospital') return lang === 'ar'
        ? 'هل تحتاج إلى إدارة المرضى، المواعيد، السجلات الطبية، أم نظام متكامل للمستشفى؟'
        : 'Do you need patient management, appointments, medical records, or a full hospital system?';
      if (industries[0] === 'retail') return lang === 'ar'
        ? 'هل تحتاج إلى إدارة المبيعات، المخزون، نقاط البيع، متجر إلكتروني؟'
        : 'Do you need sales management, inventory, point of sale, or an online store?';
      if (industries[0] === 'warehouse') return lang === 'ar'
        ? 'هل تحتاج إلى تتبع المخزون، إدارة المستودعات، شحن وتوزيع؟'
        : 'Do you need inventory tracking, warehouse management, shipping & distribution?';
      if (industries[0] === 'accounting') return lang === 'ar'
        ? 'هل تحتاج إلى فواتير، ميزانية، رواتب موظفين، تقارير مالية، أم كل ذلك؟'
        : 'Do you need invoicing, budgeting, payroll, financial reports, or all?';
      if (industries[0] === 'hr') return lang === 'ar'
        ? 'هل تحتاج إلى إدارة الموظفين، الحضور والانصراف، الرواتب، أم نظام متكامل للموارد البشرية؟'
        : 'Do you need employee management, attendance tracking, payroll, or a full HR system?';
      if (industries[0] === 'education') return lang === 'ar'
        ? 'هل تحتاج إلى إدارة الطلاب، الجداول الدراسية، الدرجات، أم نظام مدرسي متكامل؟'
        : 'Do you need student management, schedules, grades, or a full school system?';
      if (industries[0] === 'realestate') return lang === 'ar'
        ? 'هل تحتاج إلى إدارة العقارات، الإيجارات، العملاء، أم نظام متكامل للعقارات؟'
        : 'Do you need property management, rentals, client management, or a full real estate system?';
    }
    return lang === 'ar'
      ? 'ما هي أهم الخدمات التي تبحث عنها؟ (محاسبة، مخزون، موظفين، مبيعات، تقارير...)'
      : 'What key features are you looking for? (accounting, inventory, HR, sales, reports...)';
  }
  return null;
}

function handleProductQuery(
  input: string,
  products: ProductData[],
  session: SessionState,
  lang: string,
): ChatResponse {
    const tokens = tokenize(input);
  const industries = detectIndustries(input);
  const needs = extractNeeds(input);

  // ── Special handling for generic business management queries ──
  if (input.toLowerCase().includes('إدارة نشاطي التجاري') || 
      input.toLowerCase().includes('management my business')) {
    const question = generateProductQuestion([], [], session.askedTopics, lang);
    if (question) {
      const quickReplies = [
        { label: 'صيدلية', labelAr: 'صيدلية', value: 'I have a pharmacy' },
        { label: 'محل', labelAr: 'محل', value: 'I have a shop' },
        { label: 'مصنع', labelAr: 'مصنع', value: 'I have a factory' },
        { label: 'مستشفى', labelAr: 'مستشفى', value: 'I have a hospital' },
      ];
      return {
        text: question,
        textAr: question,
        suggestions: [],
        confidence: 'low',
        quickReplies,
      };
    }
  }

  // ── Special handling for generic business management queries ──
  if (input.toLowerCase().includes('إدارة نشاطي التجاري') || 
      input.toLowerCase().includes('management my business')) {
    const question = generateProductQuestion([], [], session.askedTopics, lang);
    if (question) {
      const quickReplies = [
        { label: 'صيدلية', labelAr: 'صيدلية', value: 'I have a pharmacy' },
        { label: 'محل', labelAr: 'محل', value: 'I have a shop' },
        { label: 'مصنع', labelAr: 'مصنع', value: 'I have a factory' },
        { label: 'مستشفى', labelAr: 'مستشفى', value: 'I have a hospital' },
      ];
      return {
        text: question,
        textAr: question,
        suggestions: [],
        confidence: 'low',
        quickReplies,
      };
    }
  }

  // ── Follow-up: check if user is confirming/accepting previous recommendation ──
  const confirmPatterns = [
    'تمام', 'ممتاز', 'موافق', 'اريد هذا', 'اريد هذا النظام',
    'هذا هو', 'هذا الحل', 'الحل الامثل', 'حل ممتاز',
    'تمام شكرا', 'تمام شكراً', 'شكرا', 'شكراً',
    'this is it', 'perfect', 'sounds good', 'i want this',
    'تمام كده', 'تمام كدا',
  ];
  const norm = normalizeArabic(input.toLowerCase());
  const normWords = norm.split(/\s+/);
  const isConfirm = confirmPatterns.some(p => {
    const np = normalizeArabic(p);
    return normWords.some(w => w === np);
  });
  if (isConfirm && session.lastSuggestions && session.lastSuggestions.length > 0) {
    const prev = session.lastSuggestions[0];
    const name = lang === 'ar' ? prev.name.ar : prev.name.en;
    if (lang === 'ar') {
      return {
        text: `ممتاز! **${name}** اختيار رائع 👍\n\nهل تحتاج مساعدة في شيء آخر؟`,
        textAr: `ممتاز! **${name}** اختيار رائع 👍\n\nهل تحتاج مساعدة في شيء آخر؟`,
        suggestions: [],
        confidence: 'high',
        quickReplies: [
          { label: 'الخدمات', labelAr: 'خدماتنا', value: 'What services do you offer?' },
          { label: 'السعر', labelAr: 'السعر', value: 'How much does it cost?' },
          { label: 'اتصال', labelAr: 'اتصال', value: 'What is your phone number?' },
        ],
      };
    }
    return {
      text: `Great! **${name}** is a solid choice 👍\n\nNeed help with anything else?`,
      textAr: `ممتاز! **${name}** اختيار رائع 👍\n\nهل تحتاج مساعدة في شيء آخر؟`,
      suggestions: [],
      confidence: 'high',
      quickReplies: [
        { label: 'Services', labelAr: 'خدماتنا', value: 'What services do you offer?' },
        { label: 'Pricing', labelAr: 'السعر', value: 'How much does it cost?' },
        { label: 'Contact', labelAr: 'اتصال', value: 'What is your phone number?' },
      ],
    };
  }

  session.messages.push({ text: input, industries, needs });

  const allIndustries = [...new Set(session.messages.flatMap(m => m.industries))];
  const allNeeds = [...new Set(session.messages.flatMap(m => m.needs))];

  const scored = products
    .filter(p => p.showOnHome !== false)
    .map(p => ({
      id: p.id,
      name: p.name,
      image: p.image,
      description: lang === 'ar' ? p.description?.ar : p.description?.en,
      type: 'product' as const,
      matchScore: scoreProductMatch(p, allIndustries, allNeeds, tokens),
    }))
    .filter(s => s.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);

  const topSuggestions = scored.slice(0, 5);
  const scores = topSuggestions.map(s => s.matchScore);
  const confidence = getConfidence(scores);
  const ambiguous = areScoresClose(scores) && topSuggestions.length >= 2 && confidence !== 'high';

  if (ambiguous && session.askedTopics.has('industry') && session.askedTopics.has('need')) {
    const topProdIdx = products.findIndex(p => p.id === topSuggestions[0].id);
    const secondProdIdx = products.findIndex(p => p.id === topSuggestions[1].id);
    const disQ = buildDistinguishQuestion(products, [topProdIdx, secondProdIdx], lang);
    if (disQ && (disQ.qEn || disQ.qAr)) {
      const qText = lang === 'ar' ? disQ.qAr : disQ.qEn;
      return {
        text: qText,
        textAr: qText,
        suggestions: topSuggestions.slice(0, 2),
        confidence,
        quickReplies: [
          { label: topSuggestions[0].name.en, labelAr: topSuggestions[0].name.ar, value: `I'm interested in ${topSuggestions[0].name.en}` },
          { label: topSuggestions[1].name.en, labelAr: topSuggestions[1].name.ar, value: `I'm interested in ${topSuggestions[1].name.en}` },
        ],
      };
    }
  }

  // ── Generic query: no specific industry mentioned, ask for clarification ──
  const meaningfulIndustries = allIndustries.filter(i => !['retail', 'warehouse', 'management'].includes(i));
  const meaningfulNeeds = allNeeds.filter(n => !['management'].includes(n));
  if (meaningfulIndustries.length === 0 && meaningfulNeeds.length === 0 && topSuggestions.length > 0) {
    const question = generateProductQuestion([], [], session.askedTopics, lang);
    if (question) {
      const quickReplies = [
        { label: 'صيدلية', labelAr: 'صيدلية', value: 'I have a pharmacy' },
        { label: 'محل', labelAr: 'محل', value: 'I have a shop' },
        { label: 'مصنع', labelAr: 'مصنع', value: 'I have a factory' },
        { label: 'مستشفى', labelAr: 'مستشفى', value: 'I have a hospital' },
      ];
      return {
        text: question,
        textAr: question,
        suggestions: topSuggestions.slice(0, 3).map(s => ({ ...s, matchScore: 0 })),
        confidence: 'low',
        quickReplies,
      };
    }
  }

  // ── Strong match: show single recommendation ──
  if (topSuggestions.length > 0 && (
    confidence === 'high' ||
    (confidence === 'medium' && session.messages.length >= 2) ||
    session.askedTopics.has('industry')
  )) {
    const top = topSuggestions[0];
    const topName = lang === 'ar' ? top.name.ar : top.name.en;

    if (confidence === 'high') {
      session.lastSuggestions = [top];
      if (lang === 'ar') {
        return {
          text: `بناءً على وصف نشاطك، أنا متأكد أن **${topName}** هو الحل الأمثل لك!`,
          textAr: `بناءً على وصف نشاطك، أنا متأكد أن **${topName}** هو الحل الأمثل لك!`,
          suggestions: [top],
          confidence,
          quickReplies: [
            { label: 'أريد هذا النظام', labelAr: 'أريد هذا النظام', value: `I want ${top.name.en}` },
            { label: 'السعر كم؟', labelAr: 'السعر كم؟', value: 'How much does it cost?' },
            { label: 'برامج أخرى', labelAr: 'برامج أخرى', value: 'What other programs do you have?' },
          ],
        };
      }
      return {
        text: `Based on your business description, I'm confident **${topName}** is the ideal solution for you!`,
        textAr: `بناءً على وصف نشاطك، أنا متأكد أن **${topName}** هو الحل الأمثل لك!`,
        suggestions: [top],
        confidence,
        quickReplies: [
          { label: 'I want this', labelAr: 'أريد هذا النظام', value: `I want ${top.name.en}` },
          { label: 'How much?', labelAr: 'السعر كم؟', value: 'How much does it cost?' },
          { label: 'Other programs', labelAr: 'برامج أخرى', value: 'What other programs do you have?' },
        ],
      };
    }

    let text: string, textAr: string;
    if (confidence === 'medium') {
      text = `Based on your needs, I recommend **${topName}**.`;
      textAr = `بناءً على احتياجاتك، أوصي بـ **${topName}**.`;
    } else {
      text = `You might want to check **${topName}**.`;
      textAr = `قد ترغب في الاطلاع على **${topName}**.`;
    }

    if (topSuggestions.length > 1) {
      text += '\n\nOther options that might fit:';
      textAr += '\n\nخيارات أخرى قد تناسبك:';
    }

    session.lastSuggestions = topSuggestions;

    return {
      text,
      textAr,
      suggestions: topSuggestions,
      confidence,
      quickReplies: topSuggestions.slice(1).map(s => ({
        label: s.name.en,
        labelAr: s.name.ar,
        value: `tell me more about ${s.name.en}`,
      })),
    };
  }

  // ── No strong match: show available programs as options ──
  if (topSuggestions.length > 0 && confidence !== 'high') {
    const allProducts = products.filter(p => p.showOnHome !== false);
    if (lang === 'ar') {
      const list = allProducts.map((p, i) => `${i + 1}. **${p.name.ar}** — ${p.description?.ar || ''}`).join('\n');
      return {
        text: `لم أجد تطابقاً تاماً لنشاطك. هذه برامجنا المتاحة:\n\n${list}\n\nأخبرني بنوع نشاطك وسأساعدك في اختيار الأنسب!`,
        textAr: `لم أجد تطابقاً تاماً لنشاطك. هذه برامجنا المتاحة:\n\n${list}\n\nأخبرني بنوع نشاطك وسأساعدك في اختيار الأنسب!`,
        suggestions: allProducts.slice(0, 3).map(p => ({
          id: `product-${p.id}`,
          name: p.name,
          image: p.image,
          type: 'product' as const,
          matchScore: 0,
        })),
        confidence: 'low',
        quickReplies: [
          { label: 'صيدلية', labelAr: 'صيدلية', value: 'I have a pharmacy' },
          { label: 'محل', labelAr: 'محل', value: 'I have a shop' },
          { label: 'مصنع', labelAr: 'مصنع', value: 'I have a factory' },
          { label: 'السعر', labelAr: 'السعر', value: 'How much does it cost?' },
        ],
      };
    }
    const list = allProducts.map((p, i) => `${i + 1}. **${p.name.en}** — ${p.description?.en || ''}`).join('\n');
    return {
      text: `I don't have an exact match for your business type. Here are our available programs:\n\n${list}\n\nTell me more about your business and I'll help you choose!`,
      textAr: `لم أجد تطابقاً تاماً لنشاطك. هذه برامجنا المتاحة:\n\n${list}\n\nأخبرني بنوع نشاطك وسأساعدك في اختيار الأنسب!`,
      suggestions: allProducts.slice(0, 3).map(p => ({
        id: `product-${p.id}`,
        name: p.name,
        image: p.image,
        type: 'product' as const,
        matchScore: 0,
      })),
      confidence: 'low',
      quickReplies: [
        { label: 'Pharmacy', labelAr: 'صيدلية', value: 'I have a pharmacy' },
        { label: 'Shop', labelAr: 'محل', value: 'I have a shop' },
        { label: 'Factory', labelAr: 'مصنع', value: 'I have a factory' },
        { label: 'Pricing', labelAr: 'السعر', value: 'How much does it cost?' },
      ],
    };
  }

  // ── No match at all: ask for clarification ──
  const question = generateProductQuestion(allIndustries, allNeeds, session.askedTopics, lang);
  if (question) {
    const quickReplies = allIndustries.length === 0
      ? [
          { label: 'Pharmacy / Medical', labelAr: 'صيدلية / طب', value: 'I run a pharmacy and need a management system' },
          { label: 'Restaurant / Cafe', labelAr: 'مطعم / مقهى', value: 'I own a restaurant and need management software' },
          { label: 'Store / Retail', labelAr: 'متجر / بيع', value: 'I have a retail store and need a POS system' },
          { label: 'Warehouse / Inventory', labelAr: 'مستودع / مخزون', value: 'I manage a warehouse and need inventory software' },
          { label: 'Accounting / Finance', labelAr: 'محاسبة / مالية', value: 'I need accounting and financial management' },
          { label: 'HR / Payroll', labelAr: 'موظفين / رواتب', value: 'I need HR and payroll management' },
          { label: 'Hotel / Tourism', labelAr: 'فندق / سياحة', value: 'I run a hotel and need booking management' },
          { label: 'School / Education', labelAr: 'مدرسة / تعليم', value: 'I manage a school and need an education system' },
          { label: 'Construction', labelAr: 'مقاولات / بناء', value: 'I work in construction and need project management' },
          { label: 'Real Estate', labelAr: 'عقارات', value: 'I work in real estate and need property management' },
        ]
      : [
          { label: 'Inventory / Stock', labelAr: 'مخزون', value: 'I need inventory and stock management' },
          { label: 'Accounting / Finance', labelAr: 'محاسبة', value: 'I need accounting and financial reports' },
          { label: 'Sales / POS', labelAr: 'مبيعات / نقاط بيع', value: 'I need sales and point of sale' },
          { label: 'HR / Payroll', labelAr: 'موظفين / رواتب', value: 'I need HR and payroll management' },
          { label: 'Reports / Analytics', labelAr: 'تقارير', value: 'I need reports and analytics' },
          { label: 'Full System', labelAr: 'نظام متكامل', value: 'I need a complete integrated system' },
        ];
    return { text: question, textAr: question, suggestions: [], confidence: 'low', quickReplies };
  }

  if (topSuggestions.length > 0) {
    const top = topSuggestions[0];
    const topName = lang === 'ar' ? top.name.ar : top.name.en;
    session.lastSuggestions = topSuggestions;
    return {
      text: `I found **${topName}** as a potential match. Want to explore it?`,
      textAr: `وجدت ${topName} كخيار محتمل. هل تريد استكشافه؟`,
      suggestions: topSuggestions,
      confidence,
    };
  }

  return {
    text: "I couldn't find a perfect match yet. Try describing your business in more detail — what industry, what size, and what you need to manage.",
    textAr: 'لم أجد تطابقاً تاماً بعد. جرب وصف نشاطك بتفاصيل أكثر — مجال النشاط، الحجم، وما تحتاج لإدارته.',
    suggestions: [],
    confidence: 'low',
  };
}

// ── Public API ──────────────────────────────────────────────────────
export interface SessionState {
  messages: { text: string; industries: string[]; needs: string[] }[];
  askedTopics: Set<string>;
  lastSuggestions?: Suggestion[];
}

export function createSession(): SessionState {
  return { messages: [], askedTopics: new Set() };
}

export function processMessage(
  input: string,
  siteData: WebsiteData,
  session: SessionState,
  lang: string,
): ChatResponse {
  const tokens = tokenize(input);
  const intent = detectIntent(tokens, input);

  // ── Route by intent ──
  switch (intent) {
    case 'greeting':
      return handleGreeting(lang);

    case 'location':
      return handleLocations(siteData, lang, tokens) || handleProductQuery(input, siteData.products, session, lang);

    case 'contact':
      return handleContacts(siteData, lang, tokens) || handleProductQuery(input, siteData.products, session, lang);

    case 'partner':
      return handlePartners(siteData, lang, tokens) || handleProductQuery(input, siteData.products, session, lang);

    case 'service':
      return handleServices('service', siteData, lang, tokens) || handleProductQuery(input, siteData.products, session, lang);

    case 'orga-service':
      return handleServices('orga-service', siteData, lang, tokens) || handleProductQuery(input, siteData.products, session, lang);

    case 'company':
      return handleCompany(siteData, lang) || handleProductQuery(input, siteData.products, session, lang);

    case 'pricing':
      return handlePricing(siteData, lang, tokens);

    case 'product-detail': {
      const detail = handleProductDetail(input, siteData.products, lang);
      if (detail) return detail;
      return handleProductQuery(input, siteData.products, session, lang);
    }

    case 'product':
    case 'unknown':
    default: {
      const detail = handleProductDetail(input, siteData.products, lang);
      if (detail) return detail;
      return handleProductQuery(input, siteData.products, session, lang);
    }
  }
}
