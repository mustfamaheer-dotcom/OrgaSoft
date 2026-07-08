import React from 'react';
import { ShieldCheck, Activity } from 'lucide-react';
import type { SiteContent } from '../../types';
import { SectionHeader, FieldGroup, InputField } from './FormComponents';

const sectionTitle = 'text-lg font-black text-[#0f639e] dark:text-white tracking-tight flex items-center gap-3';

const AboutTab: React.FC<{ data: SiteContent; updateNestedField: (path: string, value: any) => void; isRTL: boolean }> = ({ data, updateNestedField, isRTL }) => (
  <div className="space-y-10">
    <SectionHeader icon={ShieldCheck} title={isRTL ? 'إرث الشركة' : 'Ecosystem Legacy'} subtitle="Company profile and mission details" isRTL={isRTL} />
    <FieldGroup label="About Content" valueEn={data.about.content.en} valueAr={data.about.content.ar} onUpdateEn={v => updateNestedField('about.content.en', v)} onUpdateAr={v => updateNestedField('about.content.ar', v)} isTextArea textAreaHeight="h-64" isRTL={isRTL} />
    <div className="pt-6 border-t border-slate-100 dark:border-[#1e293b] space-y-6">
      <h4 className={sectionTitle}>
        <Activity className="w-5 h-5 text-[#df4d21]" /> Statistical Metrics
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.about.stats.map((stat, i) => (
          <div key={i} className="p-6 bg-slate-50/50 dark:bg-[#1a2744]/50 rounded-xl border border-slate-100 dark:border-[#1e293b] space-y-4">
            <InputField label="Metric Value" value={stat.value} onChange={v => {
              const ns = [...data.about.stats]; ns[i].value = v; updateNestedField('about.stats', ns);
            }} />
            <FieldGroup label="Stat Label" valueEn={stat.label.en} valueAr={stat.label.ar} onUpdateEn={v => {
              const ns = [...data.about.stats]; ns[i].label.en = v; updateNestedField('about.stats', ns);
            }} onUpdateAr={v => {
              const ns = [...data.about.stats]; ns[i].label.ar = v; updateNestedField('about.stats', ns);
            }} isRTL={isRTL} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default AboutTab;
