import QueryProvider from './query.provider'
import { useEffect } from 'react'
import { AppState, AppStateStatus, Platform } from 'react-native'
import { focusManager } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { store } from '~/lib/redux-toolkit/store'

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
      <QueryProvider>{children}</QueryProvider>
    </Provider>
  )
}
