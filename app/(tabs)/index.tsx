import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { RecipeCard } from '@/components/recipe-card';
import { RecipeSkeleton } from '@/components/skeleton';
import { Colors } from '@/constants/theme';
import { useLang } from '@/hooks/use-lang';
import { useTheme } from '@/hooks/use-theme';
import { detectIngredients } from '@/lib/detect-ingredients';
import { getRecipesFromImage, getRecipesFromText, Recipe } from '@/lib/gemini';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image, SafeAreaView,
  ScrollView,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View,
} from 'react-native';

const CUISINES = ['Any', 'Filipino', 'Italian', 'Asian', 'Mexican', 'American', 'Indian'];

export default function HomeScreen() {
  const [ingredients, setIngredients] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [pendingBase64, setPendingBase64] = useState<string | null>(null);
  const [detectedChips, setDetectedChips] = useState<string[]>([]);
  const [cuisine, setCuisine] = useState('Any');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [detecting, setDetecting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<(() => void) | null>(null);

  const [typedText, setTypedText] = useState('');

  useEffect(() => {
    const TYPEWRITER_TEXT = 'What ingredients do you have?';
    let i = 0;
    let interval: ReturnType<typeof setInterval>;

    function startTyping() {
      i = 0;
      setTypedText('');
      interval = setInterval(() => {
        i++;
        setTypedText(TYPEWRITER_TEXT.slice(0, i));
        if (i >= TYPEWRITER_TEXT.length) clearInterval(interval);
      }, 50);
    }

    startTyping();
    const repeat = setInterval(startTyping, 30000);
    return () => { clearInterval(interval); clearInterval(repeat); };
  }, []);

  const { scheme } = useTheme();
  const { lang } = useLang();
  const C = Colors[scheme];

  const router = useRouter();

  async function pickImage(useCamera: boolean) {
    const picker = useCamera ? ImagePicker.launchCameraAsync : ImagePicker.launchImageLibraryAsync;
    const result = await picker({ base64: true, quality: 0.7, mediaTypes: ['images'] });
    if (!result.canceled && result.assets[0].base64) {
      const b64 = result.assets[0].base64;
      setImage(result.assets[0].uri);
      setIngredients('');
      setRecipes([]);
      setError(null);
      setDetectedChips([]);
      setPendingBase64(b64);
      setDetecting(true);
      try {
        const detected = await detectIngredients(b64);
        setDetectedChips(detected);
      } catch {
        setError('Could not detect ingredients. Try typing them manually.');
      } finally {
        setDetecting(false);
      }
    }
  }

  async function generate() {
    const hasChips = detectedChips.length > 0;
    const hasText = ingredients.trim().length > 0;
    if (!hasChips && !hasText) { setError('Add ingredients or take a photo first.'); setLastAction(null); return; }
    setError(null);
    setLoading(true);
    setRecipes([]);
    const controller = new AbortController();
    setAbortController(controller);
    const action = async () => {
      setError(null);
      setLoading(true);
      setRecipes([]);
      const ctrl = new AbortController();
      setAbortController(ctrl);
      try {
        const ingredientList = hasChips ? detectedChips.join(', ') : ingredients.trim();
        const result = hasChips && pendingBase64
          ? await getRecipesFromImage(pendingBase64, 'image/jpeg', cuisine, lang)
          : await getRecipesFromText(ingredientList, cuisine, lang);
        if (!ctrl.signal.aborted) {
          if (result.length === 0) setError('No recipes found. Try different ingredients.');
          else setRecipes(result);
        }
      } catch (e: any) {
        if (!ctrl.signal.aborted)
          setError(e?.message ?? 'Something went wrong. Please try again.');
      } finally {
        setLoading(false);
        setAbortController(null);
      }
    };
    setLastAction(() => action);
    await action();
  }

  function stop() {
    abortController?.abort();
    setLoading(false);
    setAbortController(null);
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.background }]}>
      <View style={[styles.header, { backgroundColor: C.background }]}>
        <Image source={require('../../assets/images/splash-icon.png')} style={styles.headerLogo} resizeMode="contain" />
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={styles.profileBtn} onPress={() => router.push('/profile')}>
          <MaterialIcons name="person" size={28} color={C.tint} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={[styles.subtitle, { color: C.subtitle }]}>{typedText}</Text>
        <TextInput
          style={[styles.input, { backgroundColor: C.card, color: C.text, borderColor: error ? '#e05c00' : C.border }]}
          placeholder="e.g. egg, tomato, rice, garlic..."
          placeholderTextColor={C.subtitle}
          value={ingredients}
          onChangeText={(t) => { setIngredients(t); setImage(null); setDetectedChips([]); setPendingBase64(null); setError(null); }}
          multiline
        />

        {error && (
          <View style={[styles.errorBox, { backgroundColor: scheme === 'dark' ? '#3a1a1a' : '#fff0ee', borderColor: '#e05c00' }]}>
            <View style={styles.errorTop}>
              <Text style={[styles.errorText, { flex: 1 }]}>⚠️ {error}</Text>
              <TouchableOpacity onPress={() => setError(null)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text style={styles.errorDismiss}>✕</Text>
              </TouchableOpacity>
            </View>
            {lastAction && (
              <TouchableOpacity style={[styles.retryBtn, { backgroundColor: C.tint }]} onPress={() => lastAction()}>
                <Text style={styles.retryText}>↺ Retry</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <Text style={[styles.filterLabel, { color: C.subtitle }]}>Cuisine</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cuisineRow}>
          {CUISINES.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.chip, { backgroundColor: cuisine === c ? C.chipActiveBg : C.chipBg, borderColor: C.border }]}
              onPress={() => setCuisine(c)}
            >
              <Text style={[styles.chipText, { color: cuisine === c ? C.chipActiveText : C.chipText }]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={[styles.btnPrimary, { backgroundColor: loading ? '#888' : C.tint, opacity: detecting ? 0.7 : 1 }]}
          onPress={loading ? stop : generate}
          disabled={detecting}
        >
          <Text style={styles.btnText}>{loading ? '⏹ Stop' : '✨ Generate Recipes'}</Text>
        </TouchableOpacity>

        <View style={styles.row}>
          <TouchableOpacity style={[styles.btnSecondary, { backgroundColor: C.card, borderColor: C.border }]} onPress={() => pickImage(true)}>
            <Text style={[styles.btnSecondaryText, { color: C.text }]}>📷 Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btnSecondary, { backgroundColor: C.card, borderColor: C.border }]} onPress={() => pickImage(false)}>
            <Text style={[styles.btnSecondaryText, { color: C.text }]}>🖼 Gallery</Text>
          </TouchableOpacity>
        </View>

        {/* Image + detected ingredients attached below */}
        {image && (
          <View style={[styles.imageCard, { borderColor: C.border }]}>
            <Image source={{ uri: image }} style={styles.preview} />

            <View style={[styles.detectedBox, { backgroundColor: C.card }]}>
              {detecting ? (
                <View style={styles.detectingRow}>
                  <ActivityIndicator size="small" color={C.tint} />
                  <Text style={[styles.detectingText, { color: C.subtitle }]}>  Scanning for ingredients...</Text>
                </View>
              ) : (
                <>
                  <Text style={[styles.detectedLabel, { color: C.text }]}>
                    🥦 Detected Ingredients{'  '}
                    <Text style={[styles.detectedHint, { color: C.subtitle }]}>tap to remove</Text>
                  </Text>
                  {detectedChips.length === 0 ? (
                    <Text style={[styles.noDetected, { color: C.subtitle }]}>
                      No ingredients detected. Try a clearer photo or type them above.
                    </Text>
                  ) : (
                    <View style={styles.chipsWrap}>
                      {detectedChips.map((chip) => (
                        <TouchableOpacity
                          key={chip}
                          style={[styles.detectedChip, { backgroundColor: C.chipActiveBg }]}
                          onPress={() => setDetectedChips((prev) => prev.filter((c) => c !== chip))}
                        >
                          <Text style={styles.detectedChipText}>{chip}  ✕</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </>
              )}
            </View>
          </View>
        )}

        {loading && (
          <>
            <Text style={[styles.resultsHeader, { color: C.text }]}>🍽 Generating recipes...</Text>
            <RecipeSkeleton />
            <RecipeSkeleton />
            <RecipeSkeleton />
          </>
        )}

        {!loading && recipes.length > 0 && (
          <>
            <View style={styles.resultsRow}>
              <Text style={[styles.resultsHeader, { color: C.text }]}>🍽 Recipes for you</Text>
              <TouchableOpacity style={[styles.generateAgainBtn, { borderColor: C.tint }]} onPress={generate}>
                <Text style={[styles.generateAgainText, { color: C.tint }]}>🔄 Generate Again</Text>
              </TouchableOpacity>
            </View>
            {recipes.map((r, i) => <RecipeCard key={i} recipe={r} />)}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 20, paddingBottom: 40, paddingTop: 8 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, paddingBottom: 8, paddingHorizontal: 20 },
  headerLogo: { width: 56, height: 56 },
  profileBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  byline: { fontSize: 11, opacity: 0.6 },
  subtitle: { fontSize: 14, fontWeight: '600', marginBottom: 8, textAlign: 'center' },
  input: {
    borderRadius: 12, padding: 14, fontSize: 15, borderWidth: 1,
    minHeight: 80, textAlignVertical: 'top', marginBottom: 12,
  },
  errorBox: { borderRadius: 10, borderWidth: 1, padding: 12, marginBottom: 12 },
  errorTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  errorText: { color: '#e05c00', fontSize: 13, fontWeight: '500' },
  errorDismiss: { color: '#e05c00', fontSize: 16, fontWeight: '700' },
  retryBtn: { marginTop: 10, borderRadius: 8, paddingVertical: 8, alignItems: 'center' },
  retryText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  filterLabel: { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  cuisineRow: { flexDirection: 'row', marginBottom: 16 },
  chip: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, marginRight: 8, borderWidth: 1 },
  chipText: { fontSize: 13, fontWeight: '600' },
  btnPrimary: { borderRadius: 12, padding: 15, alignItems: 'center', marginBottom: 12 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  row: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  btnSecondary: { flex: 1, borderRadius: 12, padding: 13, alignItems: 'center', borderWidth: 1 },
  btnSecondaryText: { fontSize: 15, fontWeight: '600' },
  imageCard: {
    borderWidth: 1, borderRadius: 12, overflow: 'hidden', marginBottom: 16,
  },
  preview: { width: '100%', height: 200, resizeMode: 'cover' },
  detectedBox: { padding: 14 },
  detectingRow: { flexDirection: 'row', alignItems: 'center' },
  detectingText: { fontSize: 13 },
  detectedLabel: { fontSize: 14, fontWeight: '700', marginBottom: 10 },
  detectedHint: { fontSize: 12, fontWeight: '400' },
  noDetected: { fontSize: 13 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  detectedChip: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  detectedChipText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  resultsHeader: { fontSize: 18, fontWeight: '700', marginTop: 8 },
  resultsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, marginTop: 8 },
  generateAgainBtn: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1 },
  generateAgainText: { fontSize: 12, fontWeight: '700' },
});
