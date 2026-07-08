import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSite } from '../context/SiteContext';
import { ChevronLeft, ChevronRight, CheckCircle2, PhoneCall, MessageCircle, Zap, PlayCircle, Grid3X3, Handshake, ExternalLink } from 'lucide-react';
import KitImage from '../components/KitImage';

interface ProductDetailProps {
  productId: string;
  onBack: () => void;
  onContact: () => void;
  onNavigate: (page: string) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId, onBack, onNavigate }) => {
  const { lang, siteData, isRTL } = useSite();
  const product = siteData.products.find(p => p.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfdfe] dark:bg-[#0b1121]">
        <div className="text-center">
          <div className="w-20 h-20 bg-slate-100 dark:bg-[#1e293b] rounded-[2rem] flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🔍</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-4">{lang === 'ar' ? 'المنتج غير موجود' : 'Product Not Found'}</h2>
          <button onClick={onBack} className="text-[#0f639e] dark:text-[#3292ca] font-black uppercase tracking-widest text-sm underline">{lang === 'ar' ? 'العودة للرئيسية' : 'Back to Terminal'}</button>
        </div>
      </div>
    );
  }

  const supportPhone = product.supportPhone || siteData.contacts.phoneSupport;
  const supportWhatsapp = product.supportWhatsapp || siteData.contacts.whatsapp;

  const handleWhatsApp = (msg: string) => {
    window.open(`https://wa.me/${supportWhatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const orderMsg = lang === 'ar'
    ? `السلام عليكم، أرغب في طلب برنامج: ${product.name[lang]}`
    : `Hello, I would like to order: ${product.name[lang]}`;

  const supportMsg = lang === 'ar'
    ? `السلام عليكم، أحتاج دعماً فنياً لـ: ${product.name[lang]}`
    : `Hello, I need technical support for: ${product.name[lang]}`;

  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const descLines = product.longDescription[lang].split('\n');
  const isLongDesc = descLines.length > 6;
  const displayLines = isLongDesc ? descLines.slice(0, 6) : descLines;

  return (
    <div className="bg-[#fcfdfe] dark:bg-[#0b1121] min-h-screen">
      <Helmet>
        <title>{product.name[lang]} | Orga Soft</title>
        <meta property="og:title" content={`${product.name[lang]} | Orga Soft`} />
        <meta property="og:description" content={product.description[lang]} />
        <meta property="og:image" content={product.image || siteData.logoImageUrl || 'https://ik.imagekit.io/y2t2putyl/orgasoft/ORGANEWLOGOtbg.png'} />
      </Helmet>
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-[#0b1121]/80 backdrop-blur-md border-b border-slate-100 dark:border-[#1e293b]">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-12 sm:h-14">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-[#0f639e] dark:hover:text-[#3292ca] font-bold text-sm transition-colors py-2 -my-2 active:scale-95"
            >
              {isRTL ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
              <span className="uppercase tracking-widest text-xs">{lang === 'ar' ? 'العودة' : 'Back'}</span>
            </button>
            <button
              onClick={() => onNavigate('all-applications')}
              className="flex items-center gap-2 px-3 py-2.5 bg-[#0f639e]/10 hover:bg-[#0f639e]/20 text-[#0f639e] dark:text-[#3292ca] font-bold text-xs uppercase tracking-widest rounded-xl transition-all active:scale-95"
            >
              <Grid3X3 className="w-4 h-4" />
              <span>{lang === 'ar' ? 'المجموعة البرمجية' : 'Software Suite'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 lg:px-6 pt-4 sm:pt-8 pb-6 sm:pb-10">
        {product.bannerImage?.[lang] ? (
          <div className="rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#1e293b] shadow-lg w-full mb-6 sm:mb-8" style={{ maxHeight: 400 }}>
            <KitImage
              src={product.bannerImage[lang]}
              alt={product.name[lang]}
              className="w-full h-full object-cover"
              width={1152}
              height={460}
            />
          </div>
        ) : (
          <div className="rounded-2xl bg-gradient-to-br from-[#0f639e] to-[#3292ca] flex items-center justify-center w-full mb-6 sm:mb-8" style={{ height: 400 }}>
            <span className="text-white/20 font-black text-6xl">{product.name[lang]?.charAt(0) || 'P'}</span>
          </div>
        )}

        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent via-[#df4d21]/30 to-transparent"></div>
          <div className="flex gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#df4d21]/40"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#0f639e]/40"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#df4d21]/40"></div>
          </div>
          <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent via-[#df4d21]/30 to-transparent"></div>
        </div>

        <div className="mb-8 sm:mb-12">
        <div className="bg-white dark:bg-[#131d31] rounded-2xl overflow-hidden shadow-md border border-slate-100 dark:border-[#1e293b]">
          <div className="flex flex-col lg:flex-row">
            <div className="aspect-[480/462.8] lg:w-[480px] shrink-0 bg-slate-50 dark:bg-[#1a2744]">
              {product.image ? (
                <div className="w-full h-full">
                  <KitImage
                    src={product.image}
                    alt={product.name[lang]}
                    className="w-full h-full object-cover"
                    width={480}
                    height={463}
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <Grid3X3 className="w-16 h-16 text-slate-300 dark:text-slate-500" />
                </div>
              )}
            </div>

            <div className="flex flex-col flex-1 p-4 sm:p-6 lg:p-10">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="h-[3px] w-6 sm:w-10 bg-[#df4d21] rounded-full"></div>
                <span className="text-[#df4d21] font-black text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em]">
                  {lang === 'ar' ? 'حل متكامل' : 'Enterprise Solution'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0f639e] dark:text-white mb-3 sm:mb-4 leading-tight tracking-tight">
                {product.name[lang]}
              </h1>
              <div className="flex-1 text-slate-600 dark:text-slate-400 font-medium leading-[1.8] space-y-3 text-xs sm:text-sm">
                {displayLines.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
                {isLongDesc && (
                  <button
                    onClick={() => setShowDescriptionModal(true)}
                    className="text-[#df4d21] font-black text-xs uppercase tracking-widest hover:underline mt-1 py-1.5 -my-1.5"
                  >
                    {lang === 'ar' ? '...عرض المزيد' : '...Read More'}
                  </button>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-auto pt-4">
                {product.demoUrl && (
                  <a
                    href={product.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] sm:px-6 sm:py-3.5 bg-gradient-to-r from-[#df4d21] to-[#0f639e] text-white font-black rounded-xl text-xs uppercase tracking-widest shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-[0.97]"
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'نسخه تجريبيه' : 'Live Demo'}</span>
                  </a>
                )}
                <button
                  onClick={() => handleWhatsApp(orderMsg)}
                  className="flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] sm:px-6 sm:py-3.5 bg-[#25D366] hover:bg-[#20BA5A] text-white font-black rounded-xl text-xs uppercase tracking-widest hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-[0.97]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{siteData.uiStrings.ctaRequest[lang]}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 lg:px-6 pb-16 sm:pb-20 space-y-6 sm:space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {(product.specs && product.specs.length > 0) && (
            <div className="bg-white dark:bg-[#131d31] rounded-2xl p-4 sm:p-6 lg:p-8 shadow-md border border-slate-100 dark:border-[#1e293b]">
              <div className="flex items-center gap-3 mb-5 sm:mb-6 lg:mb-8">
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-[#0f639e]/10 rounded-xl flex items-center justify-center shrink-0">
                  <Zap className="w-5 sm:w-6 h-5 sm:h-6 text-[#0f639e]" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-xl font-black text-[#0f639e] dark:text-white">{lang === 'ar' ? 'المواصفات الفنية' : 'Technical Specs'}</h3>
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{lang === 'ar' ? 'بيانات تقنية مفصلة' : 'Detailed technical data'}</p>
                </div>
              </div>
              <div className="space-y-3">
                {product.specs.map((spec, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 p-3 sm:p-4 bg-slate-50 dark:bg-[#1a2744] rounded-xl border border-slate-100 dark:border-[#1e293b]">
                    <span className="font-bold text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-tight">{spec.key[lang]}</span>
                    <span className="font-black text-[#0f639e] dark:text-white text-xs sm:text-sm text-right shrink-0 max-w-[50%]">{spec.value[lang]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {product.keyFeatures && product.keyFeatures.length > 0 && (
            <div className="bg-white dark:bg-[#131d31] rounded-2xl p-4 sm:p-6 lg:p-8 shadow-md border border-slate-100 dark:border-[#1e293b]">
              <div className="flex items-center gap-3 mb-5 sm:mb-6 lg:mb-8">
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-[#df4d21]/10 rounded-xl flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 sm:w-6 h-5 sm:h-6 text-[#df4d21]" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-xl font-black text-[#0f639e] dark:text-white">{lang === 'ar' ? 'مميزات البرنامج' : 'Key Features'}</h3>
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{lang === 'ar' ? 'ما يميز هذا النظام' : 'What makes this solution stand out'}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.keyFeatures.map((feature) => (
                  <div key={feature.id} className={`flex items-center gap-3 p-3 sm:p-5 bg-slate-50 dark:bg-[#1a2744] rounded-xl border border-slate-100 dark:border-[#1e293b] hover:border-[#df4d21]/20 hover:shadow-md transition-all group ${isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
                    <div className="w-9 sm:w-10 h-9 sm:h-10 bg-white dark:bg-[#131d31] rounded-xl flex items-center justify-center text-[#df4d21] group-hover:bg-[#df4d21] group-hover:text-white transition-all shrink-0 shadow-sm">
                      <CheckCircle2 className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
                    </div>
                    <span className="text-slate-900 dark:text-slate-100 font-bold text-xs sm:text-sm leading-snug">{feature.text[lang]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-[#0f639e] p-4 sm:p-6 lg:p-8 rounded-2xl text-white shadow-md overflow-hidden relative">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 dark:bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5 sm:mb-8">
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center border border-white/10 shrink-0">
                  <PhoneCall className="w-5 sm:w-6 h-5 sm:h-6 text-[#df4d21]" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm sm:text-xl font-black">{lang === 'ar' ? 'دعم المنتج' : 'Product Support'}</h4>
                  <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
                    {lang === 'ar' ? `فريق دعم متخصص لـ ${product.name.ar}` : `Dedicated support team for ${product.name.en}`}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                  <PhoneCall className="w-4 h-4 text-[#df4d21] shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[9px] font-bold text-white/70 uppercase tracking-wider">{lang === 'ar' ? 'رقم الدعم' : 'Support Line'}</div>
                    <div className="font-black text-xs sm:text-sm truncate" dir="ltr">{supportPhone}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleWhatsApp(supportMsg)}
                  className="flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] sm:px-5 sm:py-3 bg-[#df4d21] hover:bg-[#aa4832] text-white font-black rounded-xl text-xs uppercase tracking-widest transition-all active:scale-[0.97]"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>{lang === 'ar' ? 'دعم واتساب' : 'WhatsApp Support'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {product.productPartners && product.productPartners.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 lg:px-6 pb-16 sm:pb-20 -mt-6 sm:-mt-10">
          <div className="bg-white dark:bg-[#131d31] rounded-2xl p-4 sm:p-6 lg:p-8 shadow-md border border-slate-100 dark:border-[#1e293b]">
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-[#0f639e]/10 rounded-xl flex items-center justify-center shrink-0">
                <Handshake className="w-5 sm:w-6 h-5 sm:h-6 text-[#0f639e]" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-xl font-black text-[#0f639e] dark:text-white">{lang === 'ar' ? 'شركاء النجاح' : 'Success Partners'}</h3>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{lang === 'ar' ? 'شركاء النجاح' : 'Trusted collaborators'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {product.productPartners.map((partner) => (
                <div key={partner.id} className="group p-5 sm:p-6 bg-white dark:bg-[#1a2744] rounded-xl border border-slate-200 dark:border-[#1e293b] hover:border-[#0f639e]/30 hover:bg-[#0f639e] hover:-translate-y-1 transition-all duration-200 shadow-sm hover:shadow-lg flex flex-col items-center gap-3">
                  {partner.logo ? (
                    <img src={partner.logo} alt={partner.name[lang]} className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-xl bg-slate-50 dark:bg-[#131d31] p-2" loading="lazy"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-100 dark:bg-[#131d31] rounded-xl flex items-center justify-center text-[#df4d21] group-hover:bg-[#df4d21] group-hover:text-white transition-all">
                      <Handshake className="w-8 h-8 sm:w-10 sm:h-10" />
                    </div>
                  )}
                  <span className="text-center text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 group-hover:text-white transition-colors">{partner.name[lang]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showDescriptionModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
          onClick={() => setShowDescriptionModal(false)}
        >
          <div
            className="bg-white dark:bg-[#131d31] rounded-t-2xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] sm:max-h-[80vh] overflow-y-auto p-4 sm:p-6 lg:p-8"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'slideUp 0.25s ease-out' }}
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
              <h3 className="text-base sm:text-xl font-black text-[#0f639e] dark:text-white truncate">{product.name[lang]}</h3>
              <button
                onClick={() => setShowDescriptionModal(false)}
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:hover:bg-[#1a2744] flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold transition-colors shrink-0 active:scale-90"
              >
                <span className="text-sm">✕</span>
              </button>
            </div>
            <div className="text-slate-600 dark:text-slate-400 font-medium leading-[1.8] space-y-3 text-sm">
              {descLines.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
