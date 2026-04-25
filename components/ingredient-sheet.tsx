import React, { useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet,
  useColorScheme, ActivityIndicator,
} from 'react-native';
import BottomSheet, { BottomSheetScrollView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Colors } from '@/constants/theme';

export interface IngredientSheetRef {
  open: () => void;
  close: () => void;
}

interface Props {
  imageUri: string | null;
  chips: string[];
  detecting: boolean;
  onRemove: (chip: string) => void;
  onConfirm: () => void;
}

const SNAP_POINTS = ['55%', '85%'];

const IngredientSheet = forwardRef<IngredientSheetRef, Props>(
  ({ imageUri, chips, detecting, onRemove, onConfirm }, ref) => {
    const sheetRef = useRef<BottomSheet>(null);
    const scheme = useColorScheme() ?? 'light';
    const C = Colors[scheme];

    useImperativeHandle(ref, () => ({
      open: () => sheetRef.current?.snapToIndex(0),
      close: () => sheetRef.current?.close(),
    }));

    const renderBackdrop = useCallback(
      (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
      []
    );

    return (
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={SNAP_POINTS}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: C.card }}
        handleIndicatorStyle={{ backgroundColor: C.border }}
      >
        <BottomSheetScrollView contentContainerStyle={styles.container}>
          {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

          <Text style={[styles.title, { color: C.text }]}>Detected Ingredients</Text>
          <Text style={[styles.subtitle, { color: C.subtitle }]}>Tap any ingredient to remove it</Text>

          {detecting ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={C.tint} />
              <Text style={[styles.detectingText, { color: C.subtitle }]}>Scanning image...</Text>
            </View>
          ) : chips.length === 0 ? (
            <Text style={[styles.emptyText, { color: C.subtitle }]}>No ingredients detected. Try a clearer photo.</Text>
          ) : (
            <View style={styles.chipsWrap}>
              {chips.map((chip) => (
                <TouchableOpacity
                  key={chip}
                  style={[styles.chip, { backgroundColor: C.chipActiveBg }]}
                  onPress={() => onRemove(chip)}
                >
                  <Text style={styles.chipText}>{chip}  ✕</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: C.tint, opacity: detecting || chips.length === 0 ? 0.5 : 1 }]}
            onPress={() => { sheetRef.current?.close(); onConfirm(); }}
            disabled={detecting || chips.length === 0}
          >
            <Text style={styles.btnText}>✨ Cook These ({chips.length})</Text>
          </TouchableOpacity>
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }
);

export default IngredientSheet;

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  image: { width: '100%', height: 180, borderRadius: 12, marginBottom: 16, resizeMode: 'cover' },
  title: { fontSize: 20, fontWeight: '800', marginBottom: 4 },
  subtitle: { fontSize: 13, marginBottom: 16 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  detectingText: { fontSize: 14 },
  emptyText: { fontSize: 14, marginBottom: 16 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  chip: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  chipText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  btn: { borderRadius: 12, padding: 15, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
