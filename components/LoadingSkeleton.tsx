import React from 'react';

const shimmer = 'bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-[#1e293b] dark:via-[#1a2744] dark:to-[#1e293b] bg-[length:200%_100%] animate-shimmer';

const LoadingSkeleton: React.FC = () => (
  <div className="min-h-screen bg-[#fcfdfe] dark:bg-[#0b1121]">
    <div className="h-16 bg-white dark:bg-[#131d31] border-b border-slate-100 dark:border-[#1e293b]" />

    <div className="max-w-7xl mx-auto px-4 pt-28 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-6">
          <div className={`h-6 w-40 rounded-full ${shimmer}`} />
          <div className={`h-16 w-full rounded-2xl ${shimmer}`} />
          <div className={`h-12 w-3/4 rounded-2xl ${shimmer}`} />
          <div className={`h-6 w-full rounded-xl ${shimmer}`} />
          <div className={`h-6 w-5/6 rounded-xl ${shimmer}`} />
        </div>
        <div className={`h-96 w-full rounded-2xl ${shimmer}`} />
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-4 pb-20">
      <div className="flex items-center justify-center mb-12">
        <div className={`h-6 w-40 rounded-full ${shimmer}`} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => <div key={i} className={`h-24 rounded-2xl ${shimmer}`} />)}
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-4 pb-20">
      <div className="flex items-center justify-center mb-12">
        <div className={`h-10 w-60 rounded-2xl ${shimmer}`} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="space-y-4">
            <div className={`h-60 rounded-2xl ${shimmer}`} />
            <div className={`h-6 w-3/4 rounded-xl ${shimmer}`} />
            <div className={`h-4 w-full rounded-xl ${shimmer}`} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default LoadingSkeleton;
