import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => (
  <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#0b1121] dark:to-[#131d31]">
    <div className="text-center max-w-md">
      <div className="w-24 h-24 mx-auto mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#df4d21]/20 to-[#0f639e]/20 rounded-full blur-2xl" />
        <div className="relative w-full h-full bg-white dark:bg-[#131d31] rounded-[2rem] shadow-xl border border-slate-200 dark:border-[#1e293b] flex items-center justify-center">
          <span className="text-5xl font-black text-[#df4d21]">404</span>
        </div>
      </div>
      <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-3">Page Not Found</h1>
      <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button onClick={() => onNavigate('home')}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0f639e] text-white rounded-xl font-bold text-sm hover:bg-[#0f639e]/90 transition-all shadow-lg shadow-[#0f639e]/20">
          <Home className="w-4 h-4" />
          Back to Home
        </button>
        <button onClick={() => window.history.back()}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-[#131d31] text-slate-600 dark:text-slate-400 rounded-xl font-bold text-sm border border-slate-200 dark:border-[#1e293b] hover:border-slate-300 dark:hover:border-slate-600 transition-all">
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
      </div>
    </div>
  </div>
);

export default NotFound;
