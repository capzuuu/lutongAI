import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Recipe } from '@/lib/gemini';
import { Colors } from '@/constants/theme';
import { useFavorites } from '@/hooks/use-favorites.tsx';
import { useTheme } from '@/hooks/use-theme';

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const router = useRouter();
  const { scheme } = useTheme();
  const C = Colors[scheme];
  const { toggle, isFavorite } = useFavorites();
  const saved = isFavorite(recipe);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: C.card, borderColor: C.border }]}
      onPress={() => router.push({ pathname: '/recipe-detail', params: { data: JSON.stringify(recipe) } })}
    >
      <View style={styles.header}>
        <Text style={[styles.name, { color: C.text, flex: 1 }]}>{recipe.name}</Text>
        <TouchableOpacity onPress={() => toggle(recipe)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.bookmark}>{saved ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.meta}>
        <Text style={[styles.metaText, { color: C.subtitle }]}>⏱ {recipe.cookTime}</Text>
        <Text style={[styles.metaText, { color: C.subtitle }]}>🔥 {recipe.calories}</Text>
      </View>
      <Text style={[styles.tap, { color: C.tint }]}>Tap for full recipe →</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  header: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  name: { fontSize: 17, fontWeight: '700' },
  bookmark: { fontSize: 20 },
  meta: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  metaText: { fontSize: 13 },
  tap: { fontSize: 12, fontWeight: '600' },
});
