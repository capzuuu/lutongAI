import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as useSystemScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Scheme = 'light' | 'dark';
interface ThemeCtx { scheme: Scheme; toggle: () => void; }

const KEY = 'lutongai_theme';
const Context = createContext<ThemeCtx>({ scheme: 'light', toggle: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useSystemScheme() ?? 'light';
  const [scheme, setScheme] = useState<Scheme>(system);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((val) => {
      if (val === 'light' || val === 'dark') setScheme(val);
    });
  }, []);

  function toggle() {
    setScheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      AsyncStorage.setItem(KEY, next);
      return next;
    });
  }

  return <Context.Provider value={{ scheme, toggle }}>{children}</Context.Provider>;
}

export const useTheme = () => useContext(Context);
