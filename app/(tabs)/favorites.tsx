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
      <View style={[styles.header, { backgroundColor: C.background }]}>
        <Text style={[styles.headerTitle, { color: C.tint }]}>❤️ Favorites</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
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
  header: { paddingTop: 60, paddingBottom: 8, paddingHorizontal: 20 },
  headerTitle: { fontSize: 22, fontWeight: '800' },
  container: { padding: 20, paddingBottom: 40, paddingTop: 8 },
  title: { fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 20 },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyText: { fontSize: 15, textAlign: 'center', lineHeight: 24 },
});
