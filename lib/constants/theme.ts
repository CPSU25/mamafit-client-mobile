import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native'

const h = (v: string) => `hsl(${v})`

export const THEME = {
  light: {
    background: h('0 0% 100%'),
    foreground: h('224 71.4% 4.1%'),
    card: h('0 0% 100%'),
    cardForeground: h('224 71.4% 4.1%'),
    popover: h('0 0% 100%'),
    popoverForeground: h('224 71.4% 4.1%'),
    primary: h('262.1 83.3% 57.8%'),
    primaryForeground: h('210 20% 98%'),
    secondary: h('220 14.3% 95.9%'),
    secondaryForeground: h('220.9 39.3% 11%'),
    muted: h('220 14.3% 95.9%'),
    mutedForeground: h('220 8.9% 46.1%'),
    accent: h('220 14.3% 95.9%'),
    accentForeground: h('220.9 39.3% 11%'),
    destructive: h('0 84.2% 60.2%'),
    destructiveForeground: h('210 20% 98%'),
    border: h('220 13% 91%'),
    input: h('220 13% 91%'),
    ring: h('262.1 83.3% 57.8%')
  },
  dark: {
    background: h('224 71.4% 4.1%'),
    foreground: h('210 20% 98%'),
    card: h('224 71.4% 4.1%'),
    cardForeground: h('210 20% 98%'),
    popover: h('224 71.4% 4.1%'),
    popoverForeground: h('210 20% 98%'),
    primary: h('263.4 70% 50.4%'),
    primaryForeground: h('210 20% 98%'),
    secondary: h('215 27.9% 16.9%'),
    secondaryForeground: h('210 20% 98%'),
    muted: h('215 27.9% 16.9%'),
    mutedForeground: h('217.9 10.6% 64.9%'),
    accent: h('215 27.9% 16.9%'),
    accentForeground: h('210 20% 98%'),
    destructive: h('0 62.8% 30.6%'),
    destructiveForeground: h('210 20% 98%'),
    border: h('215 27.9% 16.9%'),
    input: h('215 27.9% 16.9%'),
    ring: h('263.4 70% 50.4%')
  }
}

export const NAV_THEME: Record<'light' | 'dark', Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground
    }
  },
  dark: {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground
    }
  }
}
