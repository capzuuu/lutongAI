import { RecipeCard } from '@/components/recipe-card';
import { Colors } from '@/constants/theme';
import { useFavorites } from '@/hooks/use-favorites';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function FavoritesScreen() {
  const { favorites } = useFavorites();
  const { scheme } = useTheme();
  const C = Colors[scheme];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: C.tint }]}>❤️ Favorites</Text>
        {favorites.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🍽️</Text>
            <Text style={[styles.emptyText, { color: C.subtitle }]}>No saved recipes yet.{'\n'}Tap ❤️ on any recipe to save it.</Text>
          </View>
        ) : (
          favorites.map((r, i) => <RecipeCard key={i} recipe={r} />)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '800', textAlign: 'center', marginTop: 26, marginBottom: 20 },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyText: { fontSize: 15, textAlign: 'center', lineHeight: 24 },
});
