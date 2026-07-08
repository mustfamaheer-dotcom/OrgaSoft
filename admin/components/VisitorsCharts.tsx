import React from 'react';
import { Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const COLORS = ['#0f639e', '#3292ca', '#df4d21', '#10b981', '#f59e0b', '#6366f1'];
const PIE_COLORS = ['#0f639e', '#df4d21', '#10b981'];

interface DailyStat {
  date: string;
  pageviews: number;
  visitors: number;
}

export const VisitorsLineChart: React.FC<{ data: DailyStat[] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={280}>
    <AreaChart data={data}>
      <defs>
        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#0f639e" stopOpacity={0.3} />
          <stop offset="95%" stopColor="#0f639e" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
      <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#94a3b8" />
      <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
      <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
      <Area type="monotone" dataKey="pageviews" stroke="#0f639e" fill="url(#colorPv)" strokeWidth={2} />
      <Line type="monotone" dataKey="visitors" stroke="#df4d21" strokeWidth={2} dot={false} />
    </AreaChart>
  </ResponsiveContainer>
);

export const TopPagesBarChart: React.FC<{ data: { page: string; views: number }[] }> = ({ data }) => {
  const sorted = [...data].sort((a, b) => b.views - a.views).slice(0, 10);
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={sorted} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis type="number" tick={{ fontSize: 10 }} stroke="#94a3b8" />
        <YAxis dataKey="page" type="category" tick={{ fontSize: 10 }} stroke="#94a3b8" width={120} />
        <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
        <Bar dataKey="views" radius={[0, 6, 6, 0]}>
          {sorted.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export const DevicePieChart: React.FC<{ data: { device: string; count: number }[] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={220}>
    <PieChart>
      <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="count" nameKey="device" label={({ device, percent }: any) => `${device} ${((percent || 0) * 100).toFixed(0)}%`}>
        {data.map((_, idx) => <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />)}
      </Pie>
      <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
    </PieChart>
  </ResponsiveContainer>
);
