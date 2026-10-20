import React from 'react';
import { useEffect } from 'react';

export function LegacyPage({ render, scrollTo }) {
  useEffect(() => {
    render?.();
    if (scrollTo) requestAnimationFrame(() => document.getElementById(scrollTo)?.scrollIntoView({ behavior: 'smooth' }));
    return () => window.unmountAssetCalendar?.();
  }, [render, scrollTo]);

  return <div id="app" />;
}
