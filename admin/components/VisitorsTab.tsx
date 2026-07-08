import React, { useEffect, useState, useCallback } from 'react';
import { collection, getDocs, query, orderBy, limit, startAfter, addDoc, serverTimestamp, writeBatch, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Eye, MousePointerClick, Smartphone, BarChart3, MessageCircle, Phone, Loader2, Play, Activity, TrendingUp, ArrowUpRight, Zap, Target, TrendingDown, Layers, Trash2, AlertTriangle } from 'lucide-react';
import type { VisitorEvent, Product, Language } from '../../types';
import { SectionHeader } from './FormComponents';
import { VisitorsLineChart, TopPagesRanking, DevicePieChart } from './VisitorsCharts';

interface VisitorsTabProps { isRTL: boolean; products: Product[]; lang: Language }

const PAGE_SIZE = 5000;

const metricCard = 'relative overflow-hidden p-5 bg-white dark:bg-[#131d31] rounded-2xl border border-slate-100 dark:border-[#1e293b] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200';
const metricValue = 'text-3xl sm:text-4xl font-black tracking-tight';
const metricLabel = 'text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em]';
const cardTitle = 'text-sm font-black text-[#0f639e] dark:text-white tracking-tight flex items-center gap-2';

const VisitorsTab: React.FC<VisitorsTabProps> = ({ isRTL, products, lang }) => {
  const [events, setEvents] = useState<VisitorEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [daysFilter, setDaysFilter] = useState(7);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleResetAll = async () => {
    if (!resetConfirm) { setResetConfirm(true); return; }
    setResetting(true);
    try {
      const col = collection(db, 'visitorEvents');
      let docs = (await getDocs(query(col, limit(500)))).docs;
      while (docs.length > 0) {
        const batch = writeBatch(db);
        docs.forEach(d => batch.delete(doc(db, 'visitorEvents', d.id)));
        await batch.commit();
        if (docs.length < 500) break;
        docs = (await getDocs(query(col, limit(500)))).docs;
      }
      setEvents([]);
      setResetConfirm(false);
      setLastDoc(null);
      setHasMore(true);
      setRefreshKey(k => k + 1);
    } catch { setResetting(false); setResetConfirm(false); }
    setResetting(false);
  };

  const writeTestEvent = async () => {
    setTestStatus('writing...');
    try {
      const col = collection(db, 'visitorEvents');
      await addDoc(col, {
        timestamp: new Date().toISOString(), page: 'admin-test', referrer: 'direct',
        userAgent: navigator.userAgent, language: document.documentElement.lang || 'ar',
        sessionId: 'test-' + Date.now(), eventType: 'pageview', deviceType: 'desktop',
        createdAt: serverTimestamp(),
      });
      setTestStatus('success!');
      fetchEvents(false);
    } catch { setTestStatus('failed'); }
  };

  const fetchEvents = useCallback(async (loadMore = false) => {
    if (loadMore) setLoadingMore(true); else setLoading(true);
    try {
      const q = loadMore && lastDoc
        ? query(collection(db, 'visitorEvents'), orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(PAGE_SIZE))
        : query(collection(db, 'visitorEvents'), orderBy('createdAt', 'desc'), limit(PAGE_SIZE));
      const snap = await getDocs(q);
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as VisitorEvent));
      const since = new Date(); since.setDate(since.getDate() - daysFilter);
      const filtered = items.filter(e => {
        const ts: any = e.createdAt || e.timestamp;
        if (ts?.toDate) return ts.toDate() >= since;
        if (typeof ts === 'string') return new Date(ts) >= since;
        return false;
      });
      if (loadMore) setEvents(prev => [...prev, ...filtered]); else setEvents(filtered);
      setLastDoc(snap.docs[snap.docs.length - 1] || null);
      setHasMore(snap.docs.length === PAGE_SIZE);
    } catch { setEvents([]); }
    setLoading(false); setLoadingMore(false);
  }, [daysFilter, lastDoc]);

  useEffect(() => { setLastDoc(null); fetchEvents(false); }, [daysFilter, refreshKey]);

  const publicEvents = events.filter(e => !e.page.startsWith('admin'));

  const totalPageViews = publicEvents.filter(e => e.eventType === 'pageview').length;
  const uniqueSessions = new Set(publicEvents.map(e => e.sessionId)).size;
  const ctaClicks = publicEvents.filter(e => e.eventType === 'cta_click').length;
  const whatsappClicks = publicEvents.filter(e => e.eventType === 'whatsapp_click').length;
  const phoneClicks = publicEvents.filter(e => e.eventType === 'phone_click').length;

  const deviceCounts = publicEvents.reduce<Record<string, number>>((acc, e) => {
    if (e.deviceType) acc[e.deviceType] = (acc[e.deviceType] || 0) + 1; return acc;
  }, {});
  const deviceData = Object.entries(deviceCounts).map(([device, count]) => ({ device, count }));

  const pageCounts = publicEvents.filter(e => e.eventType === 'pageview')
    .reduce<Record<string, number>>((acc, e) => { acc[e.page] = (acc[e.page] || 0) + 1; return acc; }, {});
  const topPages = Object.entries(pageCounts).map(([page, views]) => {
    if (page.startsWith('product:')) {
      const productId = page.replace('product:', '');
      const product = products.find(p => p.id === productId);
      if (product) return { page: product.name[lang] || product.name.en, views };
    }
    return { page, views };
  });

  const hourMap = publicEvents.filter(e => e.eventType === 'pageview')
    .reduce<Record<string, { pageviews: number; visitors: Set<string> }>>((acc, e) => {
      const hour = e.timestamp?.slice(11, 13) || '00';
      if (!acc[hour]) acc[hour] = { pageviews: 0, visitors: new Set() };
      acc[hour].pageviews++; acc[hour].visitors.add(e.sessionId); return acc;
    }, {});
  const to12Hour = (h: number) => {
    if (h === 0) return '12AM';
    if (h < 12) return `${h}AM`;
    if (h === 12) return '12PM';
    return `${h - 12}PM`;
  };
  const chartData = Array.from({ length: 24 }, (_, i) => {
    const h = String(i).padStart(2, '0');
    const d = hourMap[h] || { pageviews: 0, visitors: new Set() };
    return { date: to12Hour(i), hour: i, pageviews: d.pageviews, visitors: d.visitors.size };
  });
  const peakHour = [...chartData].sort((a, b) => b.visitors - a.visitors)[0];

  const totalActions = ctaClicks + whatsappClicks + phoneClicks;
  const conversionRate = totalPageViews > 0 ? (totalActions / totalPageViews * 100) : 0;
  const sessionsWithAction = new Set(publicEvents.filter(e => e.eventType !== 'pageview').map(e => e.sessionId));
  const engagementRate = uniqueSessions > 0 ? (sessionsWithAction.size / uniqueSessions * 100) : 0;
  const pagesPerSession = uniqueSessions > 0 ? (totalPageViews / uniqueSessions) : 0;

  const sessionPageCounts = publicEvents.filter(e => e.eventType === 'pageview')
    .reduce<Record<string, number>>((acc, e) => { acc[e.sessionId] = (acc[e.sessionId] || 0) + 1; return acc; }, {});
  const bounceSessions = Object.values(sessionPageCounts).filter(c => c === 1).length;
  const engagedSessions = Object.values(sessionPageCounts).filter(c => c >= 2 && c <= 4).length;
  const superEngagedSessions = Object.values(sessionPageCounts).filter(c => c >= 5).length;

  const halfPoint = new Date();
  halfPoint.setDate(halfPoint.getDate() - Math.floor(daysFilter / 2));
  const firstHalfCount = publicEvents.filter(e => {
    const ts: any = e.createdAt || e.timestamp;
    if (ts?.toDate) return ts.toDate() < halfPoint;
    if (typeof ts === 'string') return new Date(ts) < halfPoint;
    return false;
  }).length;
  const secondHalfCount = publicEvents.length - firstHalfCount;
  const growth = firstHalfCount > 0 ? ((secondHalfCount - firstHalfCount) / firstHalfCount * 100) : 0;

  const pageActions = publicEvents.filter(e => e.eventType !== 'pageview')
    .reduce<Record<string, number>>((acc, e) => { acc[e.page] = (acc[e.page] || 0) + 1; return acc; }, {});
  const convertingPages = Object.entries(pageActions).map(([page, count]) => {
    if (page.startsWith('product:')) {
      const productId = page.replace('product:', '');
      const product = products.find(p => p.id === productId);
      if (product) return { page: product.name[lang] || product.name.en, count };
    }
    return { page, count };
  }).sort((a, b) => b.count - a.count).slice(0, 8);

  return (
    <div className="space-y-8">
      <SectionHeader icon={BarChart3} title={isRTL ? 'زوار الموقع' : 'Site Visitors'} subtitle="Real-time analytics and visitor insights" isRTL={isRTL} />

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1.5 bg-slate-50 dark:bg-[#1a2744] p-1 rounded-xl">
          {[1, 7, 14, 30].map(d => (
            <button key={d} onClick={() => setDaysFilter(d)}
              className={`px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all ${daysFilter === d ? 'bg-white dark:bg-[#131d31] text-[#0f639e] shadow-sm' : 'text-slate-400 hover:text-[#0f639e]'}`}>
              {isRTL ? (d === 1 ? '24 ساعة' : `${d} أيام`) : (d === 1 ? '24H' : `${d}D`)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={writeTestEvent} disabled={testStatus === 'writing...'}
            className="flex items-center gap-2 px-4 py-2 bg-[#0f639e]/10 text-[#0f639e] rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-[#0f639e] hover:text-white transition-all disabled:opacity-50">
            {testStatus === 'writing...' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
            {isRTL ? 'اختبار' : 'TEST WRITE'}
          </button>
          {testStatus && testStatus !== 'writing...' && (
            <span className={`text-[10px] font-bold ${testStatus === 'success!' ? 'text-emerald-500' : 'text-rose-500'}`}>
              {testStatus === 'success!' ? (isRTL ? 'تم بنجاح ✓' : '✓ Success') : (isRTL ? 'فشل ✗' : '✗ Failed')}
            </span>
          )}
        </div>
        <div className="mr-auto" />
        <button onClick={handleResetAll} disabled={resetting || events.length === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all ${resetConfirm
            ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 animate-pulse'
            : 'bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white'} disabled:opacity-30 disabled:animate-none`}
          title={resetConfirm ? (isRTL ? 'انقر مرة أخرى للتأكيد' : 'Click again to confirm') : ''}>
          {resetting ? <Loader2 className="w-3 h-3 animate-spin" /> : resetConfirm ? <AlertTriangle className="w-3 h-3" /> : <Trash2 className="w-3 h-3" />}
          {resetConfirm ? (isRTL ? 'تأكيد الحذف' : 'CONFIRM') : (isRTL ? 'إعادة تعيين الإحصائيات' : 'RESET STATS')}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-[3px] border-[#0f639e] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{isRTL ? 'جاري التحميل...' : 'LOADING...'}</span>
          </div>
        </div>
      ) : publicEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-20 h-20 bg-slate-100 dark:bg-[#1a2744] rounded-[2rem] flex items-center justify-center mb-6">
            <Activity className="w-10 h-10 text-slate-300 dark:text-slate-600" />
          </div>
          <h3 className="text-xl font-black text-slate-400 dark:text-slate-500 mb-2">
            {isRTL ? 'لا توجد بيانات زوار' : 'No Visitor Data'}
          </h3>
          <p className="text-sm font-medium text-slate-400 dark:text-slate-500 max-w-md">
            {isRTL
              ? 'قم بزيارة الموقع العام لتسجيل الزيارات، ثم عد إلى لوحة التحكم لمشاهدة التحليلات'
              : 'Browse the public site to record visits, then come back here to see analytics.'}
          </p>
          <button onClick={() => { window.open('/', '_blank'); }}
            className="mt-6 px-6 py-3 bg-[#0f639e] text-white rounded-xl font-bold text-sm hover:bg-[#0f639e]/90 transition-all shadow-lg shadow-[#0f639e]/20">
            {isRTL ? 'فتح الموقع العام' : 'OPEN PUBLIC SITE'}
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`${metricCard} lg:col-span-1`}>
              <div className="flex items-start justify-between mb-2">
                <div className="w-10 h-10 bg-[#0f639e]/10 rounded-xl flex items-center justify-center text-[#0f639e]"><Eye className="w-5 h-5" /></div>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500"><ArrowUpRight className="w-3 h-3" />{uniqueSessions}</span>
              </div>
              <div className={metricValue} style={{ color: '#0f639e' }}>{uniqueSessions.toLocaleString()}</div>
              <div className={metricLabel}>{isRTL ? 'الزوار' : 'VISITORS'}</div>
              <div className="mt-2 pt-2 border-t border-slate-100 dark:border-[#1e293b]">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-slate-400">{isRTL ? 'إجمالي المشاهدات' : 'Total views'}</span>
                  <span className="font-black text-slate-600 dark:text-slate-300">{totalPageViews.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] mt-1">
                  <span className="font-bold text-slate-400">{isRTL ? 'صفحات/زائر' : 'Pages/visitor'}</span>
                  <span className="font-black text-slate-600 dark:text-slate-300">{pagesPerSession.toFixed(1)}</span>
                </div>
              </div>
            </div>
            <div className={metricCard}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-[#10b981]/10 rounded-xl flex items-center justify-center text-[#10b981]"><MessageCircle className="w-5 h-5" /></div>
              </div>
              <div className={metricValue} style={{ color: '#10b981' }}>{whatsappClicks.toLocaleString()}</div>
              <div className={metricLabel}>WHATSAPP</div>
            </div>
            <div className={metricCard}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-[#f59e0b]/10 rounded-xl flex items-center justify-center text-[#f59e0b]"><Phone className="w-5 h-5" /></div>
              </div>
              <div className={metricValue} style={{ color: '#f59e0b' }}>{phoneClicks.toLocaleString()}</div>
              <div className={metricLabel}>PHONE</div>
            </div>
            <div className={metricCard}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-[#6366f1]/10 rounded-xl flex items-center justify-center text-[#6366f1]"><Zap className="w-5 h-5" /></div>
                <span className={`flex items-center gap-1 text-[10px] font-bold ${growth >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {growth >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(growth).toFixed(1)}%
                </span>
              </div>
              <div className={metricValue} style={{ color: '#6366f1' }}>{engagementRate.toFixed(1)}%</div>
              <div className={metricLabel}>{isRTL ? 'معدل التفاعل' : 'ENGAGEMENT RATE'}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white dark:bg-[#131d31] rounded-2xl border border-slate-100 dark:border-[#1e293b] shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-3.5 h-3.5 text-[#0f639e]" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{isRTL ? 'معدل التحويل' : 'CONVERSION RATE'}</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-slate-800 dark:text-white">{conversionRate.toFixed(1)}%</span>
                <span className="text-[10px] font-bold text-slate-400">{totalActions}/{totalPageViews}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-[#1e293b] rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#0f639e] to-[#60a5fa] rounded-full transition-all" style={{ width: `${Math.min(conversionRate, 100)}%` }} />
              </div>
            </div>
            <div className="p-4 bg-white dark:bg-[#131d31] rounded-2xl border border-slate-100 dark:border-[#1e293b] shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-3.5 h-3.5 text-[#10b981]" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{isRTL ? 'صفحات/جلسة' : 'PAGES/SESSION'}</span>
              </div>
              <span className="text-2xl font-black text-slate-800 dark:text-white">{pagesPerSession.toFixed(1)}</span>
            </div>
            <div className="p-4 bg-white dark:bg-[#131d31] rounded-2xl border border-slate-100 dark:border-[#1e293b] shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                {growth >= 0 ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> : <TrendingDown className="w-3.5 h-3.5 text-rose-500" />}
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{isRTL ? 'النمو' : 'GROWTH'}</span>
              </div>
              <span className={`text-2xl font-black ${growth >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
              </span>
              <div className="text-[10px] font-bold text-slate-400 mt-0.5">{isRTL ? 'نصف الفترة vs النصف الثاني' : '1st half vs 2nd half'}</div>
            </div>
            <div className="p-4 bg-white dark:bg-[#131d31] rounded-2xl border border-slate-100 dark:border-[#1e293b] shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{isRTL ? 'جودة الجلسات' : 'SESSION QUALITY'}</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="h-2 rounded-full bg-rose-200 dark:bg-rose-900/30" style={{ width: `${uniqueSessions > 0 ? bounceSessions / uniqueSessions * 100 : 0}%`, minWidth: bounceSessions > 0 ? '4px' : '0' }} />
                  <span className="text-[10px] font-bold text-slate-500 shrink-0">{isRTL ? 'ارتداد' : 'Bounce'} {bounceSessions}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 rounded-full bg-amber-200 dark:bg-amber-900/30" style={{ width: `${uniqueSessions > 0 ? engagedSessions / uniqueSessions * 100 : 0}%`, minWidth: engagedSessions > 0 ? '4px' : '0' }} />
                  <span className="text-[10px] font-bold text-slate-500 shrink-0">{isRTL ? 'تفاعل' : 'Engaged'} {engagedSessions}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 rounded-full bg-emerald-200 dark:bg-emerald-900/30" style={{ width: `${uniqueSessions > 0 ? superEngagedSessions / uniqueSessions * 100 : 0}%`, minWidth: superEngagedSessions > 0 ? '4px' : '0' }} />
                  <span className="text-[10px] font-bold text-slate-500 shrink-0">{isRTL ? 'متفاعل جداً' : 'Super'} {superEngagedSessions}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 bg-white dark:bg-[#131d31] rounded-2xl border border-slate-100 dark:border-[#1e293b] shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h4 className={cardTitle}><TrendingUp className="w-4 h-4 text-[#0f639e]" />{isRTL ? 'الزوار خلال اليوم' : 'Hourly Visitors'}</h4>
                  {peakHour && peakHour.visitors > 0 && (
                    <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md uppercase tracking-widest">
                      {isRTL ? `الذروة ${peakHour.date}` : `PEAK ${peakHour.date}`}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#0f639e]" /><span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{isRTL ? 'مشاهدات' : 'VIEWS'}</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#df4d21]" /><span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{isRTL ? 'زوار' : 'VISITORS'}</span></div>
                </div>
              </div>
              <VisitorsLineChart data={chartData} />
            </div>
            <div className="p-6 bg-white dark:bg-[#131d31] rounded-2xl border border-slate-100 dark:border-[#1e293b] shadow-sm">
              <h4 className={cardTitle + ' mb-6'}><Smartphone className="w-4 h-4 text-[#df4d21]" />{isRTL ? 'الأجهزة' : 'Devices'}</h4>
              <DevicePieChart data={deviceData} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 bg-white dark:bg-[#131d31] rounded-2xl border border-slate-100 dark:border-[#1e293b] shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h4 className={cardTitle}><BarChart3 className="w-4 h-4 text-[#0f639e]" />{isRTL ? 'أكثر الصفحات زيارة' : 'Top Pages'}</h4>
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{isRTL ? 'زيارات' : 'VISITS'}</span>
              </div>
              <TopPagesRanking data={topPages} />
            </div>
            <div className="p-6 bg-white dark:bg-[#131d31] rounded-2xl border border-slate-100 dark:border-[#1e293b] shadow-sm">
              <h4 className={cardTitle + ' mb-4'}><MousePointerClick className="w-4 h-4 text-[#df4d21]" />{isRTL ? 'الصفحات المحولة' : 'Converting Pages'}</h4>
              {convertingPages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-xs font-bold text-slate-400">{isRTL ? 'لا توجد تفاعلات بعد' : 'No interactions yet'}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {convertingPages.map((p, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-[#1a2744] rounded-xl">
                      <span className="w-5 text-center text-[11px] font-black text-slate-400">{i + 1}</span>
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate capitalize">{p.page.replace(/-/g, ' ')}</div>
                        <div className="w-full h-1.5 bg-slate-200 dark:bg-[#1e293b] rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#df4d21] to-[#f87171] rounded-full" style={{ width: `${convertingPages.length > 0 ? p.count / convertingPages[0].count * 100 : 0}%` }} />
                        </div>
                      </div>
                      <span className="text-xs font-black text-slate-500 dark:text-slate-400 shrink-0">{p.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {hasMore && (
            <div className="text-center pt-2">
              <button onClick={() => fetchEvents(true)} disabled={loadingMore}
                className="px-10 py-3.5 bg-slate-100 dark:bg-[#1a2744] text-slate-400 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-[#0f639e] hover:text-white transition-all disabled:opacity-50">
                {loadingMore ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (isRTL ? 'تحميل المزيد' : 'LOAD MORE')}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VisitorsTab;
