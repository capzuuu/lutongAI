import { Colors } from '@/constants/theme';
import { useFavorites } from '@/hooks/use-favorites';
import { useLang } from '@/hooks/use-lang';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const { scheme, toggle } = useTheme();
  const { lang, setLang } = useLang();
  const { clearAll } = useFavorites();
  const C = Colors[scheme];

  function confirmClear() {
    Alert.alert(
      'Clear Saved Recipes',
      'Are you sure you want to delete all saved recipes? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: clearAll },
      ]
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.background }]}>
      <View style={[styles.header, { backgroundColor: C.background }]}>
        <Text style={[styles.headerTitle, { color: C.tint }]}>⚙️ Settings</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.card, { backgroundColor: C.card, borderColor: C.border }]}>
          <View style={styles.row}>
            <View>
              <Text style={[styles.label, { color: C.text }]}>Dark Mode</Text>
              <Text style={[styles.sub, { color: C.subtitle }]}>
                {scheme === 'dark' ? 'Currently dark' : 'Currently light'}
              </Text>
            </View>
            <Switch
              value={scheme === 'dark'}
              onValueChange={toggle}
              trackColor={{ false: C.border, true: C.tint }}
              thumbColor="#fff"
            />
          </View>

          <View style={[styles.divider, { backgroundColor: C.border }]} />

          <View style={styles.row}>
            <View>
              <Text style={[styles.label, { color: C.text }]}>Recipe Language</Text>
              <Text style={[styles.sub, { color: C.subtitle }]}>Generated recipes will be in</Text>
            </View>
            <View style={[styles.langToggle, { borderColor: C.border }]}>
              <TouchableOpacity
                style={[styles.langBtn, lang === 'english' && { backgroundColor: C.tint }]}
                onPress={() => setLang('english')}
              >
                <Text style={[styles.langBtnText, { color: lang === 'english' ? '#fff' : C.text }]}>EN</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.langBtn, lang === 'tagalog' && { backgroundColor: C.tint }]}
                onPress={() => setLang('tagalog')}
              >
                <Text style={[styles.langBtnText, { color: lang === 'tagalog' ? '#fff' : C.text }]}>TL</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: C.card, borderColor: C.border, marginTop: 16 }]}>
          <TouchableOpacity style={styles.row} onPress={confirmClear}>
            <View>
              <Text style={[styles.label, { color: '#e05c00' }]}>Clear Saved Recipes</Text>
              <Text style={[styles.sub, { color: C.subtitle }]}>Delete all your saved recipes</Text>
            </View>
            <Text style={{ fontSize: 18 }}>🗑️</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, { backgroundColor: C.card, borderColor: C.border, marginTop: 16 }]}>
          <View style={styles.aboutRow}>
            <Image source={require('../../assets/images/splash-icon.png')} style={styles.aboutLogo} resizeMode="contain" />
            <Text style={[styles.sub, { color: C.subtitle, marginTop: 6 }]}>
              An AI-powered recipe generator that turns your ingredients into delicious meals.
            </Text>
            <Text style={[styles.sub, { color: C.subtitle, marginTop: 4 }]}>by: Joemar</Text>
          </View>
        </View>

        <Text style={styles.version}>v1.0.0-beta</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingTop: 60, paddingBottom: 8, paddingHorizontal: 20 },
  headerTitle: { fontSize: 22, fontWeight: '800' },
  container: { paddingBottom: 40, flexGrow: 1 },
  title: { fontSize: 28, fontWeight: '800', textAlign: 'center', marginTop: 8, marginBottom: 24 },
  card: { marginHorizontal: 20, borderRadius: 12, borderWidth: 1, paddingHorizontal: 16 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14 },
  divider: { height: 1 },
  label: { fontSize: 16, fontWeight: '600' },
  sub: { fontSize: 13, marginTop: 2 },
  langToggle: { flexDirection: 'row', borderRadius: 8, borderWidth: 1, overflow: 'hidden' },
  langBtn: { paddingHorizontal: 14, paddingVertical: 7 },
  langBtnText: { fontSize: 13, fontWeight: '700' },
  aboutRow: { paddingVertical: 14, alignItems: 'center' },
  aboutLogo: { width: 80, height: 80 },
  version: { textAlign: 'center', fontSize: 12, color: '#aaa', marginTop: 24 },
});
