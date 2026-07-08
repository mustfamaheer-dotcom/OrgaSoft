import React, { useState, useEffect } from 'react';
import { Terminal, Lock, Mail, ArrowRight, Home } from 'lucide-react';
import type { SiteContent } from '../../types';
import { loginWithFirebase, getLoginStatus } from '../../lib/auth';
import logger from '../../lib/logger';

interface AdminLoginProps {
  data: SiteContent;
  onLogin: () => void;
  onNavigate: (page: string) => void;
  lang: 'en' | 'ar';
  isRTL: boolean;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ data, onLogin, onNavigate, lang, isRTL }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lockoutCountdown, setLockoutCountdown] = useState(0);

  useEffect(() => {
    const status = getLoginStatus();
    if (status.locked) {
      setLockoutCountdown(Math.ceil(status.remainingTime / 1000));
    }
  }, []);

  useEffect(() => {
    if (lockoutCountdown <= 0) return;
    const interval = setInterval(() => {
      setLockoutCountdown(prev => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutCountdown]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutCountdown > 0) return;
    setLoginError('');
    setIsSubmitting(true);
    try {
      await loginWithFirebase(username, password);
      logger.log('Admin logged in');
      onLogin();
    } catch (error: any) {
      setLoginError(error.message || (lang === 'ar' ? 'بيانات الدخول غير صحيحة' : 'Invalid credentials'));
      const status = getLoginStatus();
      if (status.locked) {
        setLockoutCountdown(Math.ceil(status.remainingTime / 1000));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`h-screen overflow-hidden flex ${isRTL ? 'font-tajawal' : 'font-inter'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <button onClick={() => onNavigate('home')}
        className={`fixed top-6 ${isRTL ? 'left-6' : 'right-6'} z-50 w-11 h-11 bg-white dark:bg-[#131d31] text-slate-600 dark:text-slate-400 rounded-xl hover:shadow-lg transition-all border border-slate-200 dark:border-[#1e293b] hover:border-slate-300 dark:hover:border-slate-600 flex items-center justify-center group`}
        title={lang === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}>
        <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>

      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0f639e] via-[#1a7abf] to-[#3292ca] p-16 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-10 right-10 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#df4d21]/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-16">
            {data.logoImageUrl ? (
              <img src={data.logoImageUrl} alt="Logo" className="h-16 w-16 object-contain rounded-xl bg-white/10 p-2 backdrop-blur-sm" />
            ) : (
              <div className="h-16 w-16 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Terminal className="w-8 h-8 text-white" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">{data.logo[lang]}</h1>
              <p className="text-blue-200 text-xs font-bold tracking-wider uppercase">
                {lang === 'ar' ? 'نظام الإدارة' : 'Management System'}
              </p>
            </div>
          </div>

          <div className="max-w-lg">
            <h2 className="text-4xl font-black text-white mb-6 leading-tight">
              {lang === 'ar' ? 'مرحباً بك في نظام إدارة أورجا سوفت' : 'Welcome to Orga Soft'}
            </h2>
            <p className="text-blue-100/80 text-lg leading-relaxed font-medium">
              {lang === 'ar'
                ? 'قم بإدارة محتوى موقعك بكل سهولة — تحديث البيانات، إضافة المنتجات، وتعديل الإعدادات من لوحة تحكم واحدة.'
                : 'Manage your site content with ease — update data, add products, and modify settings from a single dashboard.'}
            </p>
          </div>
        </div>

        <div className="relative z-10 flex justify-center">
          <div className="w-72 h-56 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <Terminal className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="h-2.5 bg-white/20 rounded-full w-3/4" />
                <div className="h-2 bg-white/10 rounded-full w-1/2" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="h-16 bg-white/5 rounded-xl" />
              <div className="h-16 bg-white/5 rounded-xl" />
            </div>
            <div className="mt-3 h-8 bg-white/5 rounded-lg w-1/3" />
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-white dark:from-[#0b1121] dark:to-[#0b1121]">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-10">
            {data.logoImageUrl ? (
              <img src={data.logoImageUrl} alt="Logo" className="h-20 w-20 object-contain rounded-2xl shadow-xl border border-slate-100 dark:border-[#1e293b] p-3 bg-white dark:bg-[#131d31] mb-4" />
            ) : (
              <div className="h-20 w-20 bg-gradient-to-br from-[#0f639e] to-[#3292ca] rounded-2xl flex items-center justify-center shadow-xl mb-4">
                <Terminal className="w-10 h-10 text-white" />
              </div>
            )}
            <h1 className="text-xl font-black text-[#0f639e] dark:text-white text-center">{data.companyName[lang]}</h1>
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-1">
              {lang === 'ar' ? 'لوحة التحكم' : 'ADMIN PANEL'}
            </p>
          </div>

          <div className="bg-white dark:bg-[#131d31] rounded-2xl shadow-lg border border-slate-200 dark:border-[#1e293b] p-8">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#0f639e] to-[#3292ca] rounded-xl flex items-center justify-center shadow-lg shadow-[#0f639e]/20 mx-auto mb-4">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-lg font-black text-slate-800 dark:text-white">
                {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1">
                {lang === 'ar' ? 'أدخل بريدك الإلكتروني وكلمة المرور' : 'Enter your email and password'}
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  {lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                    <Mail className="w-4 h-4 text-slate-400" />
                  </div>
                  <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                    className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 rounded-xl border border-slate-200 dark:border-[#1e293b] bg-slate-50 dark:bg-[#0b1121] text-slate-800 dark:text-white outline-none focus:border-[#0f639e] dark:focus:border-[#3292ca] focus:bg-white dark:focus:bg-[#131d31] transition-all text-sm placeholder:text-slate-400/60`}
                    placeholder={lang === 'ar' ? 'أدخل اسم المستخدم' : 'Enter the username'} required autoComplete="email" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  {lang === 'ar' ? 'كلمة المرور' : 'Password'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                    <Lock className="w-4 h-4 text-slate-400" />
                  </div>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                    className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 rounded-xl border border-slate-200 dark:border-[#1e293b] bg-slate-50 dark:bg-[#0b1121] text-slate-800 dark:text-white outline-none focus:border-[#0f639e] dark:focus:border-[#3292ca] focus:bg-white dark:focus:bg-[#131d31] transition-all text-sm placeholder:text-slate-400/60`}
                    placeholder={lang === 'ar' ? 'أدخل كلمة المرور' : 'Enter the Password'} required autoComplete="current-password" />
                </div>
              </div>

              {loginError && (
                <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl px-4 py-3 flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[11px] font-black flex items-center justify-center shrink-0">!</span>
                  <p className="text-red-600 dark:text-red-400 text-xs font-semibold">{loginError}</p>
                </div>
              )}

              <button type="submit" disabled={isSubmitting || lockoutCountdown > 0}
                className="w-full py-3.5 bg-gradient-to-r from-[#0f639e] to-[#3292ca] text-white rounded-xl font-bold text-sm tracking-wide hover:shadow-lg hover:shadow-[#0f639e]/25 hover:-translate-y-0.5 transition-all active:translate-y-0 flex items-center justify-center gap-2.5 disabled:opacity-60">
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : lockoutCountdown > 0 ? (
                  <span>{lang === 'ar' ? `انتظر ${lockoutCountdown}ث` : `Wait ${lockoutCountdown}s`}</span>
                ) : (
                  <><span>{lang === 'ar' ? 'دخول' : 'Sign In'}</span><ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
