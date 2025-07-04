import NetInfo, { NetInfoState } from '@react-native-community/netinfo'
import { useEffect, useState } from 'react'
import { AppState, AppStateStatus } from 'react-native'
import signalRService from '~/services/signalr.service'
import { useAuth } from './use-auth'

export const useSignalRConnection = () => {
  const { isAuthenticated } = useAuth()
  const [connectionState, setConnectionState] = useState(signalRService.currentConnectionState)
  const [reconnectAttempts, setReconnectAttempts] = useState(0)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState)
  const [networkStatus, setNetworkStatus] = useState<boolean>(true)
  const [messageCount, setMessageCount] = useState(0)

  // Update connection state and reconnect attempts periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionState(signalRService.currentConnectionState)
      setReconnectAttempts(signalRService.getReconnectAttempts || 0)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Listen for SignalR errors
  useEffect(() => {
    const handleError = (error: unknown) => setErrorMessage(error as string)
    signalRService.on('Error', handleError)
    return () => signalRService.off('Error', handleError)
  }, [])

  // Monitor app state changes (foreground/background)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', setAppState)
    return () => subscription.remove()
  }, [])

  // Monitor network status changes
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setNetworkStatus(!!state.isConnected)
    })
    return () => unsubscribe()
  }, [])

  // Count incoming SignalR messages
  useEffect(() => {
    const messageHandler = () => setMessageCount((prev) => prev + 1)
    signalRService.on('ReceiveMessage', messageHandler)
    return () => signalRService.off('ReceiveMessage', messageHandler)
  }, [])

  return {
    isAuthenticated,
    connectionState,
    reconnectAttempts,
    errorMessage,
    appState,
    networkStatus,
    messageCount
  }
}
