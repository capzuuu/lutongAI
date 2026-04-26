import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
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
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 10 },
  subtitle: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
});
