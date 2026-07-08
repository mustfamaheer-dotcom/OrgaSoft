import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const PIE_COLORS = ['#0f639e', '#df4d21', '#10b981'];

interface DailyStat { date: string; time?: string; pageviews: number; visitors: number }

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  const item = payload[0]?.payload;
  return (
    <div className="bg-white dark:bg-[#1a2744] border border-slate-200 dark:border-[#1e293b] rounded-2xl px-5 py-4 shadow-2xl">
      <p className="text-[13px] font-black text-slate-700 dark:text-slate-200 mb-0.5">{label}</p>
      {item?.time && <p className="text-[10px] font-bold text-slate-400 mb-2">{item.time}</p>}
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="font-bold" style={{ color: p.color }}>{p.name}: <span className="text-slate-800 dark:text-white">{p.value.toLocaleString()}</span></span>
        </div>
      ))}
    </div>
  );
};

export const VisitorsLineChart: React.FC<{ data: DailyStat[] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={320}>
    <AreaChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 15 }}>
      <defs>
        <linearGradient id="pvGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0f639e" stopOpacity={0.35}/><stop offset="100%" stopColor="#0f639e" stopOpacity={0}/></linearGradient>
        <linearGradient id="visGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#df4d21" stopOpacity={0.2}/><stop offset="100%" stopColor="#df4d21" stopOpacity={0}/></linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" strokeOpacity={0.4} />
      <XAxis dataKey="date" tick={({ x, y, payload }: any) => {
        const item = data.find(d => d.date === payload.value);
        return (
          <g transform={`translate(${x},${y + 6})`}>
            <text x={0} y={0} textAnchor="middle" fill="#475569" fontSize={15} fontWeight={800}>{payload.value}</text>
            <text x={0} y={18} textAnchor="middle" fill="#94a3b8" fontSize={11} fontWeight={600}>{item?.time || ''}</text>
          </g>
        );
      }} axisLine={true} tickLine={false} interval={0} height={70} tickMargin={8} stroke="#e2e8f0" />
      <YAxis tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 700 }} axisLine={false} tickLine={false} />
      <Tooltip content={<ChartTooltip />} />
      <Area type="monotone" dataKey="pageviews" stroke="#0f639e" strokeWidth={3} fill="url(#pvGrad)" dot={{ fill: '#0f639e', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
      <Area type="monotone" dataKey="visitors" stroke="#df4d21" strokeWidth={2.5} fill="url(#visGrad)" dot={{ fill: '#df4d21', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
    </AreaChart>
  </ResponsiveContainer>
);

export const DevicePieChart: React.FC<{ data: { device: string; count: number }[] }> = ({ data }) => {
  const total = data.reduce((s, d) => s + d.count, 0);
  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="count" nameKey="device">
            {data.map((_, idx) => <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} stroke="none" />)}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-4 mt-2">
        {data.map((d, i) => (
          <div key={d.device} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 capitalize">{d.device}</span>
            <span className="text-[11px] font-black text-slate-700 dark:text-slate-300">{total > 0 ? Math.round(d.count / total * 100) : 0}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const TopPagesRanking: React.FC<{ data: { page: string; views: number }[] }> = ({ data }) => {
  const sorted = [...data].sort((a, b) => b.views - a.views).slice(0, 10);
  const maxViews = sorted.length > 0 ? sorted[0].views : 1;
  return (
    <div className="space-y-0.5">
      {sorted.map((item, idx) => {
        const barWidth = (item.views / maxViews) * 100;
        const rankColors = ['text-yellow-500', 'text-slate-400', 'text-amber-700', 'text-slate-400', 'text-slate-400', 'text-slate-400', 'text-slate-400', 'text-slate-400', 'text-slate-400', 'text-slate-400'];
        const gradients = [
          'from-[#0f639e] to-[#60a5fa]',
          'from-[#3292ca] to-[#93c5fd]',
          'from-[#df4d21] to-[#f87171]',
          'from-[#94a3b8] to-[#cbd5e1]',
          'from-[#94a3b8] to-[#cbd5e1]',
          'from-[#94a3b8] to-[#cbd5e1]',
          'from-[#94a3b8] to-[#cbd5e1]',
          'from-[#94a3b8] to-[#cbd5e1]',
          'from-[#94a3b8] to-[#cbd5e1]',
          'from-[#94a3b8] to-[#cbd5e1]',
        ];
        return (
          <div key={item.page} className="group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#1a2744] transition-all">
            <span className={`w-5 text-center text-[13px] font-black ${rankColors[idx]}`}>
              {idx + 1}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate capitalize">{item.page.replace(/-/g, ' ')}</span>
                <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 ml-2 shrink-0">{item.views.toLocaleString()}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-[#1e293b] rounded-full overflow-hidden">
                <div className={`h-full rounded-full bg-gradient-to-r ${gradients[idx]} transition-all duration-700 group-hover:scale-x-[1.02] origin-left`} style={{ width: `${barWidth}%` }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
