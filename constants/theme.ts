/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#e05c00';
const tintColorDark = '#ff8c42';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fdf6ee',
    card: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    subtitle: '#666',
    border: '#e8e0d8',
    chipBg: '#fff',
    chipActiveBg: '#e05c00',
    chipText: '#444',
    chipActiveText: '#fff',
    stepBg: '#fff5ee',
    stepNum: '#e05c00',
  },
  dark: {
    text: '#ECEDEE',
    background: '#1a1a1a',
    card: '#2a2a2a',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    subtitle: '#9BA1A6',
    border: '#3a3a3a',
    chipBg: '#2a2a2a',
    chipActiveBg: '#ff8c42',
    chipText: '#ccc',
    chipActiveText: '#fff',
    stepBg: '#2a2a2a',
    stepNum: '#ff8c42',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
