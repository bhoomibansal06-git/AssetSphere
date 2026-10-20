import React from 'react';
import { useCallback } from 'react';
import { LegacyPage } from './LegacyPage.jsx';

export function DashboardSectionPage({ role, view }) {
  const render = useCallback(() => {
    window.shellDash(role);
    if (window.session()?.role === role) window.showView(role, view);
  }, [role, view]);
  return <LegacyPage render={render} />;
}
