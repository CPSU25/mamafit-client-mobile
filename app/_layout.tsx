import '~/global.css'

import * as React from 'react'
import * as Notifications from 'expo-notifications'
import AppProvider from '~/components/providers/app.provider'
import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Platform } from 'react-native'
import { useColorScheme } from '~/hooks/use-color-scheme'
import { NAV_THEME } from '~/lib/constants'

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light
}

const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark
}

export { ErrorBoundary } from 'expo-router'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true
  })
})

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const hasMounted = React.useRef(false)
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false)
  const { isDarkColorScheme } = useColorScheme()
  const [fontsLoaded] = useFonts({
    'Roboto-Light': require('~/assets/fonts/Roboto-Light.ttf'),
    'Roboto-Regular': require('~/assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Medium': require('~/assets/fonts/Roboto-Medium.ttf'),
    'Roboto-SemiBold': require('~/assets/fonts/Roboto-SemiBold.ttf'),
    'Roboto-Bold': require('~/assets/fonts/Roboto-Bold.ttf'),
    'Roboto-ExtraBold': require('~/assets/fonts/Roboto-ExtraBold.ttf')
  })

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

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!isColorSchemeLoaded || !fontsLoaded) {
    return null
  }

  return (
    <AppProvider>
      <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
        <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
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
