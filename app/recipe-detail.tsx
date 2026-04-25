import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Recipe } from '@/lib/gemini';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function RecipeDetailScreen() {
  const { data } = useLocalSearchParams<{ data: string }>();
  const recipe: Recipe = JSON.parse(data);
  const router = useRouter();
  const { scheme } = useTheme();
  const C = Colors[scheme];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.background }]}>
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Text style={[styles.backArrow, { color: C.tint }]}>‹</Text>
        <Text style={[styles.backText, { color: C.tint }]}>Back</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: C.text }]}>{recipe.name}</Text>

        <View style={[styles.metaRow, { backgroundColor: C.card, borderColor: C.border }]}>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>⏱</Text>
            <Text style={[styles.metaLabel, { color: C.subtitle }]}>Cook Time</Text>
            <Text style={[styles.metaValue, { color: C.text }]}>{recipe.cookTime}</Text>
          </View>
          <View style={[styles.metaDivider, { backgroundColor: C.border }]} />
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>🔥</Text>
            <Text style={[styles.metaLabel, { color: C.subtitle }]}>Calories</Text>
            <Text style={[styles.metaValue, { color: C.text }]}>{recipe.calories}</Text>
          </View>
        </View>

        <Text style={[styles.section, { color: C.tint }]}>Ingredients</Text>
        <View style={[styles.card, { backgroundColor: C.card, borderColor: C.border }]}>
          {(recipe.ingredients ?? []).length === 0 ? (
            <Text style={[styles.ingText, { color: C.subtitle, padding: 12 }]}>No ingredients listed.</Text>
          ) : (recipe.ingredients ?? []).map((ing, i) => (
            <View key={i} style={[styles.ingRow, i < recipe.ingredients.length - 1 && { borderBottomWidth: 1, borderBottomColor: C.border }]}>
              <Text style={{ color: C.tint, fontSize: 16 }}>•</Text>
              <Text style={[styles.ingText, { color: C.text }]}>{ing}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.section, { color: C.tint }]}>Steps</Text>
        {(recipe.steps ?? []).map((step, i) => (
          <View key={i} style={[styles.stepRow, { backgroundColor: C.stepBg, borderColor: C.border }]}>
            <View style={[styles.stepNum, { backgroundColor: C.tint }]}>
              <Text style={styles.stepNumText}>{i + 1}</Text>
            </View>
            <Text style={[styles.stepText, { color: C.text }]}>{step}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  back: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginTop: 45, marginLeft: 20, marginBottom: 4, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, gap: 4 },
  backArrow: { fontSize: 17, fontWeight: '300', lineHeight: 24 },
  backText: { fontSize: 12, fontWeight: '600' },
  container: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: '800', marginBottom: 16, lineHeight: 32 },
  metaRow: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
    overflow: 'hidden',
  },
  metaItem: { flex: 1, alignItems: 'center', padding: 14 },
  metaIcon: { fontSize: 22, marginBottom: 4 },
  metaLabel: { fontSize: 11, marginBottom: 2 },
  metaValue: { fontSize: 15, fontWeight: '700' },
  metaDivider: { width: 1 },
  section: { fontSize: 16, fontWeight: '700', marginBottom: 10 },
  card: { borderRadius: 12, borderWidth: 1, marginBottom: 24, overflow: 'hidden' },
  ingRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12 },
  ingText: { fontSize: 15, flex: 1 },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepNumText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  stepText: { fontSize: 15, lineHeight: 22, flex: 1 },
});
