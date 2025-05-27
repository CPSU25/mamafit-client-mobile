import '~/global.css'

import * as React from 'react'
import * as Notifications from 'expo-notifications'
import AppProvider from '~/components/providers/app.provider'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Platform } from 'react-native'
import { useColorScheme } from '~/hooks/use-color-scheme'
import { NAV_THEME } from '~/lib/constants'
import { AntDesign, Feather } from '@expo/vector-icons'

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

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GCP_WEB_CLIENT_ID,
  profileImageSize: 150
})

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const hasMounted = React.useRef(false)
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false)
  const { colorScheme, isDarkColorScheme } = useColorScheme()
  const [fontsLoaded] = useFonts({
    ...Feather.font,
    ...AntDesign.font,
    'Inter-Light': require('~/assets/fonts/Inter-Light.ttf'),
    'Inter-Regular': require('~/assets/fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('~/assets/fonts/Inter-Medium.ttf'),
    'Inter-SemiBold': require('~/assets/fonts/Inter-SemiBold.ttf'),
    'Inter-Bold': require('~/assets/fonts/Inter-Bold.ttf'),
    'Inter-ExtraBold': require('~/assets/fonts/Inter-ExtraBold.ttf')
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
        <Stack>
          <Stack.Screen name='(tabs)' options={{ headerShown: false, animation: 'ios_from_right' }} />
          <Stack.Screen
            name='product/[id]'
            options={{ title: 'Product Detail', headerShown: false, animation: 'ios_from_right' }}
          />
          <Stack.Screen name='search' options={{ title: 'Search', headerShown: false, animation: 'none' }} />
          <Stack.Screen name='chat' options={{ title: 'Chat', headerShown: false, animation: 'ios_from_right' }} />
          <Stack.Screen name='cart' options={{ title: 'Cart', headerShown: false, animation: 'ios_from_right' }} />
          <Stack.Screen
            name='auth'
            options={{ title: 'Auth Screen', headerShown: false, animation: 'ios_from_right' }}
          />
        </Stack>
      </ThemeProvider>
    </AppProvider>
  )
}

const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect
