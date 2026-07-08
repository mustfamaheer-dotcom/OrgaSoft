import React, { useEffect, useState, useCallback } from 'react';
import { collection, getDocs, query, orderBy, limit, startAfter, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { Eye, Users, MousePointerClick, Smartphone, BarChart3, MessageCircle, Phone, Loader2, Play, Activity, Clock, TrendingUp, ArrowUpRight } from 'lucide-react';
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

  useEffect(() => { setLastDoc(null); fetchEvents(false); }, [daysFilter]);

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

  const dailyMap = publicEvents.filter(e => e.eventType === 'pageview')
    .reduce<Record<string, { pageviews: number; visitors: Set<string> }>>((acc, e) => {
      const day = e.timestamp?.slice(0, 10) || 'unknown';
      if (!acc[day]) acc[day] = { pageviews: 0, visitors: new Set() };
      acc[day].pageviews++; acc[day].visitors.add(e.sessionId); return acc;
    }, {});
  const chartData = Object.entries(dailyMap).sort(([a], [b]) => a.localeCompare(b))
    .map(([date, d]) => ({ date, pageviews: d.pageviews, visitors: d.visitors.size }));

  const recentEvents = [...publicEvents].sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || '')).slice(0, 10);

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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className={metricCard}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-[#0f639e]/10 rounded-xl flex items-center justify-center text-[#0f639e]"><Eye className="w-5 h-5" /></div>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500"><ArrowUpRight className="w-3 h-3" />{totalPageViews}</span>
              </div>
              <div className={metricValue} style={{ color: '#0f639e' }}>{totalPageViews.toLocaleString()}</div>
              <div className={metricLabel}>{isRTL ? 'مشاهدات الصفحات' : 'PAGE VIEWS'}</div>
            </div>
            <div className={metricCard}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-[#3292ca]/10 rounded-xl flex items-center justify-center text-[#3292ca]"><Users className="w-5 h-5" /></div>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500"><ArrowUpRight className="w-3 h-3" />{uniqueSessions}</span>
              </div>
              <div className={metricValue} style={{ color: '#3292ca' }}>{uniqueSessions.toLocaleString()}</div>
              <div className={metricLabel}>{isRTL ? 'الزوار الفريدون' : 'UNIQUE VISITORS'}</div>
            </div>
            <div className={metricCard}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-[#df4d21]/10 rounded-xl flex items-center justify-center text-[#df4d21]"><MousePointerClick className="w-5 h-5" /></div>
              </div>
              <div className={metricValue} style={{ color: '#df4d21' }}>{ctaClicks.toLocaleString()}</div>
              <div className={metricLabel}>{isRTL ? 'نقرات الدعوة' : 'CTA CLICKS'}</div>
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
                <div className="w-10 h-10 bg-[#6366f1]/10 rounded-xl flex items-center justify-center text-[#6366f1]"><Activity className="w-5 h-5" /></div>
              </div>
              <div className={metricValue} style={{ color: '#6366f1' }}>{events.length.toLocaleString()}</div>
              <div className={metricLabel}>{isRTL ? 'إجمالي الأحداث' : 'TOTAL EVENTS'}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 bg-white dark:bg-[#131d31] rounded-2xl border border-slate-100 dark:border-[#1e293b] shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h4 className={cardTitle}><TrendingUp className="w-4 h-4 text-[#0f639e]" />{isRTL ? 'الزوار عبر الوقت' : 'Visitors Over Time'}</h4>
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
              <h4 className={cardTitle + ' mb-4'}><Clock className="w-4 h-4 text-[#10b981]" />{isRTL ? 'آخر النشاطات' : 'Recent Activity'}</h4>
              <div className="space-y-2">
                {recentEvents.map((ev, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-[#1a2744] rounded-xl">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${ev.eventType === 'pageview' ? 'bg-[#0f639e]' : ev.eventType === 'whatsapp_click' ? 'bg-[#10b981]' : ev.eventType === 'phone_click' ? 'bg-[#f59e0b]' : 'bg-[#df4d21]'}`} />
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate">{ev.page}</div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{ev.eventType}{ev.meta ? ` / ${ev.meta}` : ''}</div>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 shrink-0">{ev.timestamp ? new Date(ev.timestamp).toLocaleTimeString() : ''}</span>
                  </div>
                ))}
              </div>
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
