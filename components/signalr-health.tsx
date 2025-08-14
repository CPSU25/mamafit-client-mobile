import { Feather } from '@expo/vector-icons'
import { View } from 'react-native'
import { useSignalRConnection } from '~/hooks/use-signalr-connection'
import { Card } from './ui/card'
import { Separator } from './ui/separator'
import { Text } from './ui/text'

export default function SignalRHealth() {
  const { reconnectAttempts, errorMessage, appState, networkStatus, messageCount, connectionState, isAuthenticated } =
    useSignalRConnection()

  return (
    <Card className='m-4'>
      <View className='flex flex-row items-center gap-2 py-2 px-4'>
        <Text className='font-inter-medium text-sm flex-1'>SignalR Health</Text>
        {networkStatus ? (
          <Feather name='wifi' size={18} color='#10b981' />
        ) : (
          <Feather name='wifi-off' size={18} color='#f43f5e' />
        )}
        {isAuthenticated ? (
          <Feather name='user-check' size={18} color='#10b981' />
        ) : (
          <Feather name='user-x' size={18} color='#f43f5e' />
        )}
        {connectionState === 'connected' && <Feather name='check-circle' size={18} color='#10b981' />}
        {connectionState === 'connecting' && <Feather name='loader' size={18} color='#f59e0b' />}
        {connectionState === 'disconnected' && <Feather name='x-circle' size={18} color='#f43f5e' />}
        {connectionState === 'reconnecting' && <Feather name='loader' size={18} color='#f59e0b' />}
      </View>
      <Separator />
      <View className='gap-1 py-2 px-4'>
        <Text className='text-xs text-muted-foreground'>Reconnect Attempts: {reconnectAttempts}</Text>
        <Text className='text-xs text-muted-foreground'>Error Message: {errorMessage || 'N/A'}</Text>
        <Text className='text-xs text-muted-foreground'>App State: {appState}</Text>
        <Text className='text-xs text-muted-foreground'>Messages: {messageCount}</Text>
      </View>
    </Card>
  )
}
