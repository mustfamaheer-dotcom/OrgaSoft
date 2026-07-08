import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const COLORS = ['#0f639e', '#3292ca', '#df4d21', '#10b981', '#f59e0b', '#6366f1'];
const PIE_COLORS = ['#0f639e', '#df4d21', '#10b981'];

interface DailyStat { date: string; pageviews: number; visitors: number }

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-white dark:bg-[#1a2744] border border-slate-200 dark:border-[#1e293b] rounded-xl px-4 py-3 shadow-xl">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-sm font-bold" style={{ color: p.color }}>{p.name}: {p.value.toLocaleString()}</p>
      ))}
    </div>
  );
};

export const VisitorsLineChart: React.FC<{ data: DailyStat[] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
      <defs>
        <linearGradient id="pvGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0f639e" stopOpacity={0.25}/><stop offset="100%" stopColor="#0f639e" stopOpacity={0}/></linearGradient>
        <linearGradient id="visGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#df4d21" stopOpacity={0.15}/><stop offset="100%" stopColor="#df4d21" stopOpacity={0}/></linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" strokeOpacity={0.5} />
      <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
      <Tooltip content={<CustomTooltip />} />
      <Area type="monotone" dataKey="pageviews" stroke="#0f639e" strokeWidth={2.5} fill="url(#pvGrad)" dot={{ fill: '#0f639e', strokeWidth: 2, r: 3 }} activeDot={{ r: 5, strokeWidth: 0 }} />
      <Area type="monotone" dataKey="visitors" stroke="#df4d21" strokeWidth={2} fill="url(#visGrad)" dot={{ fill: '#df4d21', strokeWidth: 2, r: 3 }} activeDot={{ r: 5, strokeWidth: 0 }} />
    </AreaChart>
  </ResponsiveContainer>
);

export const TopPagesBarChart: React.FC<{ data: { page: string; views: number }[] }> = ({ data }) => {
  const sorted = [...data].sort((a, b) => b.views - a.views).slice(0, 10);
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={sorted} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" strokeOpacity={0.5} horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis dataKey="page" type="category" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={100} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
        <Bar dataKey="views" radius={[0, 6, 6, 0]} maxBarSize={20}>
          {sorted.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export const DevicePieChart: React.FC<{ data: { device: string; count: number }[] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={260}>
    <PieChart>
      <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="count" nameKey="device">
        {data.map((_, idx) => <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} stroke="none" />)}
      </Pie>
      <Tooltip content={<CustomTooltip />} />
    </PieChart>
  </ResponsiveContainer>
);
