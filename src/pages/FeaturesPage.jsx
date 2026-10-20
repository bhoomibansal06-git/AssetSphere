import React from 'react';
import { LegacyPage } from './LegacyPage.jsx';

export default function FeaturesPage() {
  return <LegacyPage render={window.home} scrollTo="features" />;
}
