import QueryProvider from './query.provider'
import NotificationProvider from './notifications.provider'
import { useEffect } from 'react'
import { AppState, AppStateStatus, Platform } from 'react-native'
import { focusManager } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { store } from '~/lib/redux-toolkit/store'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { PortalHost } from '@rn-primitives/portal'

const onAppStateChange = (status: AppStateStatus) => {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active')
  }
}

export default function AppProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange)

    return () => subscription.remove()
  }, [])

  return (
    <KeyboardProvider>
      <GestureHandlerRootView>
        <Provider store={store}>
          <NotificationProvider>
            <QueryProvider>{children}</QueryProvider>
            <PortalHost />
          </NotificationProvider>
        </Provider>
      </GestureHandlerRootView>
    </KeyboardProvider>
  )
}
