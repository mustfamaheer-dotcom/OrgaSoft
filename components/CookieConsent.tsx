import React, { useState, useEffect } from 'react';

const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('orgasoft_cookies_accepted');
    if (!accepted) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem('orgasoft_cookies_accepted', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-[200] w-[94%] xs:w-[92%] sm:w-[90%] max-w-lg animate-slide-up">
      <div className="bg-white dark:bg-[#131d31] rounded-2xl sm:rounded-2xl shadow-2xl border border-slate-100 dark:border-[#1e293b] p-4 sm:p-6 backdrop-blur-xl">
        <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mb-3 sm:mb-4 leading-relaxed">
          This website uses cookies to ensure you get the best experience.{' '}
          <a href="#" className="text-[#0f639e] dark:text-[#3292ca] font-bold hover:underline">Learn more</a>
        </p>
        <button onClick={accept}
          className="w-full py-3 sm:py-3 bg-gradient-to-r from-[#0f639e] to-[#3292ca] text-white font-black rounded-xl text-xs sm:text-xs uppercase tracking-widest hover:shadow-lg transition-all active:scale-95">
          Accept All Cookies
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
