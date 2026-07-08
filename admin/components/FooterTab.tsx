import React from 'react';
import { PanelBottom } from 'lucide-react';
import type { SiteContent } from '../../types';
import { SectionHeader, FieldGroup } from './FormComponents';

const FooterTab: React.FC<{ data: SiteContent; updateNestedField: (path: string, value: any) => void; isRTL: boolean }> = ({ data, updateNestedField, isRTL }) => (
  <div className="space-y-10">
    <SectionHeader icon={PanelBottom} title={isRTL ? 'تذييل الموقع' : 'Footer Workspace'} subtitle="Footer description and branding" isRTL={isRTL} />
    <FieldGroup label="Footer Blurb" valueEn={data.uiStrings.footerDescription.en} valueAr={data.uiStrings.footerDescription.ar} onUpdateEn={v => updateNestedField('uiStrings.footerDescription.en', v)} onUpdateAr={v => updateNestedField('uiStrings.footerDescription.ar', v)} isTextArea isRTL={isRTL} />
  </div>
);

export default FooterTab;
