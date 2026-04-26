import * as Network from 'expo-network';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SplashScreen() {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.85)).current;
  const barWidth = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;
  const barAnim = useRef<Animated.CompositeAnimation | null>(null);

  const [status, setStatus] = useState<'loading' | 'no-internet' | 'done'>('loading');

  useEffect(() => {
    // Fade + spring logo in
    Animated.parallel([
      Animated.timing(logoOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start(() => checkAndLoad());
  }, []);

  async function checkAndLoad() {
    setStatus('loading');
    barWidth.setValue(0);

    // Fill to 30% while checking
    barAnim.current = Animated.timing(barWidth, { toValue: 30, duration: 600, useNativeDriver: false });
    barAnim.current.start();

    const network = await Network.getNetworkStateAsync();

    if (!network.isConnected || !network.isInternetReachable) {
      // Stop at 30% and show error
      setStatus('no-internet');
      return;
    }

    // Connected — fill remaining to 100%
    barAnim.current = Animated.timing(barWidth, { toValue: 100, duration: 1800, useNativeDriver: false });
    barAnim.current.start(({ finished }) => {
      if (finished) {
        setStatus('done');
        Animated.timing(screenOpacity, { toValue: 0, duration: 400, useNativeDriver: true }).start(() =>
          router.replace('/(tabs)')
        );
      }
    });
  }

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      <Animated.Image
        source={require('../assets/images/splash-icon.png')}
        style={[styles.logo, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}
        resizeMode="contain"
      />

      <Animated.View style={[styles.barWrapper, { opacity: logoOpacity }]}>
        <View style={styles.barTrack}>
          <Animated.View
            style={[styles.barFill, {
              width: barWidth.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
              backgroundColor: status === 'no-internet' ? '#e05c00' : '#FF6B00',
            }]}
          />
        </View>

        {status === 'no-internet' && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>📡 No internet connection</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={checkAndLoad}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {status === 'loading' && (
          <Text style={styles.statusText}>Connecting...</Text>
        )}
      </Animated.View>

      <Animated.View style={[styles.footer, { opacity: logoOpacity }]}>
        <Text style={styles.footerBy}>by: Joemar</Text>
        <Text style={styles.footerVersion}>v1.0.0-beta</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center' },
  logo: { width: 200, height: 200, marginBottom: 40 },
  barWrapper: { width: '60%', alignItems: 'center', gap: 14 },
  barTrack: { width: '100%', height: 8, borderRadius: 99, backgroundColor: '#f0e0d0', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 99 },
  errorBox: { alignItems: 'center', gap: 10 },
  errorText: { fontSize: 13, color: '#e05c00', fontWeight: '600' },
  retryBtn: { backgroundColor: '#FF6B00', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 },
  retryText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  statusText: { fontSize: 12, color: '#aaa' },
  footer: { position: 'absolute', bottom: 40, alignItems: 'center', gap: 2 },
  footerBy: { fontSize: 12, color: '#aaa', fontWeight: '500' },
  footerVersion: { fontSize: 11, color: '#ccc' },
});
