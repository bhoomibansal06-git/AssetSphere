import React from 'react';
import { LegacyPage } from './LegacyPage.jsx';

export default function FAQPage() {
  return <LegacyPage render={window.faq} />;
}
