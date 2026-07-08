
export type Language = 'en' | 'ar';

export interface Stat {
  label: Record<Language, string>;
  value: string;
  icon: 'users' | 'clock' | 'award' | 'activity' | 'database';
}

export interface Partner {
  id: string;
  name: Record<Language, string>;
  location: Record<Language, string>;
  logo?: string;
}

export interface SiteContent {
  logo: Record<Language, string>;
  logoImageUrl?: string;
  favicon?: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
  };
  navLabels: {
    home: Record<Language, string>;
    about: Record<Language, string>;
    products: Record<Language, string>;
    contact: Record<Language, string>;
  };
  uiStrings: {
    aboutLabel: Record<Language, string>;
    productsLabel: Record<Language, string>;
    productsTitle: Record<Language, string>;
    productsSubtitle: Record<Language, string>;
    partnersLabel: Record<Language, string>;
    partnersTitle: Record<Language, string>;
    contactLabel: Record<Language, string>;
    contactTitle: Record<Language, string>;
    contactSubtitle: Record<Language, string>;
    ctaMore: Record<Language, string>;
    ctaRequest: Record<Language, string>;
    footerDescription: Record<Language, string>;
    footerColProducts: Record<Language, string>;
    footerColLinks: Record<Language, string>;
    footerColContact: Record<Language, string>;
  };
  companyName: Record<Language, string>;
  hero: {
    title: Record<Language, string>;
    subtitle: Record<Language, string>;
    image: string;
    rating: number;
    cardSubtitle: Record<Language, string>;
    stats: Stat[];
  };
  about: {
    title: Record<Language, string>;
    content: Record<Language, string>;
    image: string;
    stats: Stat[];
  };
  products: Array<Product>;
  services: {
    enabled: boolean;
    title: Record<Language, string>;
    subtitle: Record<Language, string>;
    items: Service[];
  };
  partners: Array<Partner>;
  announcement: {
    enabled: boolean;
    messages: AnnouncementMessage[];
    speed: 'slow' | 'normal' | 'fast';
  };
  contacts: {
    address: Record<Language, string>;
    mapEmbedUrl: string;
    phoneSupport: string;
    phoneAdmin: string;
    email: string;
    whatsapp: string;
    facebook: string;
    twitter: string;
    youtube: string;
    showFacebook?: boolean;
    showTwitter?: boolean;
    showYoutube?: boolean;
    showWhatsapp?: boolean;
    branches?: Branch[];
  };
}

export interface Branch {
  id: string;
  name: Record<Language, string>;
  address: Record<Language, string>;
  mapEmbedUrl: string;
  phoneSupport: string;
  phoneAdmin: string;
  email: string;
  whatsapp: string;
}

export interface AnnouncementMessage {
  id: string;
  text: Record<Language, string>;
  linkUrl?: string;
  linkLabel?: Record<Language, string>;
}

export interface ProductSpec {
  key: Record<Language, string>;
  value: Record<Language, string>;
}

export type ServiceIcon = 'code' | 'server' | 'shield' | 'cloud' | 'network' | 'smartphone' | 'globe' | 'database' | 'settings' | 'headphones';

export interface Service {
  id: string;
  name: Record<Language, string>;
  description: Record<Language, string>;
  icon: ServiceIcon;
  enabled: boolean;
}

export interface ProductPartner {
  id: string;
  name: Record<Language, string>;
  logo?: string;
  link?: string;
}

export interface Product {
  id: string;
  name: Record<Language, string>;
  description: Record<Language, string>;
  longDescription: Record<Language, string>;
  features: Record<Language, string[]>;
  specs?: ProductSpec[];
  image: string;
  bannerImage?: Record<Language, string>;
  icon: 'pill' | 'hospital' | 'store' | 'users' | 'activity' | 'database';
  keyFeatures?: Array<{
    id: string;
    text: Record<Language, string>;
  }>;
  productPartners?: ProductPartner[];
  supportPhone?: string;
  showOnHome?: boolean;
  demoUrl?: string;
}

export type EventType = 'pageview' | 'cta_click' | 'whatsapp_click' | 'phone_click';
export type DeviceType = 'mobile' | 'desktop' | 'tablet';

export interface VisitorEvent {
  id: string;
  timestamp: string;
  page: string;
  referrer: string;
  userAgent: string;
  language: string;
  sessionId: string;
  eventType: EventType;
  deviceType: DeviceType;
  meta?: string;
  createdAt?: any;
}

export interface DailyStats {
  date: string;
  totalPageViews: number;
  uniqueVisitors: number;
  uniqueSessions: number;
  topPages: { page: string; views: number }[];
  countries: { country: string; count: number }[];
  devices: { device: string; count: number }[];
  languages: { language: string; count: number }[];
  ctaClicks: number;
  whatsappClicks: number;
  phoneClicks: number;
}
