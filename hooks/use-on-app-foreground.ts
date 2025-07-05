import { useEffect, useState } from 'react'
import { AppState } from 'react-native'

export function useOnAppForeground(callback: () => void) {
  const [appState, setAppState] = useState(AppState.currentState)

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        callback()
      }
      setAppState(nextAppState)
    })
    return () => subscription.remove()
  }, [callback, appState])
}
