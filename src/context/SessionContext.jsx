import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { createDemoAccount, signInDemo } from '../services/demoAuth.js';

const SessionContext = createContext(null);
const readSession = () => JSON.parse(localStorage.getItem('as-session') || 'null');

export function SessionProvider({ children, value }) {
  const [session, setSession] = useState(value === undefined ? readSession() : value);

  useEffect(() => {
    const refresh = () => setSession(readSession());
    window.addEventListener('assetsphere:session-updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('assetsphere:session-updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const saveSession = nextSession => {
    localStorage.setItem('as-session', JSON.stringify(nextSession));
    setSession(nextSession);
    window.dispatchEvent(new Event('assetsphere:session-updated'));
  };

  const authenticate = async credentials => {
    const nextSession = await signInDemo(credentials);
    saveSession(nextSession);
    return nextSession;
  };

  const register = async details => {
    const nextSession = await createDemoAccount(details);
    saveSession(nextSession);
    return nextSession;
  };

  const logout = () => {
    localStorage.removeItem('as-session');
    setSession(null);
    window.dispatchEvent(new Event('assetsphere:session-updated'));
  };

  return <SessionContext.Provider value={{ ...(session || {}), user: session?.user || null, authenticate, register, logout }}>{children}</SessionContext.Provider>;
}

export const useSession = () => useContext(SessionContext);
