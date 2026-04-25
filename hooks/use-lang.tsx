import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Lang = 'english' | 'tagalog';
interface LangCtx { lang: Lang; setLang: (l: Lang) => void; }

const KEY = 'lutongai_lang';
const Context = createContext<LangCtx>({ lang: 'english', setLang: () => {} });

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('english');

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((val) => {
      if (val === 'english' || val === 'tagalog') setLangState(val);
    });
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    AsyncStorage.setItem(KEY, l);
  }

  return <Context.Provider value={{ lang, setLang }}>{children}</Context.Provider>;
}

export const useLang = () => useContext(Context);
