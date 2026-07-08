import React, { useEffect, useState, useCallback } from 'react';
import { collection, getDocs, query, orderBy, limit, startAfter, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { Eye, Users, MousePointerClick, Smartphone, BarChart3, MessageCircle, Phone, Loader2, Play } from 'lucide-react';
import type { VisitorEvent } from '../../types';
import { SectionHeader } from './FormComponents';
import { VisitorsLineChart, TopPagesBarChart, DevicePieChart } from './VisitorsCharts';

interface VisitorsTabProps {
  isRTL: boolean;
}

const statCard = 'p-5 bg-white dark:bg-[#131d31] rounded-xl border border-slate-100 dark:border-[#1e293b] flex items-center gap-4';
const statValue = 'text-2xl font-black text-[#0f639e] dark:text-white';
const statLabel = 'text-[9px] font-black text-slate-400 uppercase tracking-widest';

const PAGE_SIZE = 5000;

const VisitorsTab: React.FC<VisitorsTabProps> = ({ isRTL }) => {
  const [events, setEvents] = useState<VisitorEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [daysFilter, setDaysFilter] = useState(7);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [writeError, setWriteError] = useState<string | null>(null);

  const writeTestEvent = async () => {
    setTestStatus('writing...');
    setWriteError(null);
    try {
      const col = collection(db, 'visitorEvents');
      await addDoc(col, {
        timestamp: new Date().toISOString(),
        page: 'admin-test',
        referrer: 'direct',
        userAgent: navigator.userAgent,
        language: document.documentElement.lang || 'ar',
        sessionId: 'test-' + Date.now(),
        eventType: 'pageview',
        deviceType: 'desktop',
        createdAt: serverTimestamp(),
      });
      setTestStatus('success!');
      fetchEvents(false);
    } catch (err: any) {
      setTestStatus('failed');
      setWriteError(err.code || err.message || String(err));
    }
  };

  useEffect(() => { writeTestEvent(); }, []);

  const fetchEvents = useCallback(async (loadMore = false) => {
    if (loadMore) setLoadingMore(true); else setLoading(true);
    try {
      const q = loadMore && lastDoc
        ? query(collection(db, 'visitorEvents'), orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(PAGE_SIZE))
        : query(collection(db, 'visitorEvents'), orderBy('createdAt', 'desc'), limit(PAGE_SIZE));
      const snap = await getDocs(q);
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as VisitorEvent));
      const since = new Date();
      since.setDate(since.getDate() - daysFilter);
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

  const totalPageViews = events.filter(e => e.eventType === 'pageview').length;
  const uniqueSessions = new Set(events.map(e => e.sessionId)).size;
  const uniqueVisitors = uniqueSessions;
  const ctaClicks = events.filter(e => e.eventType === 'cta_click').length;
  const whatsappClicks = events.filter(e => e.eventType === 'whatsapp_click').length;
  const phoneClicks = events.filter(e => e.eventType === 'phone_click').length;

  const deviceCounts = events.reduce<Record<string, number>>((acc, e) => {
    if (e.deviceType) acc[e.deviceType] = (acc[e.deviceType] || 0) + 1;
    return acc;
  }, {});
  const deviceData = Object.entries(deviceCounts).map(([device, count]) => ({ device, count }));

  const pageCounts = events
    .filter(e => e.eventType === 'pageview')
    .reduce<Record<string, number>>((acc, e) => {
      acc[e.page] = (acc[e.page] || 0) + 1;
      return acc;
    }, {});
  const topPages = Object.entries(pageCounts).map(([page, views]) => ({ page, views }));

  const dailyMap = events
    .filter(e => e.eventType === 'pageview')
    .reduce<Record<string, { pageviews: number; visitors: Set<string> }>>((acc, e) => {
      const day = e.timestamp?.slice(0, 10) || 'unknown';
      if (!acc[day]) acc[day] = { pageviews: 0, visitors: new Set() };
      acc[day].pageviews++;
      acc[day].visitors.add(e.sessionId);
      return acc;
    }, {});
  const chartData = Object.entries(dailyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, d]) => ({ date, pageviews: d.pageviews, visitors: d.visitors.size }));

  return (
    <div className="space-y-10">
      <SectionHeader icon={BarChart3} title={isRTL ? 'زوار الموقع' : 'Site Visitors'} subtitle="Real-time visitor analytics and engagement metrics" isRTL={isRTL} />

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-2">
          {[1, 7, 14, 30].map(d => (
            <button key={d} onClick={() => setDaysFilter(d)}
              className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${daysFilter === d ? 'bg-[#0f639e] text-white' : 'bg-slate-100 dark:bg-[#1a2744] text-slate-400 hover:text-[#0f639e]'}`}>
              {isRTL ? (d === 1 ? 'آخر 24 ساعة' : `آخر ${d} أيام`) : (d === 1 ? 'Last 24h' : `Last ${d}d`)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={writeTestEvent}
            className="flex items-center gap-2 px-4 py-2 bg-[#0f639e]/10 text-[#0f639e] rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#0f639e] hover:text-white transition-all">
            <Play className="w-3 h-3" /> {isRTL ? 'اختبار الكتابة' : 'TEST WRITE'}
          </button>
          {testStatus && (
            <span className={`text-[10px] font-bold ${testStatus === 'success!' ? 'text-emerald-500' : testStatus === 'failed' ? 'text-rose-500' : 'text-slate-400'}`}>
              {testStatus}
            </span>
          )}
        </div>
      </div>
      {writeError && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl">
          <p className="text-[11px] font-bold text-rose-500">{writeError}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#0f639e] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 text-slate-400 font-medium">
          {isRTL ? 'لا توجد بيانات زوار حتى الآن' : 'No visitor data yet'}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className={statCard}>
              <div className="w-10 h-10 bg-[#0f639e]/10 rounded-xl flex items-center justify-center text-[#0f639e] shrink-0"><Eye className="w-5 h-5" /></div>
              <div><div className={statValue}>{totalPageViews.toLocaleString()}</div><div className={statLabel}>{isRTL ? 'مشاهدات' : 'PAGE VIEWS'}</div></div>
            </div>
            <div className={statCard}>
              <div className="w-10 h-10 bg-[#3292ca]/10 rounded-xl flex items-center justify-center text-[#3292ca] shrink-0"><Users className="w-5 h-5" /></div>
              <div><div className={statValue}>{uniqueVisitors.toLocaleString()}</div><div className={statLabel}>{isRTL ? 'زوار فريدون' : 'VISITORS'}</div></div>
            </div>
            <div className={statCard}>
              <div className="w-10 h-10 bg-[#df4d21]/10 rounded-xl flex items-center justify-center text-[#df4d21] shrink-0"><MousePointerClick className="w-5 h-5" /></div>
              <div><div className={statValue}>{ctaClicks.toLocaleString()}</div><div className={statLabel}>{isRTL ? 'نقرات' : 'CTA CLICKS'}</div></div>
            </div>
            <div className={statCard}>
              <div className="w-10 h-10 bg-[#10b981]/10 rounded-xl flex items-center justify-center text-[#10b981] shrink-0"><MessageCircle className="w-5 h-5" /></div>
              <div><div className={statValue}>{whatsappClicks.toLocaleString()}</div><div className={statLabel}>WHATSAPP</div></div>
            </div>
            <div className={statCard}>
              <div className="w-10 h-10 bg-[#f59e0b]/10 rounded-xl flex items-center justify-center text-[#f59e0b] shrink-0"><Phone className="w-5 h-5" /></div>
              <div><div className={statValue}>{phoneClicks.toLocaleString()}</div><div className={statLabel}>PHONE</div></div>
            </div>
            <div className={statCard}>
              <div className="w-10 h-10 bg-[#6366f1]/10 rounded-xl flex items-center justify-center text-[#6366f1] shrink-0"><Smartphone className="w-5 h-5" /></div>
              <div><div className={statValue}>{events.length.toLocaleString()}</div><div className={statLabel}>{isRTL ? 'أحداث' : 'EVENTS'}</div></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 bg-white dark:bg-[#131d31] rounded-xl border border-slate-100 dark:border-[#1e293b]">
              <h4 className="text-sm font-black text-[#0f639e] dark:text-white mb-4">{isRTL ? 'الزوار عبر الوقت' : 'Visitors Over Time'}</h4>
              <VisitorsLineChart data={chartData} />
            </div>
            <div className="p-6 bg-white dark:bg-[#131d31] rounded-xl border border-slate-100 dark:border-[#1e293b]">
              <h4 className="text-sm font-black text-[#0f639e] dark:text-white mb-4">{isRTL ? 'الأجهزة' : 'Devices'}</h4>
              <DevicePieChart data={deviceData} />
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-[#131d31] rounded-xl border border-slate-100 dark:border-[#1e293b]">
            <h4 className="text-sm font-black text-[#0f639e] dark:text-white mb-4">{isRTL ? 'أكثر الصفحات زيارة' : 'Top Pages'}</h4>
            <TopPagesBarChart data={topPages} />
          </div>

          {hasMore && (
            <div className="text-center">
              <button onClick={() => fetchEvents(true)} disabled={loadingMore}
                className="px-8 py-3.5 bg-slate-100 dark:bg-[#1a2744] text-slate-400 font-black text-xs uppercase tracking-widest rounded-xl hover:text-[#0f639e] transition-all disabled:opacity-50">
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
