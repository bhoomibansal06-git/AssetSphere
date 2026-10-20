import React from 'react';
import { LegacyPage } from './LegacyPage.jsx';

export default function AboutPage() {
  return <LegacyPage render={window.about} />;
}
