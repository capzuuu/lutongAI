import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function ExploreScreen() {
  const { scheme } = useTheme();
  const C = Colors[scheme];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.background }]}>
      <View style={styles.container}>
        <Text style={styles.emoji}>🍳</Text>
        <Text style={[styles.title, { color: C.tint }]}>Something's cooking...</Text>
        <Text style={[styles.subtitle, { color: C.subtitle }]}>This page is being prepared.{'\n'}Check back soon!</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emoji: { fontSize: 72, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '800', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 15, textAlign: 'center', lineHeight: 24 },
});
