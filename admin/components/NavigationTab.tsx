import React from 'react';
import { Menu } from 'lucide-react';
import type { SiteContent } from '../../types';
import { SectionHeader, FieldGroup } from './FormComponents';

const NavigationTab: React.FC<{ data: SiteContent; updateNestedField: (path: string, value: any) => void; isRTL: boolean }> = ({ data, updateNestedField, isRTL }) => (
  <div className="space-y-10">
    <SectionHeader icon={Menu} title={isRTL ? 'روابط التنقل' : 'Navigation Nodes'} subtitle="Configure navigation link labels" isRTL={isRTL} />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FieldGroup label="Home Link" valueEn={data.navLabels.home.en} valueAr={data.navLabels.home.ar} onUpdateEn={v => updateNestedField('navLabels.home.en', v)} onUpdateAr={v => updateNestedField('navLabels.home.ar', v)} isRTL={isRTL} />
      <FieldGroup label="About Link" valueEn={data.navLabels.about.en} valueAr={data.navLabels.about.ar} onUpdateEn={v => updateNestedField('navLabels.about.en', v)} onUpdateAr={v => updateNestedField('navLabels.about.ar', v)} isRTL={isRTL} />
      <FieldGroup label="Products Link" valueEn={data.navLabels.products.en} valueAr={data.navLabels.products.ar} onUpdateEn={v => updateNestedField('navLabels.products.en', v)} onUpdateAr={v => updateNestedField('navLabels.products.ar', v)} isRTL={isRTL} />
      <FieldGroup label="Contact Link" valueEn={data.navLabels.contact.en} valueAr={data.navLabels.contact.ar} onUpdateEn={v => updateNestedField('navLabels.contact.en', v)} onUpdateAr={v => updateNestedField('navLabels.contact.ar', v)} isRTL={isRTL} />
    </div>
  </div>
);

export default NavigationTab;
