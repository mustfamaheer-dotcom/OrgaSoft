import React, { useCallback, useState } from 'react';
import { useSite } from '../context/SiteContext';
import { MoveRight, MoveLeft, Grid3X3, PlayCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import KitImage from '../components/KitImage';
import type { Product } from '../types';

const ITEMS_PER_PAGE = 6;

const TiltCard: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className, onClick }) => {
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -8;
    const rotateY = ((x - cx) / cx) * 8;
    const inner = card.querySelector('.tilt-inner') as HTMLElement;
    if (inner) inner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
  }, []);
  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const inner = e.currentTarget.querySelector('.tilt-inner') as HTMLElement;
    if (inner) inner.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)';
  }, []);
  return (
    <div className={className} onClick={onClick} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      {children}
    </div>
  );
};

const AllProducts: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { lang, siteData, isRTL } = useSite();
  const [currentPage, setCurrentPage] = useState(0);

  const products = siteData.products || [];
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIdx = currentPage * ITEMS_PER_PAGE;
  const pageProducts = products.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const prevPage = () => setCurrentPage(p => Math.max(0, p - 1));
  const nextPage = () => setCurrentPage(p => Math.min(totalPages - 1, p + 1));

  const renderProduct = (product: Product) => (
    <TiltCard
      key={product.id}
      onClick={() => onNavigate(`product-${product.id}`)}
      className="group bg-white dark:bg-[#131d31] rounded-2xl overflow-hidden border border-slate-100 dark:border-[#1e293b] hover:border-[#df4d21]/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 sm:h-[580px] flex flex-col cursor-pointer active:scale-[0.98]"
    >
      <div className="tilt-inner flex flex-col h-full">
        <div className="relative w-full aspect-[480/462.8] shrink-0 overflow-hidden bg-slate-100 dark:bg-[#1e293b]">
          {product.image ? (
            <KitImage src={product.image} alt={product.name[lang]} className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500" width={480} height={463} />
          ) : (
            <div className="w-full h-full flex items-center justify-center"><Grid3X3 className="w-12 h-12 text-slate-300 dark:text-slate-500" /></div>
          )}
          {product.showOnHome !== false && (
            <div className="absolute top-3 right-3 px-2.5 py-1 bg-[#df4d21]/90 backdrop-blur-sm rounded-full text-white text-[8px] font-black uppercase tracking-widest">
              FEATURED
            </div>
          )}
        </div>
      </div>
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <h3 className="text-base sm:text-lg font-black text-[#0f639e] dark:text-white mb-2 group-hover:text-[#df4d21] transition-colors">{product.name[lang]}</h3>
        <p className="text-slate-600 dark:text-slate-400 font-medium text-xs sm:text-sm leading-relaxed line-clamp-2 mb-3">{product.description[lang]}</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {(product.keyFeatures || []).slice(0, 2).map((kf, i) => (
            <span key={i} className="px-3 py-1.5 bg-slate-100 dark:bg-[#1e293b] rounded-full text-xs font-semibold text-slate-600 dark:text-slate-400">{kf.text[lang]}</span>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-auto">
          <div className={`flex items-center gap-1.5 text-[#df4d21] font-bold uppercase tracking-[0.15em] text-xs ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <span>{lang === 'ar' ? 'استكشاف' : 'Explore'}</span>
            {isRTL ? <MoveLeft className="w-3.5 h-3.5" /> : <MoveRight className="w-3.5 h-3.5" />}
          </div>
          {product.demoUrl && (
            <a
              href={product.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="mr-auto flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#df4d21] to-[#0f639e] text-white font-bold text-xs uppercase tracking-widest rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95"
            >
              <PlayCircle className="w-4 h-4" />
              <span>{lang === 'ar' ? 'نسخه تجريبيه' : 'Demo'}</span>
            </a>
          )}
        </div>
      </div>
    </TiltCard>
  );

  return (
    <div className="min-h-screen bg-[#fcfdfe] dark:bg-[#0b1121] pt-20 sm:pt-24 pb-16 sm:pb-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 sm:mb-8">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-2.5 bg-white dark:bg-[#131d31] rounded-xl sm:rounded-2xl text-slate-500 dark:text-slate-400 hover:text-[#0f639e] dark:hover:text-[#3292ca] font-bold text-xs uppercase tracking-widest shadow-sm dark:shadow-[0_1px_2px_0_rgba(0,0,0,0.3)] border border-slate-100 dark:border-[#1e293b] hover:shadow-md transition-all shrink-0 active:scale-95"
          >
            {isRTL ? <MoveRight className="w-4 h-4" /> : <MoveLeft className="w-4 h-4" />}
            {lang === 'ar' ? 'العودة' : 'Back'}
          </button>
          <div className="text-right max-w-full">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0f639e] dark:text-white tracking-tight">
              {lang === 'ar' ? 'جميع التطبيقات' : 'All Applications'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-xs sm:text-sm mt-0.5">
              {lang === 'ar' ? `${products.length} تطبيق متكامل` : `${products.length} integrated solutions`}
            </p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <Grid3X3 className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 font-bold text-sm">
              {lang === 'ar' ? 'لا توجد تطبيقات بعد' : 'No applications yet'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {pageProducts.map(renderProduct)}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-10 sm:mt-12">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className="w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-[#131d31] border border-slate-100 dark:border-[#1e293b] text-slate-500 dark:text-slate-400 hover:text-[#0f639e] dark:hover:text-[#3292ca] hover:border-[#0f639e]/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm active:scale-90"
                >
                  {isRTL ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                        i === currentPage
                          ? 'bg-[#0f639e] dark:bg-[#3292ca] w-6'
                          : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages - 1}
                  className="w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-[#131d31] border border-slate-100 dark:border-[#1e293b] text-slate-500 dark:text-slate-400 hover:text-[#0f639e] dark:hover:text-[#3292ca] hover:border-[#0f639e]/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm active:scale-90"
                >
                  {isRTL ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </button>
              </div>
            )}
          </>
        )}

        <div className="text-center mt-12 sm:mt-16">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-3 px-6 py-3.5 sm:px-8 sm:py-4 bg-[#0f639e] text-white rounded-[2rem] font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-[#0f639e]/80 shadow-xl transition-all active:scale-95"
          >
            <Grid3X3 className="w-5 h-5" />
            <span>{lang === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
