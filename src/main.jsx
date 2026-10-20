import './components/AssetCalendar.jsx';
import '../script.js';

import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, useDispatch } from 'react-redux';
import App from './App.jsx';
import { SessionProvider } from './context/SessionContext.jsx';
import { loadAssetData, replaceData, store } from './store/assetStore.js';

function ApplicationShell() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadAssetData());
    window.syncAssetData = records => dispatch(replaceData(records));
    window.theme();
    return () => { delete window.syncAssetData; };
  }, [dispatch]);

  return <App />;
}

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <SessionProvider>
      <ApplicationShell />
    </SessionProvider>
  </Provider>
);
