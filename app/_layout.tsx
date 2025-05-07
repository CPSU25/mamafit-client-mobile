import '~/global.css'

import * as React from 'react'
import AppProvider from '~/components/providers/app.provider'
import { DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Platform } from 'react-native'
import { NAV_THEME } from '~/lib/constants'

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light
}

export { ErrorBoundary } from 'expo-router'

export default function RootLayout() {
  const hasMounted = React.useRef(false)
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false)

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return
    }

    if (Platform.OS === 'web') {
      // Adds the background color to the html element to prevent white background on overscroll.
      document.documentElement.classList.add('bg-background')
    }
    setIsColorSchemeLoaded(true)
    hasMounted.current = true
  }, [])

  if (!isColorSchemeLoaded) {
    return null
  }

  return (
    <AppProvider>
      <ThemeProvider value={LIGHT_THEME}>
        <StatusBar style={'dark'} />
        <Stack screenOptions={{ animation: 'slide_from_right' }}>
          <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
          <Stack.Screen name='product/[id]' options={{ title: 'Product Detail', headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </AppProvider>
  )
}

const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect
