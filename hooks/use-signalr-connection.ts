import NetInfo, { NetInfoState } from '@react-native-community/netinfo'
import { useEffect, useState } from 'react'
import { AppState, AppStateStatus } from 'react-native'
import chatHubService from '~/services/signalr/chat-hub.service'
import { useAuth } from './use-auth'

export const useSignalRConnection = () => {
  const { isAuthenticated } = useAuth()
  const [connectionState, setConnectionState] = useState(chatHubService.currentConnectionState)
  const [reconnectAttempts, setReconnectAttempts] = useState(0)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState)
  const [networkStatus, setNetworkStatus] = useState<boolean>(true)
  const [messageCount, setMessageCount] = useState(0)

  // Update connection state and reconnect attempts periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionState(chatHubService.currentConnectionState)
      setReconnectAttempts(chatHubService.getReconnectAttempts || 0)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Listen for SignalR errors
  useEffect(() => {
    const handleError = (error: unknown) => setErrorMessage(error as string)
    chatHubService.on('Error', handleError)
    return () => chatHubService.off('Error', handleError)
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
    chatHubService.on('ReceiveMessage', messageHandler)
    return () => chatHubService.off('ReceiveMessage', messageHandler)
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
