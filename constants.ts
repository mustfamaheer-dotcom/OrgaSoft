import { SiteContent } from './types';

export const INITIAL_SITE_DATA: SiteContent = {
  logo: {
    en: 'ORGA SOFT',
    ar: 'أورجا سوفت'
  },
  logoImageUrl: 'https://ik.imagekit.io/y2t2putyl/orgasoft/ORGANEWLOGOtbg.png',
  favicon: 'https://ik.imagekit.io/y2t2putyl/orgasoft/ORGANEWLOGOtbg.png',
  ticker: {
    enabled: true,
    text: {
      en: 'Welcome to Orga Soft | Discover our latest software solutions and advanced IT services!',
      ar: 'مرحباً بكم في أورجا سوفت | اكتشف أحدث حلولنا البرمجية وخدماتنا التقنية المتطورة!'
    },
    bgColor: '#df4d21',
    textColor: '#ffffff',
    speed: 40
  },
  theme: {
    primaryColor: '#0f639e',
    secondaryColor: '#3b82f6'
  },
  navLabels: {
    home: { en: 'Home', ar: 'الرئيسية' },
    about: { en: 'About', ar: 'عن الشركة' },
    products: { en: 'Products', ar: 'الأنظمة' },
    contact: { en: 'Contact', ar: 'تواصل' }
  },
  uiStrings: {
    aboutLabel: { en: 'About', ar: 'من نحن' },
    productsLabel: { en: 'Products', ar: 'المنظومة التقنية' },
    productsTitle: { en: 'Our Products', ar: 'المجموعة البرمجية' },
    productsSubtitle: { en: '', ar: '' },
    partnersLabel: { en: 'Partners', ar: 'شركاؤنا' },
    partnersTitle: { en: 'Our Partners', ar: 'شركاء النجاح' },
    contactLabel: { en: 'Contact', ar: 'تواصل معنا' },
    contactTitle: { en: 'Contact Us', ar: 'كن على اتصال' },
    contactSubtitle: { en: '', ar: '' },
    ctaMore: { en: 'Explore', ar: 'استكشاف' },
    ctaRequest: { en: 'Order Now', ar: 'اطلب البرنامج الآن' },
    footerDescription: { en: '', ar: '' },
    footerColProducts: { en: 'Products', ar: 'الحلول البرمجية' },
    footerColLinks: { en: 'Links', ar: 'روابط سريعة' },
    footerColContact: { en: 'Contact', ar: 'التواصل المباشر' }
  },
  companyName: {
    en: 'Orga Soft',
    ar: 'أورجا سوفت'
  },
  hero: {
    title: { en: '', ar: '' },
    subtitle: { en: '', ar: '' },
    image: '',
    rating: 4.9,
    cardSubtitle: { en: 'Solutions', ar: 'حلول برمجية' },
    stats: [
      { value: '18+', label: { en: 'Years Exp.', ar: 'سنوات خبرة' }, icon: 'clock' },
      { value: '15K+', label: { en: 'Happy Clients', ar: 'عميل سعيد' }, icon: 'users' },
      { value: '25+', label: { en: 'Products', ar: 'منتج برمجي' }, icon: 'award' },
    ]
  },
  about: {
    title: { en: '', ar: '' },
    image: '',
    content: { en: '', ar: '' },
    stats: []
  },
  announcement: {
    enabled: false,
    messages: [],
    speed: 'normal',
  },
  chatbot: {
    enabled: true,
    name: { en: 'OrgaBot', ar: 'أورجا بوت' },
    greeting: {
      en: "Hi! 👋 I'm **OrgaBot** your smart assistant\nI can help you with:\n• Choosing the right software for your business\n• Information about our services & products\n• Our branches and locations\n• Contact information\n• General company info\n\nJust ask away!",
      ar: 'مرحباً! 👋 أنا **أورجا بوت** المساعد الذكي\nيمكنني مساعدتك في:\n• اختيار البرنامج المناسب لنشاطك التجاري\n• معلومات عن خدماتنا ومنتجاتنا\n• فروعنا وعناويننا\n• أرقام التواصل\n• معلومات عامة عن الشركة\n\nاكتب استفسارك وسأجيبك فوراً!',
    },
    position: 'left',
    quickReplies: [
      { id: 'qr-1', label: { en: 'I need a system', ar: 'أريد نظاماً' }, value: { en: 'I need a management system for my business', ar: 'أريد نظاماً لإدارة نشاطي التجاري' } },
      { id: 'qr-2', label: { en: 'Our Services', ar: 'خدماتنا' }, value: { en: 'What IT services do you offer?', ar: 'ما هي الخدمات التي تقدمونها؟' } },
      { id: 'qr-3', label: { en: 'Contact', ar: 'اتصال' }, value: { en: 'What is your phone number?', ar: 'ما هو رقم الهاتف؟' } },
      { id: 'qr-4', label: { en: 'Locations', ar: 'فروعنا' }, value: { en: 'Where are your branches?', ar: 'أين توجد فروعكم؟' } },
      { id: 'qr-5', label: { en: 'Company Info', ar: 'عن الشركة' }, value: { en: 'Tell me about the company', ar: 'أخبرني عن الشركة' } },
      { id: 'qr-6', label: { en: 'Partners', ar: 'شركاؤنا' }, value: { en: 'Who are your partners?', ar: 'من هم شركاؤكم؟' } },
    ],
  },
  products: [],
  services: {
    enabled: false,
    title: { en: 'IT Services', ar: 'الخدمات التقنية' },
    subtitle: { en: '', ar: '' },
    items: [],
  },
  orgaProServices: {
    enabled: false,
    title: { en: 'Orga Pro Services', ar: 'أورجا المتطورة' },
    subtitle: { en: '', ar: '' },
    items: [],
  },
  partners: [],
  partnerCategories: [],
  contacts: {
    address: { en: '', ar: '' },
    mapEmbedUrl: '',
    phoneSupport: '',
    phoneAdmin: '',
    email: '',
    whatsapp: '',
    facebook: '',
    twitter: '',
    youtube: '',
    instagram: '',
    tiktok: '',
    showFacebook: true,
    showTwitter: true,
    showYoutube: true,
    showWhatsapp: true,
    showInstagram: true,
    showTiktok: true,
    showCompanyPolicy: true,
    showTermsAndConditions: true,
    branches: []
  },
  tickets: {
    showTicketButton: true,
    recipientEmail: 'support@orga4soft.com',
    emailEnabled: true,
    departments: [
      { id: 'accounts', name: { en: 'Accounts', ar: 'الحسابات' } },
      { id: 'support', name: { en: 'Technical Support', ar: 'الدعم الفني' } },
      { id: 'sales', name: { en: 'Sales', ar: 'المبيعات' } },
      { id: 'general', name: { en: 'General Inquiries', ar: 'استفسارات عامة' } },
    ],
  }
};

export const DEFAULT_TICKET_DEPARTMENTS = [
  { id: 'accounts', name: { en: 'Accounts', ar: 'الحسابات' } },
  { id: 'support', name: { en: 'Technical Support', ar: 'الدعم الفني' } },
  { id: 'sales', name: { en: 'Sales', ar: 'المبيعات' } },
  { id: 'general', name: { en: 'General Inquiries', ar: 'استفسارات عامة' } },
];

export const UI_STRINGS = {
  navAdmin: { en: 'Console', ar: 'لوحة التحكم' },
  ctaMore: { en: 'Explore', ar: 'استكشاف' },
  adminSave: { en: 'Deploy Changes', ar: 'نشر التغييرات' },
  langSwitch: { en: 'العربية', ar: 'English' }
};