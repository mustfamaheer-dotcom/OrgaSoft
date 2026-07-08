import React from 'react';
import { Type } from 'lucide-react';
import type { SiteContent } from '../../types';
import { SectionHeader, FieldGroup } from './FormComponents';

interface UIStringsTabProps {
  data: SiteContent;
  updateNestedField: (path: string, value: any) => void;
  isRTL: boolean;
}

const UIStringsTab: React.FC<UIStringsTabProps> = ({ data, updateNestedField, isRTL }) => (
  <div className="space-y-10">
    <SectionHeader icon={Type} title={isRTL ? 'النصوص الظاهرة' : 'UI Strings'} subtitle="Manage all bilingual UI text across the site" isRTL={isRTL} />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
      <FieldGroup label="About Label" valueEn={data.uiStrings.aboutLabel.en} valueAr={data.uiStrings.aboutLabel.ar} onUpdateEn={v => updateNestedField('uiStrings.aboutLabel.en', v)} onUpdateAr={v => updateNestedField('uiStrings.aboutLabel.ar', v)} isRTL={isRTL} />
      <FieldGroup label="Products Label" valueEn={data.uiStrings.productsLabel.en} valueAr={data.uiStrings.productsLabel.ar} onUpdateEn={v => updateNestedField('uiStrings.productsLabel.en', v)} onUpdateAr={v => updateNestedField('uiStrings.productsLabel.ar', v)} isRTL={isRTL} />
      <FieldGroup label="Products Title" valueEn={data.uiStrings.productsTitle.en} valueAr={data.uiStrings.productsTitle.ar} onUpdateEn={v => updateNestedField('uiStrings.productsTitle.en', v)} onUpdateAr={v => updateNestedField('uiStrings.productsTitle.ar', v)} isRTL={isRTL} />
      <FieldGroup label="Products Subtitle" valueEn={data.uiStrings.productsSubtitle.en} valueAr={data.uiStrings.productsSubtitle.ar} onUpdateEn={v => updateNestedField('uiStrings.productsSubtitle.en', v)} onUpdateAr={v => updateNestedField('uiStrings.productsSubtitle.ar', v)} isRTL={isRTL} />
      <FieldGroup label="Partners Label" valueEn={data.uiStrings.partnersLabel.en} valueAr={data.uiStrings.partnersLabel.ar} onUpdateEn={v => updateNestedField('uiStrings.partnersLabel.en', v)} onUpdateAr={v => updateNestedField('uiStrings.partnersLabel.ar', v)} isRTL={isRTL} />
      <FieldGroup label="Partners Title" valueEn={data.uiStrings.partnersTitle.en} valueAr={data.uiStrings.partnersTitle.ar} onUpdateEn={v => updateNestedField('uiStrings.partnersTitle.en', v)} onUpdateAr={v => updateNestedField('uiStrings.partnersTitle.ar', v)} isRTL={isRTL} />
      <FieldGroup label="Contact Label" valueEn={data.uiStrings.contactLabel.en} valueAr={data.uiStrings.contactLabel.ar} onUpdateEn={v => updateNestedField('uiStrings.contactLabel.en', v)} onUpdateAr={v => updateNestedField('uiStrings.contactLabel.ar', v)} isRTL={isRTL} />
      <FieldGroup label="Contact Title" valueEn={data.uiStrings.contactTitle.en} valueAr={data.uiStrings.contactTitle.ar} onUpdateEn={v => updateNestedField('uiStrings.contactTitle.en', v)} onUpdateAr={v => updateNestedField('uiStrings.contactTitle.ar', v)} isRTL={isRTL} />
      <FieldGroup label="Contact Subtitle" valueEn={data.uiStrings.contactSubtitle.en} valueAr={data.uiStrings.contactSubtitle.ar} onUpdateEn={v => updateNestedField('uiStrings.contactSubtitle.en', v)} onUpdateAr={v => updateNestedField('uiStrings.contactSubtitle.ar', v)} isRTL={isRTL} />
      <FieldGroup label="CTA More" valueEn={data.uiStrings.ctaMore.en} valueAr={data.uiStrings.ctaMore.ar} onUpdateEn={v => updateNestedField('uiStrings.ctaMore.en', v)} onUpdateAr={v => updateNestedField('uiStrings.ctaMore.ar', v)} isRTL={isRTL} />
      <FieldGroup label="CTA Request" valueEn={data.uiStrings.ctaRequest.en} valueAr={data.uiStrings.ctaRequest.ar} onUpdateEn={v => updateNestedField('uiStrings.ctaRequest.en', v)} onUpdateAr={v => updateNestedField('uiStrings.ctaRequest.ar', v)} isRTL={isRTL} />
      <FieldGroup label="Footer Products" valueEn={data.uiStrings.footerColProducts.en} valueAr={data.uiStrings.footerColProducts.ar} onUpdateEn={v => updateNestedField('uiStrings.footerColProducts.en', v)} onUpdateAr={v => updateNestedField('uiStrings.footerColProducts.ar', v)} isRTL={isRTL} />
      <FieldGroup label="Footer Links" valueEn={data.uiStrings.footerColLinks.en} valueAr={data.uiStrings.footerColLinks.ar} onUpdateEn={v => updateNestedField('uiStrings.footerColLinks.en', v)} onUpdateAr={v => updateNestedField('uiStrings.footerColLinks.ar', v)} isRTL={isRTL} />
      <FieldGroup label="Footer Contact" valueEn={data.uiStrings.footerColContact.en} valueAr={data.uiStrings.footerColContact.ar} onUpdateEn={v => updateNestedField('uiStrings.footerColContact.en', v)} onUpdateAr={v => updateNestedField('uiStrings.footerColContact.ar', v)} isRTL={isRTL} />
      <FieldGroup label="Company Name" valueEn={data.companyName.en} valueAr={data.companyName.ar} onUpdateEn={v => updateNestedField('companyName.en', v)} onUpdateAr={v => updateNestedField('companyName.ar', v)} isRTL={isRTL} />
    </div>
  </div>
);

export default UIStringsTab;
