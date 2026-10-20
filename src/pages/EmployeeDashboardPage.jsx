import React from 'react';
import { useCallback } from 'react';
import { LegacyPage } from './LegacyPage.jsx';

export default function EmployeeDashboardPage({ initialView }) {
  const render = useCallback(() => {
    window.shellDash('employee');
    if (initialView && window.session()?.role === 'employee') window.showView('employee', initialView);
  }, [initialView]);
  return <LegacyPage render={render} />;
}
