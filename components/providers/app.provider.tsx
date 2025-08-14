import { PortalHost } from '@rn-primitives/portal'
import { focusManager } from '@tanstack/react-query'
import { useEffect } from 'react'
import { AppState, AppStateStatus, Platform } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { Provider } from 'react-redux'
import { Toaster } from 'sonner-native'
import { store } from '~/lib/redux-toolkit/store'
import NotificationProvider from './notifications.provider'
import QueryProvider from './query.provider'
import SignalRProvider from './signalr.provider'

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
    <Provider store={store}>
      <QueryProvider>
        <KeyboardProvider>
          <GestureHandlerRootView>
            <NotificationProvider>
              <SignalRProvider>
                {children}
                <PortalHost />
                <Toaster />
              </SignalRProvider>
            </NotificationProvider>
          </GestureHandlerRootView>
        </KeyboardProvider>
      </QueryProvider>
    </Provider>
  )
}
