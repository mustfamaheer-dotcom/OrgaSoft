import { SiteContent } from './types';

export const INITIAL_SITE_DATA: SiteContent = {
  logo: {
    en: 'ORGA SOFT',
    ar: 'أورجا سوفت'
  },
  logoImageUrl: 'https://ik.imagekit.io/y2t2putyl/orgasoft/ORGANEWLOGOtbg.png',
  favicon: 'https://ik.imagekit.io/y2t2putyl/orgasoft/ORGANEWLOGOtbg.png',
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
  products: [],
  services: {
    enabled: false,
    title: { en: 'IT Services', ar: 'الخدمات التقنية' },
    subtitle: { en: '', ar: '' },
    items: [],
  },
  partners: [],
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
    showFacebook: true,
    showTwitter: true,
    showYoutube: true,
    showWhatsapp: true,
    branches: []
  }
};

export const UI_STRINGS = {
  navAdmin: { en: 'Console', ar: 'لوحة التحكم' },
  ctaMore: { en: 'Explore', ar: 'استكشاف' },
  adminSave: { en: 'Deploy Changes', ar: 'نشر التغييرات' },
  langSwitch: { en: 'العربية', ar: 'English' }
};