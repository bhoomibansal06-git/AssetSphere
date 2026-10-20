import React from 'react';
import { LegacyPage } from './LegacyPage.jsx';

export default function HomePage() {
  return <LegacyPage render={window.home} />;
}
