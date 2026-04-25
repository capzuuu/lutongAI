import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe } from '@/lib/gemini';

const KEY = 'lutongai_favorites';

interface FavoritesCtx {
  favorites: Recipe[];
  toggle: (recipe: Recipe) => Promise<void>;
  isFavorite: (recipe: Recipe) => boolean;
  clearAll: () => Promise<void>;
}

const Context = createContext<FavoritesCtx>({ favorites: [], toggle: async () => {}, isFavorite: () => false, clearAll: async () => {} });

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Recipe[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((val) => { if (val) setFavorites(JSON.parse(val)); });
  }, []);

  const save = useCallback(async (updated: Recipe[]) => {
    setFavorites(updated);
    await AsyncStorage.setItem(KEY, JSON.stringify(updated));
  }, []);

  const toggle = useCallback(async (recipe: Recipe) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.name === recipe.name);
      const updated = exists ? prev.filter((f) => f.name !== recipe.name) : [...prev, recipe];
      AsyncStorage.setItem(KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearAll = useCallback(async () => {
    setFavorites([]);
    await AsyncStorage.removeItem(KEY);
  }, []);

  const isFavorite = useCallback((recipe: Recipe) => favorites.some((f) => f.name === recipe.name), [favorites]);

  return <Context.Provider value={{ favorites, toggle, isFavorite, clearAll }}>{children}</Context.Provider>;
}

export const useFavorites = () => useContext(Context);
