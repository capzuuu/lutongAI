import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

function SkeletonBox({ width, height, style }: { width: number | string; height: number; style?: object }) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, [opacity]);

  const { scheme } = useTheme();
  const bg = scheme === 'dark' ? '#3a3a3a' : '#e0d8d0';

  return <Animated.View style={[{ width, height, borderRadius: 6, backgroundColor: bg, opacity }, style]} />;
}

export function RecipeSkeleton() {
  const { scheme } = useTheme();
  const C = Colors[scheme];

  return (
    <View style={[styles.card, { backgroundColor: C.card, borderColor: C.border }]}>
      <SkeletonBox width="70%" height={18} style={{ marginBottom: 10 }} />
      <View style={styles.row}>
        <SkeletonBox width={80} height={13} />
        <SkeletonBox width={80} height={13} />
      </View>
      <SkeletonBox width={120} height={12} style={{ marginTop: 10 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  row: { flexDirection: 'row', gap: 12 },
});
