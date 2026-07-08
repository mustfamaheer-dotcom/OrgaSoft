import React, { useState, useEffect, lazy, Suspense } from 'react';
import { HashRouter, useNavigate, useLocation } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { SiteProvider, useSite } from './context/SiteContext';
import ErrorBoundary from './lib/ErrorBoundary';
import Navbar from './components/Navbar';
import Home from './views/Home';
import NotFound from './views/NotFound';
import LoadingSkeleton from './components/LoadingSkeleton';
import CookieConsent from './components/CookieConsent';
import Footer from './components/Footer';
import { ArrowUp } from 'lucide-react';

const AdminDashboard = lazy(() => import('./views/AdminDashboard'));
const ProductDetail = lazy(() => import('./views/ProductDetail'));
const AllProducts = lazy(() => import('./views/AllProducts'));

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > 400);
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  return (
    <div className={`fixed bottom-4 right-4 xs:bottom-6 xs:right-6 sm:bottom-10 sm:right-10 z-[100] transition-all duration-500 transform ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
    }`}>
      <button onClick={scrollToTop}
        className="w-11 h-11 xs:w-11 xs:h-11 sm:w-14 sm:h-14 bg-[#0f639e] dark:bg-[#df4d21] text-white rounded-xl sm:rounded-2xl shadow-2xl flex items-center justify-center hover:bg-[#df4d21] dark:hover:bg-[#0f639e] transition-all duration-300 hover:-translate-y-2 group border border-white/10 active:scale-90">
        <ArrowUp className="w-5 h-5 xs:w-5 xs:h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" />
      </button>
    </div>
  );
};

const LoadingScreen: React.FC = () => <LoadingSkeleton />;

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState('home');
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const { isRTL, lang, siteData } = useSite();

  const handleNavigate = (page: string) => {
    if (page.startsWith('product-')) {
      const id = page.replace('product-', '');
      setActiveProductId(id);
      setCurrentPage('product-detail');
      navigate(`/product/${id}`);
      window.scrollTo(0, 0);
    } else if (page === 'admin') {
      navigate('/admin');
      setCurrentPage('admin');
      setActiveProductId(null);
      window.scrollTo(0, 0);
    } else if (page === 'all-applications') {
      navigate('/applications');
      setCurrentPage('all-applications');
      setActiveProductId(null);
      window.scrollTo(0, 0);
    } else if (page === 'home') {
      navigate('/');
      setCurrentPage('home');
      setActiveProductId(null);
      window.scrollTo(0, 0);
    } else {
      navigate('/');
      setCurrentPage('home');
      setActiveProductId(null);
      setTimeout(() => {
        const el = document.getElementById(page);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const path = location.pathname;
    if (path === '/admin') { setCurrentPage('admin'); }
    else if (path === '/applications') { setCurrentPage('all-applications'); setActiveProductId(null); }
    else if (path.startsWith('/product/')) {
      setActiveProductId(path.replace('/product/', ''));
      setCurrentPage('product-detail');
    } else if (path === '/' || path === '') { setCurrentPage('home'); setActiveProductId(null); }
    else { setCurrentPage('not-found'); setActiveProductId(null); }
  }, [location.pathname]);

  const isAdmin = currentPage === 'admin';
  const product = currentPage === 'product-detail' && activeProductId
    ? siteData.products.find(p => p.id === activeProductId) : null;
  const pageTitle = isAdmin ? 'Admin Console | Orga Soft'
    : currentPage === 'all-applications' ? (lang === 'ar' ? 'جميع التطبيقات | أورجا سوفت' : 'All Applications | Orga Soft')
    : product ? `${product.name[lang]} | Orga Soft`
    : 'Orga Soft | أورجا سوفت';

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={siteData.hero.subtitle[lang]} />
        <meta property="og:image" content={siteData.logoImageUrl || 'https://ik.imagekit.io/y2t2putyl/orgasoft/ORGANEWLOGOtbg.png'} />
        <link rel="icon" type="image/png" href={siteData.favicon || siteData.logoImageUrl || 'https://ik.imagekit.io/y2t2putyl/orgasoft/ORGANEWLOGOtbg.png'} />
      </Helmet>
      <div className={`min-h-screen bg-[#fcfdfe] dark:bg-[#0b1121] text-[#0f172a] dark:text-[#f1f5f9] transition-colors duration-200 selection:bg-[#df4d21] selection:text-white ${isRTL ? 'font-tajawal break-words' : 'font-inter'}`}>
        {!isAdmin && <Navbar onNavigate={handleNavigate} />}
        <main className="relative">
          {currentPage === 'home' && <Home onNavigate={handleNavigate} />}
          {currentPage === 'all-applications' && (
            <Suspense fallback={<LoadingScreen />}>
              <AllProducts onNavigate={handleNavigate} />
            </Suspense>
          )}
          {currentPage === 'admin' && (
            <Suspense fallback={<LoadingScreen />}>
              <AdminDashboard onNavigate={handleNavigate} />
            </Suspense>
          )}
          {currentPage === 'product-detail' && activeProductId && (
            <Suspense fallback={<LoadingScreen />}>
              <ProductDetail productId={activeProductId} onBack={() => handleNavigate('home')} onContact={() => handleNavigate('contact')} onNavigate={handleNavigate} />
            </Suspense>
          )}
          {currentPage === 'not-found' && <NotFound onNavigate={handleNavigate} />}
        </main>
        {!isAdmin && <Footer onNavigate={handleNavigate} />}
        {!isAdmin && <ScrollToTop />}
        {!isAdmin && <CookieConsent />}
      </div>
    </>
  );
};

const App: React.FC = () => (
  <HelmetProvider>
    <ErrorBoundary>
      <HashRouter>
        <SiteProvider>
          <AppContent />
        </SiteProvider>
        </HashRouter>
    </ErrorBoundary>
  </HelmetProvider>
);

export default App;
