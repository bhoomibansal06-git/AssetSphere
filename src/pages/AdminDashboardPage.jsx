import React from 'react';
import { useCallback } from 'react';
import { LegacyPage } from './LegacyPage.jsx';

export default function AdminDashboardPage({ initialView }) {
  const render = useCallback(() => {
    window.shellDash('admin');
    if (initialView && window.session()?.role === 'admin') window.showView('admin', initialView);
  }, [initialView]);
  return <LegacyPage render={render} />;
}
